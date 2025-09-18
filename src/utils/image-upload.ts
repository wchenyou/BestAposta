// Image upload utilities using free image hosting services
// For production, use Cloudflare R2 or Images

export async function uploadImageToCloudinary(file: File): Promise<string | null> {
  try {
    // Free Cloudinary account (demo credentials - replace with your own)
    const CLOUDINARY_CLOUD_NAME = 'demo';
    const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // Unsigned upload preset
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'casino-logos');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.secure_url;
    }
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
  }
  
  return null;
}

export async function uploadImageToImgur(file: File): Promise<string | null> {
  try {
    // Imgur anonymous upload (no account needed)
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'file');
    
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': 'Client-ID a0f3e8c4b5d6f7a' // Public client ID for anonymous uploads
      },
      body: formData
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.data && data.data.link) {
        return data.data.link;
      }
    }
  } catch (error) {
    console.error('Imgur upload failed:', error);
  }
  
  return null;
}

export async function convertToBase64DataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Main upload function with fallbacks
export async function uploadImage(file: File): Promise<{ url: string; message: string }> {
  // Validate file
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size too large. Maximum 10MB allowed.');
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, WebP and SVG are allowed.');
  }
  
  // Try different upload methods in order of preference
  
  // Method 1: Try Imgur (most reliable free service)
  const imgurUrl = await uploadImageToImgur(file);
  if (imgurUrl) {
    return { url: imgurUrl, message: 'Image uploaded to Imgur successfully' };
  }
  
  // Method 2: Try Cloudinary (requires account but more features)
  const cloudinaryUrl = await uploadImageToCloudinary(file);
  if (cloudinaryUrl) {
    return { url: cloudinaryUrl, message: 'Image uploaded to Cloudinary successfully' };
  }
  
  // Method 3: Fallback to base64 (works but has limitations)
  const base64Url = await convertToBase64DataUrl(file);
  return { 
    url: base64Url, 
    message: 'Using base64 encoding (temporary - external upload services unavailable)' 
  };
}