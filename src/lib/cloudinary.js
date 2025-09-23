// Server-side Cloudinary configuration (only for API routes)
let cloudinary = null;

if (typeof window === 'undefined') {
  // Only import cloudinary on server-side
  const { v2 } = require('cloudinary');
  cloudinary = v2;
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export default cloudinary;

// Helper function to generate optimized image URLs (works on both client and server)
export function getOptimizedImageUrl(publicId, options = {}) {
  const defaultOptions = {
    quality: 'auto',
    fetch_format: 'auto',
    width: 'auto',
    crop: 'scale',
    ...options
  };

  // Use Cloudinary URL generation (works without the full SDK)
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName || !publicId) {
    return '/placeholder-image.jpg'; // Fallback image
  }

  const transformations = Object.entries(defaultOptions)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
}

// Helper function to generate responsive image URLs
export function getResponsiveImageUrl(publicId, width, options = {}) {
  return getOptimizedImageUrl(publicId, {
    width: width,
    quality: 'auto',
    fetch_format: 'auto',
    crop: 'scale',
    ...options
  });
}

// Helper function to generate multiple sizes for responsive images
export function getResponsiveImageSet(publicId, options = {}) {
  const sizes = [320, 640, 768, 1024, 1280, 1920];
  
  return sizes.map(size => ({
    width: size,
    url: getResponsiveImageUrl(publicId, size, options)
  }));
}
