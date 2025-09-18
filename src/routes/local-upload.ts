import { Hono } from 'hono';
import { Bindings } from '../types';

const localUploadApi = new Hono<{ Bindings: Bindings }>();

// Store images in Cloudflare D1 as base64 (for small images)
// This is a simple solution that doesn't require external services
localUploadApi.post('/admin/upload-local', async (c) => {
  const { env } = c;
  
  try {
    const formData = await c.req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return c.json({ error: 'No image provided' }, 400);
    }
    
    // Check file size (max 2MB for D1 storage)
    if (file.size > 2 * 1024 * 1024) {
      return c.json({ error: 'File size too large. Maximum 2MB allowed for local storage.' }, 400);
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only JPEG, PNG, GIF, WebP and SVG are allowed.' }, 400);
    }
    
    // Convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const dataUrl = `data:${file.type};base64,${base64}`;
    
    // Generate unique ID for the image
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Store in database
    try {
      // Create images table if not exists
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS uploaded_images (
          id TEXT PRIMARY KEY,
          filename TEXT NOT NULL,
          mime_type TEXT NOT NULL,
          size INTEGER NOT NULL,
          data_url TEXT NOT NULL,
          uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run();
      
      // Insert image
      await env.DB.prepare(`
        INSERT INTO uploaded_images (id, filename, mime_type, size, data_url)
        VALUES (?, ?, ?, ?, ?)
      `).bind(imageId, file.name, file.type, file.size, dataUrl).run();
      
      // Return the URL to access the image
      const imageUrl = `/api/images/${imageId}`;
      
      return c.json({ 
        success: true, 
        url: imageUrl,
        directUrl: dataUrl,
        message: 'Image uploaded to local storage successfully',
        imageId: imageId
      });
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      return c.json({ error: 'Failed to store image in database' }, 500);
    }
    
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Failed to upload image' }, 500);
  }
});

// Serve images from database
localUploadApi.get('/images/:id', async (c) => {
  const { env } = c;
  const imageId = c.req.param('id');
  
  try {
    const image = await env.DB.prepare(
      'SELECT data_url, mime_type FROM uploaded_images WHERE id = ?'
    ).bind(imageId).first();
    
    if (!image) {
      return c.json({ error: 'Image not found' }, 404);
    }
    
    // Extract base64 data from data URL
    const base64Data = (image.data_url as string).split(',')[1];
    const binaryData = atob(base64Data);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }
    
    return new Response(bytes, {
      headers: {
        'Content-Type': image.mime_type as string,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      }
    });
    
  } catch (error) {
    console.error('Error fetching image:', error);
    return c.json({ error: 'Failed to fetch image' }, 500);
  }
});

// List all uploaded images
localUploadApi.get('/admin/images', async (c) => {
  const { env } = c;
  
  try {
    const images = await env.DB.prepare(`
      SELECT id, filename, mime_type, size, uploaded_at 
      FROM uploaded_images 
      ORDER BY uploaded_at DESC 
      LIMIT 100
    `).all();
    
    return c.json({
      success: true,
      images: images.results?.map(img => ({
        ...img,
        url: `/api/images/${img.id}`
      }))
    });
    
  } catch (error) {
    console.error('Error listing images:', error);
    return c.json({ error: 'Failed to list images' }, 500);
  }
});

// Delete an image
localUploadApi.delete('/admin/images/:id', async (c) => {
  const { env } = c;
  const imageId = c.req.param('id');
  
  try {
    await env.DB.prepare(
      'DELETE FROM uploaded_images WHERE id = ?'
    ).bind(imageId).run();
    
    return c.json({ success: true, message: 'Image deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting image:', error);
    return c.json({ error: 'Failed to delete image' }, 500);
  }
});

// Upload using Cloudflare R2 (if configured)
localUploadApi.post('/admin/upload-r2', async (c) => {
  const { env } = c;
  
  // Check if R2 is configured
  if (!env.R2_BUCKET) {
    return c.json({ error: 'R2 storage not configured. Please follow setup-r2.md instructions.' }, 503);
  }
  
  try {
    const formData = await c.req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return c.json({ error: 'No image provided' }, 400);
    }
    
    // Check file size (max 10MB for R2)
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: 'File size too large. Maximum 10MB allowed.' }, 400);
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `casino-logos/${timestamp}-${randomStr}.${extension}`;
    
    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await env.R2_BUCKET.put(filename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000',
      },
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    });
    
    // Get public URL from environment or construct it
    const publicUrl = env.R2_PUBLIC_URL 
      ? `${env.R2_PUBLIC_URL}/${filename}`
      : `/api/r2-images/${filename}`;
    
    return c.json({ 
      success: true, 
      url: publicUrl,
      filename: filename,
      message: 'Image uploaded to R2 successfully'
    });
    
  } catch (error) {
    console.error('R2 upload error:', error);
    return c.json({ error: 'Failed to upload to R2: ' + error.message }, 500);
  }
});

// Serve images from R2 (fallback if public URL not available)
localUploadApi.get('/r2-images/*', async (c) => {
  const { env } = c;
  
  if (!env.R2_BUCKET) {
    return c.json({ error: 'R2 not configured' }, 503);
  }
  
  const path = c.req.path.replace('/api/r2-images/', '');
  
  try {
    const object = await env.R2_BUCKET.get(path);
    
    if (!object) {
      return c.json({ error: 'Image not found' }, 404);
    }
    
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000');
    
    return new Response(object.body, { headers });
    
  } catch (error) {
    console.error('R2 fetch error:', error);
    return c.json({ error: 'Failed to fetch image from R2' }, 500);
  }
});

export default localUploadApi;