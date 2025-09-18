import { Hono } from 'hono';
import { Bindings } from '../types';
import { uploadImage } from '../utils/image-upload';

const uploadApi = new Hono<{ Bindings: Bindings }>();

// Image upload endpoint using imgbb.com free service
uploadApi.post('/admin/upload-image', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return c.json({ error: 'No image provided' }, 400);
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: 'File size too large. Maximum 10MB allowed.' }, 400);
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only JPEG, PNG, GIF, WebP and SVG are allowed.' }, 400);
    }
    
    // Use the upload utility function
    const result = await uploadImage(file);
    
    return c.json({ 
      success: true, 
      url: result.url,
      message: result.message
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Failed to upload image' }, 500);
  }
});

// Helper function to upload to a free image service
async function uploadToImageService(file: File, base64: string): Promise<string | null> {
  try {
    // Option 1: Use freeimage.host (no API key required)
    const formData = new FormData();
    formData.append('source', base64);
    formData.append('format', 'json');
    
    const response = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'X-API-Key': 'free_api_key' // Free tier
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.image && data.image.url) {
        return data.image.url;
      }
    }
  } catch (error) {
    console.error('External upload failed:', error);
  }
  
  // Fallback: Return null to use base64
  return null;
}

// Alternative: Upload to Cloudflare R2 (if configured)
uploadApi.post('/admin/upload-to-r2', async (c) => {
  const { env } = c;
  
  // Check if R2 bucket is configured
  if (!env.R2) {
    return c.json({ error: 'R2 storage not configured' }, 503);
  }
  
  try {
    const formData = await c.req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return c.json({ error: 'No image provided' }, 400);
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `casino-logos/${timestamp}-${randomStr}.${extension}`;
    
    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await env.R2.put(filename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });
    
    // Return public URL (you need to configure R2 public access)
    const publicUrl = `https://your-r2-bucket.com/${filename}`;
    
    return c.json({ 
      success: true, 
      url: publicUrl,
      filename: filename 
    });
    
  } catch (error) {
    console.error('R2 upload error:', error);
    return c.json({ error: 'Failed to upload to R2' }, 500);
  }
});

export default uploadApi;