import React, { useState, useRef, useEffect } from "react";
import {
  FaTimes,
  FaCamera,
  FaImage,
  FaUpload,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTrash
} from "react-icons/fa";

const ImageAttendanceModal = ({ 
  classId, 
  classInfo, 
  isOpen, 
  onClose, 
  onSubmit,
  isLoading = false,
  user // Add user prop
}) => {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [capturedCount, setCapturedCount] = useState(0);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);

  // Handle file upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('Please select valid image files (JPEG, PNG, etc.)');
      return;
    }

    // Limit to 10 images
    if (images.length + imageFiles.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    setError(null);

    // Preview images
    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
      type: file.type
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
    setError(null);
  };

  // Clear all images
  const clearAllImages = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
    setError(null);
  };

  // Start camera
  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setUseCamera(true);
      setError(null);
    } catch (err) {
      console.error('Camera error:', err);
      setError('Camera access denied. Please allow camera permissions or upload images instead.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseCamera(false);
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob(blob => {
      if (!blob) return;

      const fileName = `camera_${Date.now()}_${capturedCount + 1}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      const newImage = {
        file,
        preview: URL.createObjectURL(blob),
        name: `Camera Capture ${capturedCount + 1}`,
        size: (blob.size / (1024 * 1024)).toFixed(2),
        type: 'image/jpeg'
      };
      
      setImages(prev => [...prev, newImage]);
      setCapturedCount(prev => prev + 1);
      
      // Show success feedback
      const captureBtn = document.querySelector('.capture-btn');
      if (captureBtn) {
        captureBtn.classList.add('scale-110');
        setTimeout(() => captureBtn.classList.remove('scale-110'), 300);
      }
    }, 'image/jpeg', 0.9);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    if (images.length < 2) {
      if (!window.confirm('Only one image selected. For better accuracy, consider uploading multiple images from different angles. Continue?')) {
        return;
      }
    }

    setIsUploading(true);
    setError(null);

    try {
      // Pass the image files directly to the API
      const imageFiles = images.map(img => img.file);
      
      const result = await onSubmit({
        classId,
        teacherId: user?._id,
        images: imageFiles
      });
      
      if (result.success) {
        // Close modal after successful submission
        setTimeout(() => {
          resetForm();
          onClose();
        }, 1500);
      } else {
        setError(result.error || 'Failed to process attendance');
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError(error.message || 'Failed to process attendance');
      setIsUploading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    // Stop camera if active
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    // Cleanup image previews
    images.forEach(img => URL.revokeObjectURL(img.preview));
    
    // Reset state
    setImages([]);
    setIsUploading(false);
    setError(null);
    setUseCamera(false);
    setCapturedCount(0);
  };

  // Handle modal close
  const handleClose = () => {
    if (isUploading || isLoading) {
      if (!window.confirm('Attendance is being processed. Are you sure you want to cancel?')) {
        return;
      }
    }
    
    resetForm();
    onClose();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      images.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [stream, images]);

  // Students with embeddings count
  const studentsWithEmbeddings = classInfo?.students?.filter(s => s.has_embeddings) || [];
  const hasEmbeddings = studentsWithEmbeddings.length > 0;
  
  // For testing, allow image attendance even without embeddings
  const allowImageAttendance = hasEmbeddings || true; // Set to true for testing

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border w-full max-w-3xl shadow-elevated">
          {/* Header */}
          <div className="p-6 border-b border-light-border dark:border-dark-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary flex items-center gap-3">
                  <FaCamera className="text-brand-teal" />
                  Image-based Attendance
                </h2>
                <p className="text-light-textSecondary dark:text-dark-textSecondary mt-1">
                  Take or upload photos of the classroom for automatic attendance
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={isUploading || isLoading}
                className="p-2 hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted rounded-lg transition-colors disabled:opacity-50"
              >
                <FaTimes className="w-5 h-5 text-light-textSecondary dark:text-dark-textSecondary" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Info Alert - Show but don't block */}
            {!hasEmbeddings && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <div className="flex gap-3">
                  <FaInfoCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-light-textPrimary dark:text-dark-textPrimary mb-1">
                      No Face ID Data Found
                    </h4>
                    <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                      The system couldn't find face embeddings data for students. 
                      {allowImageAttendance ? " You can still mark attendance, but face recognition won't work until embeddings are configured." : ""}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Camera View */}
            {useCamera && (
              <div className="mb-6">
                <div className="relative bg-black rounded-xl overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <button
                      onClick={capturePhoto}
                      disabled={isUploading || isLoading}
                      className="capture-btn p-4 bg-white rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg disabled:opacity-50"
                      title="Capture photo"
                    >
                      <FaCamera className="w-6 h-6 text-gray-800" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={stopCamera}
                    disabled={isUploading || isLoading}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <FaTimes className="w-4 h-4" />
                    Stop Camera
                  </button>
                </div>
              </div>
            )}

            {/* Upload Section - Only show if camera not active */}
            {!useCamera && (
              <div className="mb-6">
                <div className="border-2 border-dashed border-light-border dark:border-dark-border rounded-xl p-6 md:p-8 text-center cursor-pointer hover:border-brand-teal dark:hover:border-brand-teal transition-colors hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted"
                  onClick={() => !(isUploading || isLoading) && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading || isLoading}
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-brand-teal/10 flex items-center justify-center">
                      <FaUpload className="w-8 h-8 text-brand-teal" />
                    </div>
                    <div>
                      <p className="font-medium text-light-textPrimary dark:text-dark-textPrimary mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                        JPEG, PNG, WEBP up to 5MB each • Max 10 images
                      </p>
                    </div>
                    <button 
                      className="px-4 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-background dark:hover:bg-dark-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isUploading || isLoading || images.length >= 10}
                    >
                      {images.length >= 10 ? 'Maximum reached' : 'Select Images'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Camera Toggle */}
            <div className="mb-6">
              <button
                onClick={useCamera ? stopCamera : startCamera}
                disabled={isUploading || isLoading}
                className="w-full px-4 py-3 bg-light-surface dark:bg-dark-surface rounded-lg border border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-background dark:hover:bg-dark-background transition-colors flex items-center justify-between disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  <FaCamera className="w-4 h-4" />
                  {useCamera ? 'Stop Camera' : 'Use Camera Instead'}
                </span>
                <FaImage className="w-4 h-4" />
              </button>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    Selected Images ({images.length}/10)
                  </h4>
                  <button
                    onClick={clearAllImages}
                    disabled={isUploading || isLoading}
                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 disabled:opacity-50"
                  >
                    <FaTrash className="w-3 h-3" />
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border border-light-border dark:border-dark-border"
                    >
                      <img
                        src={img.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-28 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => removeImage(index)}
                          disabled={isUploading || isLoading}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                          title="Remove image"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-2">
                        <div className="truncate text-[10px]">{img.name}</div>
                        <div className="text-gray-300 text-[10px]">{img.size} MB</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex gap-2 items-start">
                  <FaExclamationTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-red-600 dark:text-red-400 font-medium">Error:</span>
                    <span className="text-red-700 dark:text-red-300 ml-2">{error}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex gap-3">
                <FaInfoCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-light-textPrimary dark:text-dark-textPrimary mb-2">
                    Tips for Best Results
                  </h4>
                  <ul className="text-sm text-light-textSecondary dark:text-dark-textSecondary space-y-1">
                    <li>• Use 3-5 images from different angles</li>
                    <li>• Ensure good lighting and clear visibility</li>
                    <li>• Capture students facing the camera</li>
                    <li>• Avoid blurry or distant shots</li>
                    {!hasEmbeddings && (
                      <li>• Face recognition requires student embeddings to be configured first</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-b-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="w-4 h-4" />
                    <span>
                      {hasEmbeddings 
                        ? `${studentsWithEmbeddings.length} students with face ID` 
                        : 'Face ID not configured'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaImage className="w-4 h-4" />
                    <span>{images.length} images selected</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={isUploading || isLoading}
                  className="px-4 py-2 border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-surface dark:hover:bg-dark-surface transition-colors disabled:opacity-50 min-w-[80px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={images.length === 0 || isUploading || isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-brand-navy to-brand-teal text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
                >
                  {(isUploading || isLoading) ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="w-4 h-4" />
                      Mark Attendance
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

export default ImageAttendanceModal;