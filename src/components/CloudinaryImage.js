'use client';

import { useState } from 'react';
import { getOptimizedImageUrl, getResponsiveImageSet } from '@/lib/cloudinary';

export default function CloudinaryImage({ 
  publicId, 
  alt, 
  width, 
  height, 
  className = '',
  priority = false,
  placeholder = 'blur',
  responsive = false,
  ...props 
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!publicId) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={responsive ? {} : { width, height }}
      >
        <span className="text-gray-400 dark:text-gray-500">No image</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={responsive ? {} : { width, height }}
      >
        <span className="text-gray-400 dark:text-gray-500">Failed to load</span>
      </div>
    );
  }

  // Generate optimized image URL
  const imageUrl = getOptimizedImageUrl(publicId, {
    width: width,
    height: height,
    quality: 'auto',
    fetch_format: 'auto',
    crop: 'fill',
    gravity: 'auto'
  });

  // Generate responsive image set (simplified for client-side)
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const sizes = [320, 640, 768, 1024, 1280, 1920];
  
  const srcSet = sizes
    .map(size => {
      const url = `https://res.cloudinary.com/${cloudName}/image/upload/w_${size},h_${height},c_fill,g_auto,q_auto,f_auto/${publicId}`;
      return `${url} ${size}w`;
    })
    .join(', ');

  if (responsive) {
    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        <img
          src={imageUrl}
          srcSet={srcSet}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...props}
        />
      </>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={imageUrl}
        srcSet={srcSet}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...props}
      />
    </div>
  );
}

// Lazy loading wrapper for better performance
export function LazyCloudinaryImage(props) {
  return (
    <div className="lazy-load">
      <CloudinaryImage {...props} />
    </div>
  );
}

// Hero image component with priority loading
export function HeroCloudinaryImage(props) {
  return (
    <CloudinaryImage 
      {...props} 
      priority={true}
      placeholder="blur"
    />
  );
}
