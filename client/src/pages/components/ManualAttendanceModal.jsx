import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaUserCheck,
  FaUserTimes,
  FaSave,
  FaSpinner,
  FaFilter,
  FaInfoCircle
} from "react-icons/fa";

const ManualAttendanceModal = ({
  classId,
  classInfo,
  students = [],
  currentAttendance = {},
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, present, absent, unmarked
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize attendance records from current attendance
  useEffect(() => {
    if (students.length > 0) {
      const initialRecords = students.map(student => {
        // Check if student already has attendance record
        const existingRecord = currentAttendance.records?.find(record => 
          record.student?._id === student._id || record.student === student._id
        );
        
        return {
          studentId: student._id,
          name: student.name,
          roll_no: student.roll_no,
          status: existingRecord?.status || "absent",
          marked_by: existingRecord?.marked_by || "manual",
          confidence: existingRecord?.confidence,
          isExisting: !!existingRecord
        };
      });
      
      setAttendanceRecords(initialRecords);
    }
  }, [students, currentAttendance]);

  // Handle status toggle for a student
  const handleToggleStatus = (studentId) => {
    setAttendanceRecords(prev => prev.map(record => {
      if (record.studentId === studentId) {
        const newStatus = record.status === "present" ? "absent" : "present";
        return {
          ...record,
          status: newStatus,
          marked_by: "manual",
          confidence: null
        };
      }
      return record;
    }));
  };

  // Handle bulk status change
  const handleBulkStatus = (status) => {
    setAttendanceRecords(prev => prev.map(record => ({
      ...record,
      status: status,
      marked_by: "manual",
      confidence: null
    })));
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  // Filter students based on search and filter
  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = 
      record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.roll_no?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === "all" || 
      record.status === filterStatus ||
      (filterStatus === "unmarked" && !record.isExisting);
    
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const stats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter(r => r.status === "present").length,
    absent: attendanceRecords.filter(r => r.status === "absent").length,
    percentage: attendanceRecords.length > 0 
      ? ((attendanceRecords.filter(r => r.status === "present").length / attendanceRecords.length) * 100).toFixed(1)
      : 0
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (isSubmitting || isLoading) return;

    // Validate that we have records
    if (attendanceRecords.length === 0) {
      alert("No students to mark attendance for");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await onSubmit(attendanceRecords);
      
      if (result.success) {
        // Close modal after successful submission
        setTimeout(() => {
          setIsSubmitting(false);
          onClose();
        }, 1000);
      } else {
        alert(result.error || "Failed to save attendance");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to save attendance");
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (isSubmitting || isLoading) {
      if (!window.confirm('Attendance is being saved. Are you sure you want to cancel?')) {
        return;
      }
    }
    onClose();
  };

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
        <div className="relative bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border w-full max-w-5xl shadow-elevated">
          {/* Header */}
          <div className="p-6 border-b border-light-border dark:border-dark-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary flex items-center gap-3">
                  <FaUserCheck className="text-brand-teal" />
                  Manual Attendance
                </h2>
                <p className="text-light-textSecondary dark:text-dark-textSecondary mt-1">
                  Mark attendance for {classInfo?.course_name || "this class"}
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting || isLoading}
                className="p-2 hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted rounded-lg transition-colors disabled:opacity-50"
              >
                <FaTimes className="w-5 h-5 text-light-textSecondary dark:text-dark-textSecondary" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Stats and Actions Bar */}
            <div className="mb-6 p-4 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-xl border border-light-border dark:border-dark-border">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-light-textPrimary dark:text-dark-textPrimary">
                      Present: <strong>{stats.present}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-light-textPrimary dark:text-dark-textPrimary">
                      Absent: <strong>{stats.absent}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-light-textPrimary dark:text-dark-textPrimary">
                      Total: <strong>{stats.total}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-light-textPrimary dark:text-dark-textPrimary">
                      Rate: <strong>{stats.percentage}%</strong>
                    </span>
                  </div>
                </div>

                {/* Bulk Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleBulkStatus("present")}
                    disabled={isSubmitting || isLoading}
                    className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <FaUserCheck className="w-3 h-3" />
                    Mark All Present
                  </button>
                  <button
                    onClick={() => handleBulkStatus("absent")}
                    disabled={isSubmitting || isLoading}
                    className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <FaUserTimes className="w-3 h-3" />
                    Mark All Absent
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-textMuted dark:text-dark-textMuted" />
                    <input
                      type="text"
                      placeholder="Search students by name or roll number..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all"
                      disabled={isSubmitting || isLoading}
                    />
                  </div>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <FaFilter className="text-light-textSecondary dark:text-dark-textSecondary" />
                  <select
                    value={filterStatus}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="px-3 py-2.5 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal min-w-[140px]"
                    disabled={isSubmitting || isLoading}
                  >
                    <option value="all">All Students</option>
                    <option value="present">Present Only</option>
                    <option value="absent">Absent Only</option>
                    <option value="unmarked">Not Marked</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Students List */}
            <div className="bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
              <div className="overflow-x-auto max-h-[400px]">
                <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
                  <thead className="bg-light-surfaceMuted dark:bg-dark-surfaceMuted sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
                        Roll No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
                        Current Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light-border dark:divide-dark-border">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <FaSearch className="w-12 h-12 mb-3 text-light-textMuted dark:text-dark-textMuted opacity-50" />
                            <p className="text-light-textSecondary dark:text-dark-textSecondary">
                              {searchTerm 
                                ? "No students found matching your search"
                                : "No students found"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((record) => (
                        <tr 
                          key={record.studentId} 
                          className="hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-teal to-brand-navy flex items-center justify-center text-white font-bold">
                                {record.name?.charAt(0) || "S"}
                              </div>
                              <div>
                                <p className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
                                  {record.name}
                                </p>
                                <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                                  {record.isExisting ? "Previously marked" : "Not marked yet"}
                                </p>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-4 py-3">
                            <span className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
                              {record.roll_no}
                            </span>
                          </td>
                          
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              record.status === "present"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                          </td>
                          
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleToggleStatus(record.studentId)}
                              disabled={isSubmitting || isLoading}
                              className={`px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                                record.status === "present"
                                  ? "bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/40 text-red-800 dark:text-red-300"
                                  : "bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/40 text-green-800 dark:text-green-300"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {record.status === "present" ? (
                                <>
                                  <FaTimesCircle className="w-3 h-3" />
                                  Mark Absent
                                </>
                              ) : (
                                <>
                                  <FaCheckCircle className="w-3 h-3" />
                                  Mark Present
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Info Message */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex gap-3">
                <FaInfoCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-light-textPrimary dark:text-dark-textPrimary mb-1">
                    Manual Attendance Tips
                  </h4>
                  <ul className="text-sm text-light-textSecondary dark:text-dark-textSecondary space-y-1">
                    <li>• Click on any student to toggle their attendance status</li>
                    <li>• Use bulk actions to mark all students at once</li>
                    <li>• Search by name or roll number to find specific students</li>
                    <li>• Attendance will be saved when you click "Save Attendance"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-b-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                <div className="flex items-center gap-2">
                  <span>Students: {stats.total}</span>
                  <span className="text-green-600 dark:text-green-400">• Present: {stats.present}</span>
                  <span className="text-red-600 dark:text-red-400">• Absent: {stats.absent}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={isSubmitting || isLoading}
                  className="px-4 py-2 border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-surface dark:hover:bg-dark-surface transition-colors disabled:opacity-50 min-w-[80px]"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isLoading || attendanceRecords.length === 0}
                  className="px-6 py-2 bg-gradient-to-r from-brand-navy to-brand-teal text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4" />
                      Save Attendance
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

export default ManualAttendanceModal;