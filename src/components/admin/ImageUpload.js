'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

export default function ImageUpload({ 
  onImageUpload, 
  currentImage = null, 
  folder = 'portfolio',
  className = '' 
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadStatus({ type: 'error', message: 'Please select an image file' });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus({ type: 'error', message: 'File size must be less than 10MB' });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        setUploadStatus({ type: 'success', message: 'Image uploaded successfully!' });
        onImageUpload(result.data);
      } else {
        setUploadStatus({ type: 'error', message: result.error || 'Upload failed' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ type: 'error', message: 'Upload failed. Please try again.' });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    onImageUpload(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Preview */}
      {currentImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={currentImage.secure_url}
              alt="Current image"
              className="w-full h-full object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Current image: {currentImage.public_id}
          </p>
        </motion.div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 cursor-pointer ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${isUploading ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Uploading... {uploadProgress}%
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {currentImage ? 'Replace image' : 'Upload image'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Drag and drop or click to select
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Status */}
      {uploadStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center space-x-2 p-3 rounded-lg ${
            uploadStatus.type === 'success'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
          }`}
        >
          {uploadStatus.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span className="text-sm">{uploadStatus.message}</span>
        </motion.div>
      )}

      {/* File Requirements */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>Supported formats: JPG, PNG, WebP, GIF</p>
        <p>Max file size: 10MB</p>
      </div>
    </div>
  );
}
