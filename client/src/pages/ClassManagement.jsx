import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBuilding,
  FaClock,
  FaUsers,
  FaSpinner,
  FaExclamationCircle,
  FaSync,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendar,
  FaBook
} from "react-icons/fa";
import {
  useGetClassesQuery,
  useDeleteClassMutation
} from "../redux/features/classes/classesApi";

const ClassManagement = () => {
  // Fetch classes from API
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch
  } = useGetClassesQuery();
  console.log("Classes API response:", response);

  // Delete class mutation
  const [deleteClass] = useDeleteClassMutation();

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSemester, setFilterSemester] = useState("all");
  const [filterTeacher, setFilterTeacher] = useState("all");

  // Extract classes from response
  const classes = response?.data?.classes || response?.data || response || [];
  console.log("Fetched classes:", classes);

  // Extract unique semesters and teachers for filters
  const semesters = [...new Set(classes.map(cls => cls.semester).filter(Boolean))];
  const teachers = [...new Set(classes.map(cls => cls.teacher?.name).filter(Boolean))];

  // Filter classes based on search and filters
  const filteredClasses = classes.filter(cls => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      cls.class_code?.toLowerCase().includes(searchLower) ||
      cls.course_name?.toLowerCase().includes(searchLower) ||
      cls.subject_code?.toLowerCase().includes(searchLower) ||
      cls.teacher?.name?.toLowerCase().includes(searchLower) ||
      cls.room?.toLowerCase().includes(searchLower);

    const matchesSemester = filterSemester === "all" || cls.semester === filterSemester;
    const matchesTeacher = filterTeacher === "all" || cls.teacher?.name === filterTeacher;

    return matchesSearch && matchesSemester && matchesTeacher;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Format schedule display
  const formatSchedule = (schedule) => {
    if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
      return "No schedule";
    }
    return schedule.map(slot => `${slot.day} ${slot.start_time}-${slot.end_time}`).join(", ");
  };

  // Handle delete class
  const handleDelete = async (id, classCode) => {
    if (window.confirm(`Are you sure you want to delete class ${classCode}?`)) {
      try {
        await deleteClass(id).unwrap();
        // You could add a toast notification here
      } catch (error) {
        console.error("Failed to delete class:", error);
        alert("Failed to delete class. Please try again.");
      }
    }
  };

  // Handle refresh data
  const handleRefresh = () => {
    refetch();
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-light-background dark:bg-dark-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-96">
            <FaSpinner className="w-12 h-12 text-brand-teal animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-2">
              Loading Classes...
            </h2>
            <p className="text-light-textSecondary dark:text-dark-textSecondary">
              Please wait while we fetch class data
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-light-background dark:bg-dark-background">
        <div className="max-w-7xl mx-auto">
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border p-8 text-center">
            <FaExclamationCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-2">
              Error Loading Classes
            </h2>
            <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6">
              {error?.data?.message || "Failed to fetch class data"}
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors flex items-center gap-2 mx-auto"
            >
              <FaSync />
              Try Again
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
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary mb-2">
                Class Management
              </h1>
              <p className="text-light-textSecondary dark:text-dark-textSecondary">
                Manage all classes, view schedules, and add students to classes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/app/addclass"
                className="flex items-center gap-2 px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors"
              >
                <FaPlus />
                Add New Class
              </Link>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors"
              >
                <FaSync className={isLoading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl border border-light-border dark:border-dark-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Total Classes</p>
                <p className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary mt-1">
                  {classes.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-brand-teal/10">
                <FaBook className="w-6 h-6 text-brand-teal" />
              </div>
            </div>
          </div>

          <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl border border-light-border dark:border-dark-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Total Students</p>
                <p className="text-2xl font-bold text-blue-500 mt-1">
                  {classes.reduce((total, cls) => total + (cls.students?.length || 0), 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <FaUserGraduate className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl border border-light-border dark:border-dark-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Active Teachers</p>
                <p className="text-2xl font-bold text-green-500 mt-1">
                  {new Set(classes.map(cls => cls.teacher?._id).filter(Boolean)).size}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <FaChalkboardTeacher className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl border border-light-border dark:border-dark-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Rooms Used</p>
                <p className="text-2xl font-bold text-purple-500 mt-1">
                  {new Set(classes.map(cls => cls.room).filter(Boolean)).size}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <FaBuilding className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 mb-6 shadow border border-light-border dark:border-dark-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-textMuted dark:text-dark-textMuted" />
                <input
                  type="text"
                  placeholder="Search classes by code, name, teacher, or room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-light-textMuted dark:text-dark-textMuted hover:text-light-textPrimary dark:hover:text-dark-textPrimary rounded-full hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <FaFilter className="text-light-textSecondary dark:text-dark-textSecondary" />
                <select
                  value={filterSemester}
                  onChange={(e) => setFilterSemester(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal min-w-[140px]"
                >
                  <option value="all">All Semesters</option>
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              <select
                value={filterTeacher}
                onChange={(e) => setFilterTeacher(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal min-w-[140px]"
              >
                <option value="all">All Teachers</option>
                {teachers.map(teacher => (
                  <option key={teacher} value={teacher}>{teacher}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Classes Table */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg border border-light-border dark:border-dark-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
              <thead className="bg-light-surfaceMuted dark:bg-dark-surfaceMuted">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
                    Class Information
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
                    Schedule & Details
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 md:px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 mb-4 text-light-textMuted dark:text-dark-textMuted">
                          <FaSearch className="w-full h-full opacity-50" />
                        </div>
                        <h3 className="text-lg font-medium text-light-textPrimary dark:text-dark-textPrimary mb-2">
                          No classes found
                        </h3>
                        <p className="text-light-textSecondary dark:text-dark-textSecondary max-w-md">
                          {searchTerm || filterSemester !== "all" || filterTeacher !== "all"
                            ? "Try adjusting your search or filters to find classes"
                            : "No classes found in the system. Add your first class to get started."}
                        </p>
                        <Link
                          to="/app/addclass"
                          className="mt-4 px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors"
                        >
                          Add First Class
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((cls) => (
                    <tr key={cls._id} className="hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors">
                      {/* Class Information */}
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-brand-teal/20 to-brand-navy/20 dark:from-brand-teal/10 dark:to-brand-navy/10 flex items-center justify-center">
                            <FaBook className="w-6 h-6 text-brand-teal" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                              {cls.course_name}
                            </div>
                            <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                              Code: {cls.class_code} | Subject: {cls.subject_code}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                <FaChalkboardTeacher className="w-3 h-3 mr-1" />
                                {cls.teacher?.name || "No Teacher"}
                              </span>
                              {cls.semester && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                  <FaCalendarAlt className="w-3 h-3 mr-1" />
                                  {cls.semester}
                                </span>
                              )}
                              {cls.room && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                  <FaBuilding className="w-3 h-3 mr-1" />
                                  {cls.room}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Schedule & Details */}
                      <td className="px-4 md:px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <FaClock className="w-4 h-4 text-light-textMuted dark:text-dark-textMuted mt-0.5" />
                            <div>
                              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Schedule</p>
                              <p className="text-sm text-light-textPrimary dark:text-dark-textPrimary">
                                {formatSchedule(cls.schedule)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FaCalendar className="w-4 h-4 text-light-textMuted dark:text-dark-textMuted" />
                            <span className="text-light-textSecondary dark:text-dark-textSecondary">
                              Created: {formatDate(cls.created_at)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Students */}
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <FaUsers className="w-4 h-4 text-light-textMuted dark:text-dark-textMuted" />
                              <span className="text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                                {cls.students?.length || 0} students
                              </span>
                            </div>
                            <div className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                              {cls.students?.length ? `${cls.students.length} enrolled` : "No students"}
                            </div>
                          </div>
                          <Link
                            to={`/app/addstudentstoclass/${cls._id}`}
                            state={{ from: "/app/classes" }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors"
                          >
                            <FaPlus className="w-3 h-3" />
                            Add Students
                          </Link>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                          {/* Attendance Button - NEW */}
                          <Link
                            to={`/app/attendance/${cls._id}`}
                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-gradient-to-r from-brand-navy to-brand-teal text-white rounded-lg hover:opacity-90 transition-opacity min-w-[85px]"
                          >
                            <FaCalendar className="w-3 h-3" />
                            Attendance
                          </Link>
                          
                          <Link
                            to={`/app/classes/${cls._id}/edit`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors"
                          >
                            <FaEdit className="w-3 h-3" />
                            Edit
                          </Link>
                          <Link
                            to={`/app/classes/${cls._id}/view`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors"
                          >
                            <FaSearch className="w-3 h-3" />
                            View
                          </Link>
                          <button
                            onClick={() => handleDelete(cls._id, cls.class_code)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <FaTrash className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {filteredClasses.length > 0 && (
            <div className="px-4 md:px-6 py-3 border-t border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  Showing <span className="font-medium text-light-textPrimary dark:text-dark-textPrimary">{filteredClasses.length}</span> of{" "}
                  <span className="font-medium text-light-textPrimary dark:text-dark-textPrimary">{classes.length}</span> classes
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Total Students: {classes.reduce((total, cls) => total + (cls.students?.length || 0), 0)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Teachers: {new Set(classes.map(cls => cls.teacher?._id).filter(Boolean)).size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>Rooms: {new Set(classes.map(cls => cls.room).filter(Boolean)).size}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions for Mobile */}
        <div className="mt-6 md:hidden">
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 border border-light-border dark:border-dark-border">
            <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/app/addclass"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors"
              >
                <FaPlus />
                <span>Add Class</span>
              </Link>
              <button
                onClick={handleRefresh}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-light-border dark:border-dark-border rounded-lg text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors"
              >
                <FaSync />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Classes by Semester Chart */}
        {filteredClasses.length > 0 && (
          <div className="mt-8 bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border p-6">
            <h3 className="text-lg font-medium text-light-textPrimary dark:text-dark-textPrimary mb-4">
              Classes by Semester
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
              {semesters.map(semester => {
                const semesterClasses = classes.filter(cls => cls.semester === semester);
                const percentage = (semesterClasses.length / classes.length) * 100;
                
                return (
                  <div key={semester} className="text-center">
                    <div className="text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary mb-1">
                      {semester}
                    </div>
                    <div className="text-2xl font-bold text-brand-teal">
                      {semesterClasses.length}
                    </div>
                    <div className="w-full bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-full h-2 mt-2">
                      <div
                        className="bg-brand-teal h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManagement;
