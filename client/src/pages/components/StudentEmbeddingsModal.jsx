// StudentEmbeddingsModal.jsx (Updated)
import React, { useState } from "react";
import { FaTimes, FaUpload, FaImage, FaSpinner, FaInfoCircle, FaCheck } from "react-icons/fa";
import { useGenerateEmbeddingsMutation } from "../../redux/features/imgBB/imgbbApi";

const StudentEmbeddingsModal = ({ student, isOpen, onClose, onSuccess }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // RTK Mutation hook
  const [generateEmbeddings] = useGenerateEmbeddingsMutation();

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('Please select valid image files (JPEG, PNG, etc.)');
      return;
    }

    // Limit to 10 images
    if (uploadedImages.length + imageFiles.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    setError(null);

    // Preview images and convert to base64
    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      base64: null // Will be populated later
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...uploadedImages];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setUploadedImages(newImages);
    setError(null);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (uploadedImages.length < 3) {
      setError('Please upload at least 3 images for accurate face recognition.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);
    setUploadProgress(10);

    try {
      // Convert all images to base64
      setUploadProgress(20);
      const base64Promises = uploadedImages.map(async (img) => {
        return await convertToBase64(img.file);
      });

      const base64Images = await Promise.all(base64Promises);
      setUploadProgress(40);

      // Call the generate embeddings mutation
      const result = await generateEmbeddings({
        studentId: student._id,
        images: base64Images
      }).unwrap();

      setUploadProgress(100);
      setSuccessMessage(result.message || 'Face embeddings created successfully!');

      // Call success handler
      onSuccess(result);

      // Reset and close after delay
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);

    } catch (error) {
      console.error('Error creating embeddings:', error);
      setError(error.data?.message || error.message || 'Failed to create embeddings. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setUploadedImages([]);
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
    setSuccessMessage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border w-full max-w-2xl shadow-elevated">
          {/* Header */}
          <div className="p-6 border-b border-light-border dark:border-dark-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary flex items-center gap-3">
                  <FaImage className="text-brand-teal" />
                  Configure Face Recognition
                </h2>
                <p className="text-light-textSecondary dark:text-dark-textSecondary mt-1">
                  Upload multiple images of {student.name} to create face embeddings
                </p>
              </div>
              <button
                onClick={onClose}
                disabled={isUploading}
                className="p-2 hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted rounded-lg transition-colors disabled:opacity-50"
              >
                <FaTimes className="w-5 h-5 text-light-textSecondary dark:text-dark-textSecondary" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex gap-2 items-start">
                  <span className="text-red-600 dark:text-red-400 font-medium">Error:</span>
                  <span className="text-red-700 dark:text-red-300">{error}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex gap-2 items-center">
                  <FaCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-300 font-medium">{successMessage}</span>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex gap-3">
                <FaInfoCircle className="w-5 h-5 text-brand-navy dark:text-brand-aqua flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-light-textPrimary dark:text-dark-textPrimary mb-1">
                    Requirements for best results
                  </h4>
                  <ul className="text-sm text-light-textSecondary dark:text-dark-textSecondary space-y-1">
                    <li>• Upload 3-10 clear, well-lit face photos</li>
                    <li>• Include different angles (front, left, right)</li>
                    <li>• Avoid sunglasses, hats, or face coverings</li>
                    <li>• Use recent photos for accurate recognition</li>
                    <li>• File size: Up to 5MB per image</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                  Upload Images
                </h3>
                <span className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  {uploadedImages.length} / 10 images selected
                </span>
              </div>

              {/* Upload Box */}
              <label className="block">
                <div className="border-2 border-dashed border-light-border dark:border-dark-border rounded-xl p-8 text-center cursor-pointer hover:border-brand-teal dark:hover:border-brand-teal transition-colors hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading || uploadedImages.length >= 10}
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-brand-teal/10 flex items-center justify-center">
                      <FaUpload className="w-8 h-8 text-brand-teal" />
                    </div>
                    <div>
                      <p className="font-medium text-light-textPrimary dark:text-dark-textPrimary mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                        JPEG, PNG, WEBP up to 5MB each
                      </p>
                    </div>
                    <button 
                      className="px-4 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-background dark:hover:bg-dark-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isUploading || uploadedImages.length >= 10}
                    >
                      {uploadedImages.length >= 10 ? 'Maximum reached' : 'Select Images'}
                    </button>
                  </div>
                </div>
              </label>
            </div>

            {/* Image Previews */}
            {uploadedImages.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-light-textPrimary dark:text-dark-textPrimary mb-4">
                  Selected Images ({uploadedImages.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedImages.map((img, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border border-light-border dark:border-dark-border"
                    >
                      <img
                        src={img.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => removeImage(index)}
                          disabled={isUploading}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
                        <div className="truncate">{img.name}</div>
                        <div className="text-gray-300">{img.size}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {isUploading && (
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    {uploadProgress < 100 ? 'Creating embeddings...' : 'Complete!'}
                  </span>
                  <span className="text-sm font-medium text-brand-teal">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-brand-navy to-brand-teal h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-b-2xl">
            <div className="flex justify-between items-center">
              <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                <div className="flex items-center gap-2">
                  <FaImage className="w-4 h-4" />
                  <span>
                    {uploadedImages.length < 3 
                      ? `Need ${3 - uploadedImages.length} more images` 
                      : 'Ready to process'}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (!isUploading) {
                      resetForm();
                      onClose();
                    }
                  }}
                  disabled={isUploading}
                  className="px-4 py-2 border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-surface dark:hover:bg-dark-surface transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={uploadedImages.length < 3 || isUploading}
                  className="px-6 py-2 bg-gradient-to-r from-brand-navy to-brand-teal text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-4 h-4" />
                      Generate Embeddings
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEmbeddingsModal;