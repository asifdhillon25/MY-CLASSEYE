// AddStudentsToClass.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaUserGraduate,
  FaSearch,
  FaPlus,
  FaCheck,
  FaUsers,
  FaBook,
  FaSpinner,
} from "react-icons/fa";
import {
  useGetClassByIdQuery,
  useUpdateClassMutation,
} from "../redux/features/classes/classesApi";
import { useGetStudentsQuery } from "../redux/features/students/studentApi";

const AddStudentsToClass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backPath = location.state?.from || "/app/classes";

  // Fetch class details
  const { data: classData, isLoading: classLoading } = useGetClassByIdQuery(id);
  console.log("Class API response:", classData);
  const { data: studentsData, isLoading: studentsLoading } =
    useGetStudentsQuery();

  // Update class mutation
  const [updateClass] = useUpdateClassMutation();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Current class
  const currentClass = classData?.data?.class || classData?.data || classData;
  // All students
  const allStudents =
    studentsData?.data?.students || studentsData?.data || studentsData || [];

  // Initialize selected students with current class students
  useEffect(() => {
    if (currentClass?.students) {
      setSelectedStudents(currentClass.students.map((s) => s._id || s));
    }
  }, [currentClass]);

  // Filter students based on search
  const filteredStudents = allStudents.filter((student) => {
    if (!student) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(searchLower) ||
      student.roll_no?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.department?.toLowerCase().includes(searchLower)
    );
  });

  // Toggle student selection
  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  // Select all students
  const selectAllStudents = () => {
    const allStudentIds = filteredStudents
      .map((student) => student._id)
      .filter(Boolean);
    setSelectedStudents(allStudentIds);
  };

  // Deselect all students
  const deselectAllStudents = () => {
    setSelectedStudents([]);
  };

  // Handle save
  const handleSave = async () => {
    if (!currentClass) return;

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      await updateClass({
        id: currentClass._id,
        data: { students: selectedStudents },
      }).unwrap();

      setMessage({
        type: "success",
        text: `Successfully updated class with ${selectedStudents.length} students!`,
      });

      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate(backPath);
      }, 2000);
    } catch (error) {
      console.error("Error updating class:", error);
      setMessage({
        type: "error",
        text:
          error?.data?.message || "Failed to update class. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading states
  if (classLoading || studentsLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-light-background dark:bg-dark-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-96">
            <FaSpinner className="w-12 h-12 text-brand-teal animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-2">
              Loading...
            </h2>
            <p className="text-light-textSecondary dark:text-dark-textSecondary">
              Please wait while we fetch data
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentClass) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-light-background dark:bg-dark-background">
        <div className="max-w-7xl mx-auto">
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border p-8 text-center">
            <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-2">
              Class Not Found
            </h2>
            <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6">
              The requested class could not be found.
            </p>
            <button
              onClick={() => navigate(backPath)}
              className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors"
            >
              Back to Classes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-light-background dark:bg-dark-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(backPath)}
                className="p-2 rounded-lg border border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors"
              >
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary mb-1">
                  Add Students to Class
                </h1>
                <div className="flex items-center gap-3 text-light-textSecondary dark:text-dark-textSecondary">
                  <span className="flex items-center gap-1">
                    <FaBook className="w-4 h-4" />
                    {currentClass.course_name} ({currentClass.class_code})
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUsers className="w-4 h-4" />
                    Currently: {currentClass.students?.length || 0} students
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={deselectAllStudents}
                className="px-4 py-2 border border-light-border dark:border-dark-border rounded-lg text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors"
              >
                Deselect All
              </button>
              <button
                onClick={selectAllStudents}
                className="px-4 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors"
              >
                Select All
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <FaCheck className="w-4 h-4" />
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl border border-light-border dark:border-dark-border">
            <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
              Total Students in System
            </div>
            <div className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary mt-1">
              {allStudents.length}
            </div>
          </div>

          <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl border border-light-border dark:border-dark-border">
            <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
              Selected for Class
            </div>
            <div className="text-2xl font-bold text-brand-teal mt-1">
              {selectedStudents.length}
            </div>
          </div>

          <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl border border-light-border dark:border-dark-border">
            <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
              Current Class Students
            </div>
            <div className="text-2xl font-bold text-blue-500 mt-1">
              {currentClass.students?.length || 0}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 mb-6 shadow border border-light-border dark:border-dark-border">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-textMuted dark:text-dark-textMuted" />
            <input
              type="text"
              placeholder="Search students by name, roll number, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-light-textMuted dark:text-dark-textMuted hover:text-light-textPrimary dark:hover:text-dark-textPrimary rounded-full hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredStudents.map((student) => {
            const isSelected = selectedStudents.includes(student._id);

            return (
              <div
                key={student._id}
                onClick={() => toggleStudentSelection(student._id)}
                className={`bg-light-surface dark:bg-dark-surface rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? "border-brand-teal bg-light-accentSoft dark:bg-dark-accentSoft"
                    : "border-light-border dark:border-dark-border hover:border-brand-teal/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? "bg-brand-teal text-white"
                          : "bg-light-surfaceMuted dark:bg-dark-surfaceMuted text-light-textMuted dark:text-dark-textMuted"
                      }`}
                    >
                      <FaUserGraduate className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
                        {student.name}
                      </h3>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                        {student.roll_no}
                      </p>
                      <p className="text-xs text-light-textMuted dark:text-dark-textMuted mt-1">
                        {student.department} • {student.email}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-brand-teal bg-brand-teal"
                        : "border-light-border dark:border-dark-border"
                    }`}
                  >
                    {isSelected && <FaCheck className="w-3 h-3 text-white" />}
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-light-border dark:border-dark-border">
                    <span className="text-xs text-brand-teal font-medium">
                      Selected for this class
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {filteredStudents.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 text-light-textMuted dark:text-dark-textMuted">
                <FaSearch className="w-full h-full opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-light-textPrimary dark:text-dark-textPrimary mb-2">
                No students found
              </h3>
              <p className="text-light-textSecondary dark:text-dark-textSecondary">
                {searchTerm
                  ? "Try a different search term"
                  : "No students available in the system"}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-6 bg-light-surface dark:bg-dark-surface rounded-xl p-6 border border-light-border dark:border-dark-border shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                {selectedStudents.length} student(s) selected
              </div>
              <div className="text-lg font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                Ready to add to {currentClass.course_name}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(backPath)}
                className="px-6 py-3 border border-light-border dark:border-dark-border rounded-lg text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting || selectedStudents.length === 0}
                className="px-6 py-3 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaPlus className="w-4 h-4" />
                    Add {selectedStudents.length} Student(s) to Class
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentsToClass;
