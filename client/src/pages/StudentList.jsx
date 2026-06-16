import React, { useState, useEffect } from "react";
import { useGetStudentsQuery } from "../redux/features/students/studentApi";
import StudentCard from "../pages/components/StudentCard";
import LoadingSpinner from "../pages/common/LoadingSpinner";
import ErrorMessage from "../pages/common/ErrorMessage";

const StudentList = () => {
  const { data, isLoading, isError, error } = useGetStudentsQuery();

  const students = data?.data?.students ?? [];
  console.log("Fetched students:", students);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Filter students based on search term
  useEffect(() => {
    if (students && students.length > 0) {
      const filtered = students.filter(
        (student) =>
          student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.department
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.designation
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.phone?.includes(searchTerm) ||
          student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage error={error} />;

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background p-4 md:p-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary mb-2">
                Student Directory
              </h1>
              <p className="text-light-textSecondary dark:text-dark-textSecondary">
                Browse and manage all students in the system
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 bg-brand-teal/10 text-brand-teal rounded-lg text-sm font-medium">
                {students.length} Students
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-light-textMuted dark:text-dark-textMuted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search students by name, department, ID, or phone..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg
                  className="w-5 h-5 text-light-textMuted dark:text-dark-textMuted hover:text-light-textPrimary dark:hover:text-dark-textPrimary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Student Grid */}
        {filteredStudents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 text-light-textMuted dark:text-dark-textMuted">
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-light-textPrimary dark:text-dark-textPrimary mb-2">
              No students found
            </h3>
            <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6">
              {searchTerm
                ? "Try different search terms"
                : "Add your first student to get started"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard key={student._id} student={student} />
            ))}
          </div>
        )}

        {/* Stats Bar */}
        <div className="mt-8 pt-8 border-t border-light-border dark:border-dark-border">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
              Showing {filteredStudents.length} of {students.length} students
            </div>
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center gap-1 text-brand-teal hover:text-brand-teal/80 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 11l7-7 7 7M5 19l7-7 7 7"
                  />
                </svg>
                Back to top
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
