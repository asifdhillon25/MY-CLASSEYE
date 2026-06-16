import React, { useState, useRef } from "react";
import { useUploadImageMutation } from "../../redux/features/imgBB/imgbbApi";
import { useUpdateStudentPhotoMutation } from "../../redux/features/students/studentApi";
import {
  FaCamera,
  FaUpload,
  FaLink,
  FaTimes,
  FaSpinner,
  FaCheck,
  FaImage,
} from "react-icons/fa";

const ImageUploadModal = ({ student, isOpen, onClose, onSuccess }) => {
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [updateStudentPhoto, { isLoading: isUpdating }] =
    useUpdateStudentPhotoMutation();

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(student.photo_url || "");
  const [uploadMethod, setUploadMethod] = useState("file"); // 'file' or 'url'
  const [message, setMessage] = useState({ type: "", text: "" });

  const fileInputRef = useRef(null);

  // Convert File to base64 string (without data URL prefix)
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove "data:image/xxx;base64," prefix
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        setMessage({
          type: "error",
          text: "Please upload a valid image file (JPEG, PNG, GIF, WebP)",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Image size should be less than 5MB",
        });
        return;
      }

      setSelectedFile(file);
      setMessage({ type: "", text: "" });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle URL input
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);

    // Basic URL validation
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      setImagePreview(url);
      setMessage({ type: "", text: "" });
    } else if (url) {
      setMessage({
        type: "error",
        text: "Please enter a valid URL starting with http:// or https://",
      });
    }
  };

  // Upload image via backend proxy
  const uploadImageToBackend = async () => {
    try {
      let imageData;

      if (uploadMethod === "file" && selectedFile) {
        // Convert File to base64 string (without data URL prefix)
        imageData = await fileToBase64(selectedFile);
      } else if (uploadMethod === "url" && imageUrl) {
        // Use URL directly
        imageData = imageUrl;
      } else {
        setMessage({
          type: "error",
          text: "Please select an image file or enter a URL",
        });
        return null;
      }

      // Send base64 string or URL to backend
      const result = await uploadImage(imageData).unwrap();
      console.log("Upload result:", result.url);

      // Check response structure
      if (result.url) {
        return result.url; // ImgBB response format
      } else {
        throw new Error("Upload failed: No URL returned");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({
        type: "error",
        text:
          error?.data?.message ||
          error?.message ||
          "Failed to upload image. Please try again.",
      });
      return null;
    }
  };

  // Save image URL to database using photo-specific endpoint
  const savePhotoToDatabase = async (photoUrl) => {
    try {
      console.log("Saving photo URL to database:", photoUrl);
      console.log("Student ID:", student._id);
      const result = await updateStudentPhoto({
        id: student._id,
        photo_url: photoUrl,
      }).unwrap();

      setMessage({
        type: "success",
        text: "Profile picture updated successfully!",
      });

      // Call success callback
      if (onSuccess) {
        onSuccess(photoUrl);
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);

      return result;
    } catch (error) {
      console.error("Database update error:", error);
      setMessage({
        type: "error",
        text:
          error?.data?.message ||
          "Failed to save profile picture. Please try again.",
      });
      throw error;
    }
  };

  // Handle remove profile picture
  const handleRemovePhoto = async () => {
    if (
      window.confirm("Are you sure you want to remove the profile picture?")
    ) {
      try {
        await updateStudentPhoto({
          id: student._id,
          photo_url: "",
        }).unwrap();

        setImagePreview("");
        setMessage({
          type: "success",
          text: "Profile picture removed successfully!",
        });

        if (onSuccess) {
          onSuccess("");
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: "Failed to remove profile picture. Please try again.",
        });
      }
    }
  };

  // Handle save
  const handleSave = async () => {
    setMessage({ type: "", text: "" });

    try {
      // Upload to backend (which proxies to ImgBB)
      const uploadedUrl = await uploadImageToBackend();
      if (!uploadedUrl) return;

      // Save to database
      await savePhotoToDatabase(uploadedUrl);
    } catch (error) {
      // Error already handled in individual functions
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedFile(null);
    setImageUrl("");
    setImagePreview(student.photo_url || "");
    setMessage({ type: "", text: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-light-surface dark:bg-dark-surface rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-brand-teal to-brand-navy text-white">
              <FaCamera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                Update Profile Picture
              </h3>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                for {student.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="p-2 rounded-lg text-light-textMuted dark:text-dark-textMuted hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Area */}
        <div className="p-6 border-b border-light-border dark:border-dark-border">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full rounded-full object-cover border-4 border-light-border dark:border-dark-border shadow-lg"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-brand-teal/20 to-brand-navy/20 dark:from-brand-teal/10 dark:to-brand-navy/10 flex items-center justify-center border-4 border-light-border dark:border-dark-border">
                  <FaImage className="w-12 h-12 text-light-textMuted dark:text-dark-textMuted" />
                </div>
              )}

              {imagePreview && imagePreview !== student.photo_url && (
                <button
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              )}
            </div>

            <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary text-center">
              {student.photo_url
                ? "Current profile picture"
                : "No profile picture set"}
            </p>
          </div>
        </div>

        {/* Upload Methods */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setUploadMethod("file")}
                className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  uploadMethod === "file"
                    ? "border-brand-teal bg-brand-teal/10 text-brand-teal"
                    : "border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted"
                }`}
              >
                <FaUpload />
                Upload File
              </button>
              <button
                onClick={() => setUploadMethod("url")}
                className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  uploadMethod === "url"
                    ? "border-brand-teal bg-brand-teal/10 text-brand-teal"
                    : "border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted"
                }`}
              >
                <FaLink />
                Image URL
              </button>
            </div>

            {uploadMethod === "file" ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="w-full py-3 px-4 border-2 border-dashed border-light-border dark:border-dark-border rounded-lg hover:border-brand-teal hover:bg-light-accentSoft dark:hover:bg-dark-accentSoft transition-colors"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FaUpload className="w-6 h-6 text-light-textMuted dark:text-dark-textMuted" />
                    <span className="text-light-textPrimary dark:text-dark-textPrimary">
                      {selectedFile
                        ? selectedFile.name
                        : "Choose an image file"}
                    </span>
                    <span className="text-xs text-light-textMuted dark:text-dark-textMuted">
                      JPEG, PNG, GIF, WebP (Max 5MB)
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20"
                />
                <p className="mt-2 text-xs text-light-textMuted dark:text-dark-textMuted">
                  Enter a direct image URL
                </p>
              </div>
            )}
          </div>

          {/* Message Display */}
          {message.text && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {message.type === "success" ? (
                  <FaCheck className="w-4 h-4" />
                ) : (
                  <FaTimes className="w-4 h-4" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="flex-1 py-3 px-4 border border-light-border dark:border-dark-border rounded-lg text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors"
              disabled={isUploading || isUpdating}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={
                isUploading ||
                isUpdating ||
                (!selectedFile && !imageUrl && uploadMethod === "file")
              }
              className="flex-1 py-3 px-4 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading || isUpdating ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  {isUploading ? "Uploading..." : "Saving..."}
                </>
              ) : (
                <>
                  <FaCamera />
                  Update Picture
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-4 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-b-2xl">
          <p className="text-xs text-light-textMuted dark:text-dark-textMuted text-center">
            Images are uploaded via backend proxy to ImgBB
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
