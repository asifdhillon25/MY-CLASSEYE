import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetClassAttendanceQuery,
  useCreateManualAttendanceMutation,
  useCreateImageAttendanceMutation,
  useFinalizeAttendanceMutation,
  useUpdateStudentStatusMutation,
  formatDateForAPI,
  calculateAttendanceStats
} from "../redux/features/attendance/attendanceApi";
import LoadingSpinner from "../pages/components/LoadingSpinner";
import ErrorMessage from "../pages/components/ErrorMessage";
import ManualAttendanceModal from "../pages/components/ManualAttendanceModal";
import ImageAttendanceModal from "../pages/components/ImageAttendanceModal";
import {
  FaUsers,
  FaCalendar,
  FaClock,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaCamera,
  FaClipboardCheck,
  FaEdit,
  FaLock,
  FaHistory,
  FaUserCheck,
  FaUserTimes,
  FaPercentage,
  FaArrowLeft,
  FaInfoCircle
} from "react-icons/fa";

const Attendance = () => {
  const { id: classId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [selectedTab, setSelectedTab] = useState("attendance");
  const [showImageModal, setShowImageModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [date, setDate] = useState(formatDateForAPI());

  // Helper function to check if date is today or past
  const isDateTodayOrPast = (dateString) => {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate <= today;
  };

  // Fetch attendance data
  const {
    data: attendanceResponse,
    isLoading: attendanceLoading,
    isError: attendanceError,
    error: attendanceErrorData,
    refetch: refetchAttendance
  } = useGetClassAttendanceQuery(
    { classId, date },
    { 
      skip: !classId || !date,
      refetchOnMountOrArgChange: true
    }
  );

  

  // Extract data from API response
 
  const attendance = attendanceResponse || {};
  const classInfo = attendance.class_info || {};
  
  // Get students with embeddings info
  const students = attendance.records?.map(record => {
    const student = record.student || {};
    return {
      _id: student._id || record.student,
      name: student.name || "Unknown Student",
      roll_no: student.roll_no,
      has_embeddings: student.has_embeddings !== undefined ? student.has_embeddings : false
    };
  }) || [];

  const records = attendance.records || [];
  const stats = calculateAttendanceStats(records);

  // Mutations
  const [createManualAttendance, { isLoading: isCreatingManual }] = useCreateManualAttendanceMutation();
  const [createImageAttendance, { isLoading: isCreatingImage }] = useCreateImageAttendanceMutation();
  const [finalizeAttendance, { isLoading: isFinalizing }] = useFinalizeAttendanceMutation();
  const [updateStudentStatus] = useUpdateStudentStatusMutation();

  // Handle manual attendance submission
  const handleManualAttendanceSubmit = async (manualRecords) => {
    try {
      const result = await createManualAttendance({
        classId,
        teacherId: user?._id,
        records: manualRecords.map(record => ({
          studentId: record.studentId,
          status: record.status
        }))
      }).unwrap();

      refetchAttendance();
      return { success: true, data: result };
    } catch (error) {
      console.error("Manual attendance error:", error);
      return { 
        success: false, 
        error: error.data?.message || error.message || "Failed to save attendance" 
      };
    }
  };

  // Handle image attendance submission - FIXED to pass proper format
  const handleImageAttendanceSubmit = async ({ classId, teacherId, images }) => {
    try {
      const result = await createImageAttendance({
        classId,
        teacherId,
        images // This should be an array of File objects
      }).unwrap();

      refetchAttendance();
      return { success: true, data: result };
    } catch (error) {
      console.error("Image attendance error:", error);
      return { 
        success: false, 
        error: error.data?.message || error.message || "Failed to process images" 
      };
    }
  };

  // Handle finalize attendance
  const handleFinalizeAttendance = async () => {
    if (!isDateTodayOrPast(date)) {
      alert("Cannot finalize attendance for future dates. Finalization is only available for today or past dates.");
      return;
    }

    if (!attendance._id) {
      alert("No attendance record to finalize");
      return;
    }

    if (!window.confirm("Are you sure you want to finalize attendance? This cannot be undone.")) {
      return;
    }

    try {
      await finalizeAttendance({
        attendanceId: attendance._id,
        teacherId: user?._id
      }).unwrap();

      refetchAttendance();
      alert("Attendance finalized successfully!");
    } catch (error) {
      alert(error.data?.message || error.message || "Failed to finalize attendance");
    }
  };

  // Handle toggle student status
  const handleToggleStudentStatus = async (studentId, currentStatus) => {
    if (attendance.is_finalized) {
      alert("Cannot modify finalized attendance");
      return;
    }

    if (!attendance._id) {
      alert("No attendance record found");
      return;
    }

    const newStatus = currentStatus === "present" ? "absent" : "present";

    try {
      await updateStudentStatus({
        attendanceId: attendance._id,
        studentId,
        status: newStatus,
        marked_by: "manual"
      }).unwrap();

      refetchAttendance();
    } catch (error) {
      console.error("Update student status error:", error);
      alert(error.data?.message || error.message || "Failed to update student status");
    }
  };

  // Handle date change
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0);
    
    let dateText = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (selectedDate > today) {
      dateText += " (Future Date)";
    } else if (selectedDate < today) {
      dateText += " (Past Date)";
    }
    
    return dateText;
  };

  if (attendanceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading attendance data..." fullScreen />
      </div>
    );
  }

  if (attendanceError) {
    return (
      <div className="min-h-screen p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <ErrorMessage 
            error={attendanceErrorData} 
            onRetry={() => refetchAttendance()}
            title="Failed to Load Attendance"
          />
          <div className="mt-6 text-center">
            <Link
              to="/app/classes"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors"
            >
              <FaArrowLeft />
              Back to Classes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Link
                  to="/app/classes"
                  className="flex items-center gap-2 text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary transition-colors"
                >
                  <FaArrowLeft />
                  Back to Classes
                </Link>
              </div>
              
              <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary mb-2">
                  {classInfo.course_name || "Attendance Management"}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-light-textSecondary dark:text-dark-textSecondary">
                  {classInfo.code && (
                    <div className="flex items-center gap-2">
                      <FaBuilding className="w-4 h-4" />
                      <span className="font-medium">{classInfo.code}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <FaUsers className="w-4 h-4" />
                    <span>{students.length} Students</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FaClock className="w-4 h-4" />
                    <span>{formatDisplayDate(date)}</span>
                  </div>
                </div>
              </div>

              {/* Date Selector */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="w-4 h-4" />
                    <input
                      type="date"
                      value={date}
                      onChange={handleDateChange}
                      className="px-3 py-1.5 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    />
                  </div>
                </div>
                
                {!isDateTodayOrPast(date) && (
                  <div className="mt-1 text-amber-600 dark:text-amber-400 text-sm flex items-center gap-2">
                    <FaInfoCircle />
                    You are viewing/marking attendance for a future date. Finalization will be available on or after this date.
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {!attendance.is_finalized && (
                <>
                  <button
                    onClick={() => setShowManualModal(true)}
                    disabled={isCreatingManual}
                    className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaClipboardCheck className="w-4 h-4" />
                    {isCreatingManual ? "Saving..." : "Manual Mark"}
                  </button>
                  <button
                    onClick={() => setShowImageModal(true)}
                    disabled={isCreatingImage}
                    className="px-4 py-2 bg-gradient-to-r from-brand-navy to-brand-teal text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaCamera className="w-4 h-4" />
                    {isCreatingImage ? "Processing..." : "Image Mark"}
                  </button>
                </>
              )}
              
              {attendance._id && !attendance.is_finalized && isDateTodayOrPast(date) && (
                <button
                  onClick={handleFinalizeAttendance}
                  disabled={isFinalizing}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaLock className="w-4 h-4" />
                  {isFinalizing ? "Finalizing..." : "Finalize"}
                </button>
              )}

              {attendance._id && !attendance.is_finalized && !isDateTodayOrPast(date) && (
                <span className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-lg flex items-center gap-2">
                  <FaLock className="w-4 h-4" />
                  Finalize on {date}
                </span>
              )}

              {attendance.is_finalized && (
                <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg flex items-center gap-2">
                  <FaLock className="w-4 h-4" />
                  Finalized
                </span>
              )}
            </div>
          </div>

          {/* Attendance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-800 dark:text-green-300 mb-1">Present</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                    {stats.present}
                  </p>
                </div>
                <FaUserCheck className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-800 dark:text-red-300 mb-1">Absent</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-200">
                    {stats.absent}
                  </p>
                </div>
                <FaUserTimes className="w-8 h-8 text-red-500" />
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">Attendance</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                    {stats.percentage}%
                  </p>
                </div>
                <FaPercentage className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-800 dark:text-purple-300 mb-1">Total</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                    {stats.total}
                  </p>
                </div>
                <FaUsers className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-light-border dark:border-dark-border">
            <button
              className={`flex items-center gap-2 px-4 py-2 font-medium ${selectedTab === "attendance" 
                ? "text-brand-teal border-b-2 border-brand-teal" 
                : "text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary"}`}
              onClick={() => setSelectedTab("attendance")}
            >
              <FaCheckCircle />
              {formatDisplayDate(date).split('(')[0].trim()}
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 font-medium ${selectedTab === "students" 
                ? "text-brand-teal border-b-2 border-brand-teal" 
                : "text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary"}`}
              onClick={() => setSelectedTab("students")}
            >
              <FaUsers />
              Students ({students.length})
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 font-medium ${selectedTab === "history" 
                ? "text-brand-teal border-b-2 border-brand-teal" 
                : "text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary"}`}
              onClick={() => setSelectedTab("history")}
            >
              <FaHistory />
              History
            </button>
          </div>
        </div>

        {/* Content */}
        {selectedTab === "attendance" && (
          <div className="space-y-4">
            {records.length === 0 ? (
              <div className="text-center py-12 bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border">
                <FaClipboardCheck className="w-16 h-16 mx-auto mb-4 text-light-textMuted dark:text-dark-textMuted" />
                <h3 className="text-lg font-medium text-light-textPrimary dark:text-dark-textPrimary mb-2">
                  No Attendance Marked Yet
                </h3>
                <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6">
                  Mark attendance for {formatDisplayDate(date)} to get started
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setShowManualModal(true)}
                    className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors flex items-center gap-2"
                  >
                    <FaClipboardCheck className="w-4 h-4" />
                    Mark Manually
                  </button>
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-brand-navy to-brand-teal text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <FaCamera className="w-4 h-4" />
                    Mark with Images
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Attendance Records */}
                <div className="bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
                  <div className="p-4 border-b border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h3 className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                        Attendance Records
                        <span className="ml-2 text-sm text-light-textSecondary dark:text-dark-textSecondary">
                          ({records.length} students)
                        </span>
                      </h3>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span>Present: {stats.present}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span>Absent: {stats.absent}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-light-border dark:divide-dark-border max-h-[500px] overflow-y-auto">
                    {records.map((record) => {
                      const student = {
                        _id: record.student?._id || record.student,
                        name: record.student?.name || "Unknown Student",
                        roll_no: record.student?.roll_no
                      };
                      
                      return (
                        <div 
                          key={student._id} 
                          className="p-4 hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-brand-teal to-brand-navy flex items-center justify-center text-white font-bold text-lg">
                                {student.name?.charAt(0) || "S"}
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <p className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
                                    {student.name}
                                  </p>
                                  <span className="text-sm px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded">
                                    {student.roll_no}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-light-textSecondary dark:text-dark-textSecondary">
                                  <span className="flex items-center gap-1">
                                    <FaClock className="w-3 h-3" />
                                    {record.marked_by === "image" ? "Auto-detected" : "Manual"}
                                  </span>
                                  {record.confidence && (
                                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
                                      {Math.round(record.confidence * 100)}% confidence
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                                record.status === "present"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              }`}>
                                {record.status === "present" ? (
                                  <FaCheckCircle className="w-4 h-4" />
                                ) : (
                                  <FaTimesCircle className="w-4 h-4" />
                                )}
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              </span>
                              
                              {!attendance.is_finalized && (
                                <button
                                  onClick={() => handleToggleStudentStatus(
                                    student._id, 
                                    record.status
                                  )}
                                  className="p-2 text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted rounded-lg transition-colors"
                                  title={record.status === "present" ? "Mark as absent" : "Mark as present"}
                                >
                                  <FaEdit className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Attendance Summary Card */}
                {stats.total > 0 && (
                  <div className="bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border p-6">
                    <h4 className="font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-4 flex items-center gap-2">
                      <FaPercentage className="text-brand-teal" />
                      Attendance Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-light-textSecondary dark:text-dark-textSecondary">Attendance Rate</span>
                          <span className="font-bold text-light-textPrimary dark:text-dark-textPrimary">
                            {stats.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-brand-teal h-3 rounded-full transition-all duration-500"
                            style={{ width: `${stats.percentage}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-light-textSecondary dark:text-dark-textSecondary flex items-center gap-2">
                            <FaUserCheck className="text-green-500" />
                            Present Students
                          </span>
                          <span className="font-bold text-green-600 dark:text-green-400">{stats.present}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-light-textSecondary dark:text-dark-textSecondary flex items-center gap-2">
                            <FaUserTimes className="text-red-500" />
                            Absent Students
                          </span>
                          <span className="font-bold text-red-600 dark:text-red-400">{stats.absent}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Finalization Status */}
                    {attendance._id && (
                      <div className="mt-6 pt-6 border-t border-light-border dark:border-dark-border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FaLock className="w-5 h-5" />
                            <span className="text-light-textPrimary dark:text-dark-textPrimary font-medium">
                              Attendance Status:
                            </span>
                            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              attendance.is_finalized
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : !isDateTodayOrPast(date)
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            }`}>
                              {attendance.is_finalized 
                                ? "Finalized" 
                                : !isDateTodayOrPast(date)
                                ? "Pending Finalization (Future Date)"
                                : "Pending Finalization"
                              }
                            </span>
                          </div>
                          
                          {attendance._id && !attendance.is_finalized && isDateTodayOrPast(date) && (
                            <button
                              onClick={handleFinalizeAttendance}
                              disabled={isFinalizing}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaLock className="w-4 h-4" />
                              {isFinalizing ? "Finalizing..." : "Finalize Now"}
                            </button>
                          )}
                        </div>
                        
                        {!attendance.is_finalized && !isDateTodayOrPast(date) && (
                          <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                            <FaInfoCircle className="inline mr-1" />
                            This attendance is for a future date. Finalization will be available on or after {date}.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {selectedTab === "students" && (
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
            <div className="p-4 border-b border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                  Class Students
                  <span className="ml-2 text-sm text-light-textSecondary dark:text-dark-textSecondary">
                    ({students.length} total)
                  </span>
                </h3>
                <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  Roll Call for {formatDisplayDate(date)}
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-light-border dark:divide-dark-border">
              {students.map((student) => {
                const attendanceRecord = records.find(r => 
                  r.student?._id === student._id || r.student === student._id
                );
                
                return (
                  <div key={student._id} className="p-4 hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-brand-teal to-brand-navy flex items-center justify-center text-white font-bold text-lg">
                          {student.name?.charAt(0) || "S"}
                        </div>
                        <div>
                          <p className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
                            {student.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                              {student.roll_no}
                            </span>
                            {student.has_embeddings && (
                              <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded">
                                Face ID
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {attendanceRecord ? (
                          <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                            attendanceRecord.status === "present"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}>
                            {attendanceRecord.status.charAt(0).toUpperCase() + attendanceRecord.status.slice(1)}
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                            Not Marked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedTab === "history" && (
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border p-6">
            <div className="text-center py-12">
              <FaHistory className="w-20 h-20 mx-auto mb-6 text-light-textMuted dark:text-dark-textMuted opacity-50" />
              <h3 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-3">
                Attendance History
              </h3>
              <p className="text-light-textSecondary dark:text-dark-textSecondary mb-8 max-w-md mx-auto">
                View past attendance records, trends, and download reports for this class.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => alert("This feature will be implemented soon!")}
                  className="px-5 py-2.5 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors flex items-center gap-2"
                >
                  <FaCalendar />
                  View Monthly Report
                </button>
                <button
                  onClick={() => alert("Export feature coming soon!")}
                  className="px-5 py-2.5 border border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary rounded-lg hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors"
                >
                  Export Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ManualAttendanceModal
        classId={classId}
        classInfo={classInfo}
        students={students}
        currentAttendance={attendance}
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onSubmit={handleManualAttendanceSubmit}
        isLoading={isCreatingManual}
      />

      <ImageAttendanceModal
        classId={classId}
        classInfo={classInfo}
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onSubmit={handleImageAttendanceSubmit}
        isLoading={isCreatingImage}
        user={user}
      />
    </div>
  );
};

export default Attendance;