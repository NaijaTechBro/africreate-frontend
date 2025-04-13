import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../../contexts/ContentContext';
import { useAuth } from '../../contexts/AuthContext';

const CreateContentPage: React.FC = () => {
  const { createContent, categories, fetchCategories, error, clearError } = useContent();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [contentType, setContentType] = useState('text');
  const [isExclusive, setIsExclusive] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories if not already loaded
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  // Redirect if not a creator
  useEffect(() => {
    if (user && !user.isCreator) {
      navigate('/');
    }
  }, [user, navigate]);

  // Handle media file selection
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      
      // Create preview for image or video
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setMediaPreview(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Handle thumbnail file selection
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setThumbnailPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  // Trigger thumbnail input click
  const triggerThumbnailUpload = () => {
    thumbnailInputRef.current?.click();
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!category) {
      errors.category = 'Category is required';
    }
    
    if (contentType !== 'text' && !mediaFile) {
      errors.media = 'Media file is required';
    }
    
    if ((contentType === 'video' || contentType === 'image') && !thumbnailFile) {
      errors.thumbnail = 'Thumbnail is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }
    
    // Simulate upload progress for demo (in real app, this would be handled by upload API)
    setIsUploading(true);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      // In a real implementation, we would upload files to storage first
      // and then use the returned URLs
      
      const contentData = {
        title,
        description,
        category,
        contentType,
        isExclusive,
        // Normally these would be real URLs from the upload process
        mediaUrl: mediaFile ? URL.createObjectURL(mediaFile) : '', 
        thumbnailUrl: thumbnailFile ? URL.createObjectURL(thumbnailFile) : ''
      };
      
      const newContent = await createContent(contentData);
      
      // Simulate completion of upload
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        navigate(`/content/${newContent._id}`);
      }, 500);
    } catch (err) {
      console.error('Error creating content:', err);
      setIsUploading(false);
      clearInterval(interval);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="max-w-3xl mx-auto">
        <h1 className="mb-6 text-2xl font-bold">Create New Content</h1>
        
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Content Type Selection */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Content Type</label>
            <div className="grid grid-cols-4 gap-4">
              {['text', 'image', 'video', 'audio'].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`py-3 px-4 border rounded-lg capitalize flex flex-col items-center justify-center ${
                    contentType === type
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setContentType(type)}
                >
                  <div className="mb-2">
                    {type === 'text' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {type === 'image' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    {type === 'video' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                    {type === 'audio' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0 0l-2.828 2.828a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 010-1.414l2.828-2.828M8.414 8.464l-2.828-2.828a1 1 0 010-1.414l1.414-1.414a1 1 0 011.414 0l2.828 2.828m7.072 7.072l2.828 2.828a1 1 0 010 1.414l-1.414 1.414a1 1 0 01-1.414 0l-2.828-2.828" />
                      </svg>
                    )}
                  </div>
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter a catchy title for your content"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.title}</p>
            )}
          </div>
          
          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2 text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={4}
              placeholder="Describe your content"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {validationErrors.description && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.description}</p>
            )}
          </div>
          
          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block mb-2 text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              className={`w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.category ? 'border-red-500' : 'border-gray-300'
              }`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            {validationErrors.category && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.category}</p>
            )}
          </div>
          
          {/* Media Upload (for non-text content) */}
          {contentType !== 'text' && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Upload {contentType} <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={
                  contentType === 'image'
                    ? 'image/*'
                    : contentType === 'video'
                    ? 'video/*'
                    : 'audio/*'
                }
                onChange={handleMediaChange}
              />
              <div
                onClick={triggerFileUpload}
                className={`cursor-pointer border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center ${
                  validationErrors.media ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {mediaPreview ? (
                  contentType === 'image' ? (
                    <img src={mediaPreview} alt="Preview" className="max-h-64 mb-4" />
                  ) : contentType === 'video' ? (
                    <video src={mediaPreview} controls className="max-h-64 mb-4" />
                  ) : (
                    <div className="flex items-center justify-center w-full p-4 mb-4 bg-gray-100 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                  )
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm font-medium">Click to upload {contentType}</p>
                    <p className="text-xs text-gray-500">
                      {contentType === 'image' && 'SVG, PNG, JPG or GIF (max. 10MB)'}
                      {contentType === 'video' && 'MP4, WebM or AVI (max. 100MB)'}
                      {contentType === 'audio' && 'MP3, WAV or OGG (max. 50MB)'}
                    </p>
                  </>
                )}
              </div>
              {validationErrors.media && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.media}</p>
              )}
            </div>
          )}
          
          {/* Thumbnail Upload (for video/image content) */}
          {(contentType === 'video' || contentType === 'image') && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Upload Thumbnail <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                ref={thumbnailInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              <div
                onClick={triggerThumbnailUpload}
                className={`cursor-pointer border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-40 ${
                  validationErrors.thumbnail ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Thumbnail" className="max-h-32" />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium">Upload thumbnail image</p>
                  </>
                )}
              </div>
              {validationErrors.thumbnail && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.thumbnail}</p>
              )}
            </div>
          )}
          
          {/* Access Control */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium">Content Access</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="exclusive"
                checked={isExclusive}
                onChange={(e) => setIsExclusive(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="exclusive" className="ml-2 text-sm">
                Make this content exclusive to subscribers only
              </label>
            </div>
          </div>
          
          {/* Upload Progress (when uploading) */}
          {isUploading && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Publish Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContentPage;