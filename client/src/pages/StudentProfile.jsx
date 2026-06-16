// StudentProfile.jsx (Updated)
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useGetStudentByIdQuery,
  useUpdateStudentMutation,
} from "../redux/features/students/studentApi";
import LoadingSpinner from "../pages/common/LoadingSpinner";
import ErrorMessage from "../pages/common/ErrorMessage";
import ImageUploadModal from "../pages/components/ImageUploadModal";
import StudentEmbeddingsModal from "../pages/components/StudentEmbeddingsModal"; // New component
import {
  FaCamera,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaGraduationCap,
  FaCalendar,
  FaPrint,
  FaUser,
  FaIdBadge,
  FaBrain,
  FaUpload,
  FaImage,
} from "react-icons/fa";

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetStudentByIdQuery(id);
  const student = data?.data?.student || data?.data || data;

  const [updateStudent] = useUpdateStudentMutation();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEmbeddingsModalOpen, setIsEmbeddingsModalOpen] = useState(false); // New state

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await updateStudent({
          id,
          data: { status: "inactive" },
        }).unwrap();
        navigate("/app/students");
      } catch (err) {
        console.error("Failed to delete student:", err);
      }
    }
  };

  const handleImageUpdateSuccess = (newImageUrl) => {
    // The modal will handle closing and updating the UI
    console.log("Profile picture updated:", newImageUrl);
  };

  const handleEmbeddingsSuccess = (result) => {
    console.log("Student embeddings created successfully:", result);
    // You can add a toast notification here
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage error={error} />;
  if (!student) return <div>Student not found</div>;

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background p-4 md:p-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/app/students"
            className="inline-flex items-center gap-2 text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Students
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-6">
              {/* Avatar with Camera Button */}
              <div className="relative">
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                  {student.photo_url ? (
                    <img
                      src={student.photo_url}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-teal to-brand-navy flex items-center justify-center text-white font-bold text-3xl">
                      {student.name?.charAt(0) || "S"}
                    </div>
                  )}
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                  >
                    <FaCamera className="w-8 h-8 text-white" />
                  </button>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="absolute -bottom-2 -right-2 p-2 bg-brand-teal text-white rounded-full hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors shadow-lg"
                  title="Update profile picture"
                >
                  <FaCamera className="w-4 h-4" />
                </button>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                    {student.name}
                  </h1>
                  <span className="px-3 py-1.5 bg-light-accentSoft dark:bg-dark-accentSoft text-brand-teal dark:text-brand-teal rounded-lg text-sm font-medium">
                    Student
                  </span>
                  {/* Embeddings Status Badge */}
                  {student.has_embeddings && (
                    <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg text-sm font-medium flex items-center gap-2">
                      <FaBrain className="w-3 h-3" />
                      Face ID Enabled
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-light-textSecondary dark:text-dark-textSecondary">
                    <FaIdBadge className="w-4 h-4" />
                    <span className="font-medium">
                      {student.roll_no || "No Roll Number"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-light-textSecondary dark:text-dark-textSecondary">
                    <FaEnvelope className="w-4 h-4" />
                    <span className="font-medium">
                      {student.email || "No email"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-light-textSecondary dark:text-dark-textSecondary">
                    <FaBuilding className="w-4 h-4" />
                    <span className="font-medium">
                      {student.department || "No department"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-light-textSecondary dark:text-dark-textSecondary">
                    <FaGraduationCap className="w-4 h-4" />
                    <span className="font-medium">
                      Year {student.year || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsEmbeddingsModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-brand-navy to-brand-teal text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md"
              >
                <FaBrain className="w-4 h-4" />
                Add Student Embeddings
              </button>
              <Link
                to={`/app/students/edit/${student._id}`}
                className="px-4 py-2 bg-light-surfaceMuted dark:bg-dark-surfaceMuted border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-background dark:hover:bg-dark-background transition-colors flex items-center gap-2"
              >
                <FaEdit className="w-4 h-4" />
                Edit Profile
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
              >
                <FaTrash className="w-4 h-4" />
                Deactivate
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border p-6">
              <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-4 flex items-center gap-2">
                <FaUser className="text-brand-teal" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-2">
                    Full Name
                  </p>
                  <p className="text-lg font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    {student.name || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-2">
                    Email Address
                  </p>
                  <p className="text-lg font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    {student.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-2">
                    Phone Number
                  </p>
                  <p className="text-lg font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    {student.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-2">
                    Date of Birth
                  </p>
                  <p className="text-lg font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    {formatDate(student.date_of_birth)}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border p-6">
              <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-4 flex items-center gap-2">
                <FaGraduationCap className="text-brand-teal" />
                Academic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-2">
                    Roll Number
                  </p>
                  <p className="text-lg font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    {student.roll_no || "Not assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-2">
                    Department
                  </p>
                  <p className="text-lg font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    {student.department || "Not assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-2">
                    Year
                  </p>
                  <p className="text-lg font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    Year {student.year || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-2">
                    Semester
                  </p>
                  <p className="text-lg font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    {student.semester || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border p-6">
              <h3 className="font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-4 flex items-center gap-2">
                <FaCalendar className="text-brand-teal" />
                Status & Timeline
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-1">
                    Enrollment Status
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        student.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      {student.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                {/* Face Recognition Status */}
                <div>
                  <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-1">
                    Face Recognition
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                        student.has_embeddings
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      }`}
                    >
                      <FaBrain className="w-3 h-3" />
                      {student.has_embeddings ? "Configured" : "Not Configured"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-1">
                    Enrollment Date
                  </p>
                  <p className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    {formatDate(student.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-1">
                    Last Updated
                  </p>
                  <p className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    {formatDate(student.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-xl border border-light-border dark:border-dark-border p-6">
              <h3 className="font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setIsEmbeddingsModalOpen(true)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-brand-navy/10 to-brand-teal/10 dark:from-brand-navy/20 dark:to-brand-teal/20 border border-brand-navy/20 dark:border-brand-teal/20 rounded-lg text-light-textPrimary dark:text-dark-textPrimary hover:from-brand-navy/20 hover:to-brand-teal/20 dark:hover:from-brand-navy/30 dark:hover:to-brand-teal/30 transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FaBrain className="w-4 h-4 text-brand-navy dark:text-brand-teal" />
                    Configure Face ID
                  </span>
                  <FaUpload className="w-4 h-4 text-brand-teal" />
                </button>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="w-full px-4 py-3 bg-light-surface dark:bg-dark-surface rounded-lg border border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-background dark:hover:bg-dark-background transition-colors flex items-center justify-between"
                >
                  <span>Update Profile Picture</span>
                  <FaCamera className="w-4 h-4" />
                </button>
                <button className="w-full px-4 py-3 bg-light-surface dark:bg-dark-surface rounded-lg border border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-background dark:hover:bg-dark-background transition-colors flex items-center justify-between">
                  <span>Send Email</span>
                  <FaEnvelope className="w-4 h-4" />
                </button>
                <button className="w-full px-4 py-3 bg-light-surface dark:bg-dark-surface rounded-lg border border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-background dark:hover:bg-dark-background transition-colors flex items-center justify-between">
                  <span>Print Details</span>
                  <FaPrint className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        student={student}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleImageUpdateSuccess}
      />

      {/* Student Embeddings Modal */}
      <StudentEmbeddingsModal
        student={student}
        isOpen={isEmbeddingsModalOpen}
        onClose={() => setIsEmbeddingsModalOpen(false)}
        onSuccess={handleEmbeddingsSuccess}
      />
    </div>
  );
};

export default StudentProfile;