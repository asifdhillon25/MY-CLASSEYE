import React from "react";
import { Link } from "react-router-dom";
import { 
  FaUsers, 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaChartLine,
  FaCog,
  FaClipboardCheck,
  FaBell,
  FaDatabase,
  FaExclamationTriangle,
  FaCalendarCheck,
  FaImage,
  FaRobot,
  FaUserPlus
} from "react-icons/fa";
import { useGetDashboardOverviewQuery } from "../redux/features/dashboard/dashboardApi";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";

function AdminDashboard() {
  const { data: dashboardData, isLoading, isError } = useGetDashboardOverviewQuery();
  console.log("Dashboard Data:", dashboardData);
  
  // Admin-specific statistics using real data
  const adminStats = [
    {
      title: "Total Students",
      value: dashboardData?.data.kpis.totalStudents || "0",
      change: `+${dashboardData?.data.trends.newStudentsThisMonth || 0}`,
      icon: <FaUserGraduate className="text-2xl" />,
      color: "from-brand-teal to-green-500",
      trendIcon: <MdTrendingUp className="text-green-500" />,
    },
    {
      title: "Total Teachers",
      value: dashboardData?.data.kpis.totalTeachers || "0",
      change: `+${dashboardData?.data.trends.newTeachersThisMonth || 0}`,
      icon: <FaChalkboardTeacher className="text-2xl" />,
      color: "from-brand-navy to-blue-600",
      trendIcon: <MdTrendingUp className="text-green-500" />,
    },
    {
      title: "Active Classes",
      value: dashboardData?.data.kpis.activeClasses || "0",
      change: "-" + (dashboardData?.data.risks.classesWithoutAttendanceThisWeek || 0),
      icon: <FaUsers className="text-2xl" />,
      color: "from-blue-500 to-indigo-600",
      trendIcon: dashboardData?.data.risks.classesWithoutAttendanceThisWeek > 0 ? 
        <MdTrendingDown className="text-amber-500" /> : 
        <MdTrendingUp className="text-green-500" />,
    },
    {
      title: "Today's Attendance",
      value: `${dashboardData?.data.kpis.attendanceTodayPercent || 0}%`,
      change: "Today",
      icon: <FaCalendarCheck className="text-2xl" />,
      color: "from-purple-500 to-pink-500",
      trendIcon: dashboardData?.data.kpis.attendanceTodayPercent > 90 ? 
        <MdTrendingUp className="text-green-500" /> : 
        <MdTrendingDown className="text-amber-500" />,
    },
  ];

// Quick actions for admin
const quickActions = [
  { 
    title: "Manage Students", 
    icon: <FaUserGraduate />, 
    link: "/app/students", // Changed from "/app/manage-students"
    color: "bg-gradient-to-br from-brand-teal to-green-500" 
  },
  { 
    title: "Manage Teachers", 
    icon: <FaChalkboardTeacher />, 
    link: "/app/teachers", // Changed from "/app/manage-teachers"
    color: "bg-gradient-to-br from-brand-navy to-blue-600" 
  },
  { 
    title: "Class Management", 
    icon: <FaClipboardCheck />, 
    link: "/app/classes", 
    color: "bg-gradient-to-br from-blue-500 to-indigo-600" 
  },
  { 
    title: "View Reports", 
    icon: <FaChartLine />, 
    link: "/app/reports", 
    color: "bg-gradient-to-br from-purple-500 to-pink-500" 
  },
  { 
    title: "System Settings", 
    icon: <FaCog />, 
    link: "/app/settings", 
    color: "bg-gradient-to-br from-gray-600 to-gray-700" 
  },
  { 
    title: "Add Teacher", 
    icon: <FaUserPlus />, // You might want to use a different icon
    link: "/app/addteacher", 
    color: "bg-gradient-to-br from-orange-500 to-red-500" 
  },
];

  // System status items
  const systemStatus = [
    {
      title: "AI Embeddings",
      status: `${dashboardData?.data.aiUsage.embeddingCoveragePercent || 0}% Coverage`,
      icon: <FaRobot className="text-orange-500" />,
      link: "/app/ai-settings",
      color: dashboardData?.data.aiUsage.embeddingCoveragePercent > 75 ? "text-green-500" : "text-amber-500",
    },
    {
      title: "Image Attendance",
      status: `${dashboardData?.data.aiUsage.imageAttendanceRatio || 0}% Usage`,
      icon: <FaImage className="text-purple-500" />,
      link: "/app/attendance-settings",
      color: dashboardData?.data.aiUsage.imageAttendanceRatio > 60 ? "text-green-500" : "text-amber-500",
    },
    {
      title: "Database",
      status: "Healthy • Real-time",
      icon: <FaDatabase className="text-brand-teal" />,
      link: "/app/database",
      color: "text-green-500",
    },
    {
      title: "Notifications",
      status: "Active • Ready",
      icon: <FaBell className="text-blue-500" />,
      link: "/app/notifications",
      color: "text-green-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal mx-auto"></div>
          <p className="mt-4 text-light-textSecondary dark:text-dark-textSecondary">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
            Unable to load dashboard data
          </h2>
          <p className="text-light-textSecondary dark:text-dark-textSecondary">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
            Admin Dashboard
          </h1>
          <p className="text-light-textSecondary dark:text-dark-textSecondary mt-1">
            Real-time System Overview & Analytics
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className="px-4 py-2 bg-gradient-to-r from-light-surface to-light-surfaceMuted dark:from-dark-surface dark:to-dark-surfaceMuted rounded-lg border border-light-border dark:border-dark-border">
            <span className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Last updated:</span>
            <span className="ml-2 text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">Just now</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, index) => (
          <div 
            key={index} 
            className="group bg-light-surface dark:bg-dark-surface rounded-xl p-5 shadow-lg border border-light-border dark:border-dark-border hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mt-2 text-light-textPrimary dark:text-dark-textPrimary">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  {stat.trendIcon}
                  <span className="text-sm font-medium ml-1">
                    {stat.change} 
                    <span className="text-light-textMuted dark:text-dark-textMuted font-normal ml-1">
                      {stat.title === "Today's Attendance" ? "" : "this month"}
                    </span>
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-5 shadow border border-light-border dark:border-dark-border">
            <h2 className="text-xl font-semibold mb-5 text-light-textPrimary dark:text-dark-textPrimary">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="group flex flex-col items-center justify-center p-5 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-xl hover:bg-gradient-to-br hover:from-light-surface hover:to-light-surfaceMuted dark:hover:from-dark-surface dark:hover:to-dark-surfaceMuted transition-all duration-300 text-center hover:shadow-lg hover:translate-y-[-2px] transform border border-light-border dark:border-dark-border"
                >
                  <div className={`p-3 rounded-xl ${action.color} text-white mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {action.icon}
                  </div>
                  <span className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                    {action.title}
                  </span>
                  <span className="text-xs text-light-textMuted dark:text-dark-textMuted mt-1">
                    Click to navigate
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Risks Section */}
          <div className="mt-6 bg-light-surface dark:bg-dark-surface rounded-xl p-5 shadow border border-light-border dark:border-dark-border">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                Risk Indicators
              </h2>
              <div className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium">
                Attention Required
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-900/10 dark:to-amber-900/10 rounded-lg border border-red-100 dark:border-red-800/30">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                    At Risk Students
                  </span>
                </div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {dashboardData?.data.risks.atRiskStudents || 0}
                </p>
                <p className="text-sm text-light-textMuted dark:text-dark-textMuted mt-1">
                  Need immediate attention
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-lg border border-amber-100 dark:border-amber-800/30">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                    Inactive Students
                  </span>
                </div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {dashboardData?.data.risks.inactiveStudents || 0}
                </p>
                <p className="text-sm text-light-textMuted dark:text-dark-textMuted mt-1">
                  No recent activity
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/10 dark:to-yellow-900/10 rounded-lg border border-orange-100 dark:border-orange-800/30">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                  <span className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                    Inactive Classes
                  </span>
                </div>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {dashboardData?.data.risks.classesWithoutAttendanceThisWeek || 0}
                </p>
                <p className="text-sm text-light-textMuted dark:text-dark-textMuted mt-1">
                  No attendance this week
                </p>
              </div>
            </div>
            
            <Link
              to="/app/risk-management"
              className="block w-full text-center py-3 mt-4 text-sm font-medium text-brand-teal hover:text-brand-teal/80 transition-colors border-t border-light-border dark:border-dark-border pt-4"
            >
              Manage All Risks →
            </Link>
          </div>
        </div>

        {/* Right Column: AI Usage & Trends */}
        <div className="space-y-6">
          {/* AI Usage */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-5 shadow border border-light-border dark:border-dark-border">
            <h2 className="text-xl font-semibold mb-5 text-light-textPrimary dark:text-dark-textPrimary">
              AI Usage Analytics
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    Embedding Coverage
                  </span>
                  <span className="text-sm font-bold text-light-textPrimary dark:text-dark-textPrimary">
                    {dashboardData?.data.aiUsage.embeddingCoveragePercent || 0}%
                  </span>
                </div>
                <div className="w-full bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-brand-teal to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${dashboardData?.data.aiUsage.embeddingCoveragePercent || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    Image Attendance Usage
                  </span>
                  <span className="text-sm font-bold text-light-textPrimary dark:text-dark-textPrimary">
                    {dashboardData?.data.aiUsage.imageAttendanceRatio || 0}%
                  </span>
                </div>
                <div className="w-full bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${dashboardData?.data.aiUsage.imageAttendanceRatio || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-light-border dark:border-dark-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                      Weekly Attendance
                    </p>
                    <p className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                      {dashboardData?.data.trends.attendanceLast7Days?.toLocaleString() || 0}
                    </p>
                  </div>
                  <FaChartLine className="text-2xl text-brand-teal" />
                </div>
              </div>
            </div>
            
            <Link
              to="/app/ai-analytics"
              className="block w-full text-center py-3 mt-4 text-sm font-medium text-brand-teal hover:text-brand-teal/80 transition-colors border-t border-light-border dark:border-dark-border pt-4"
            >
              View AI Analytics →
            </Link>
          </div>

          {/* System Status */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-5 shadow border border-light-border dark:border-dark-border">
            <h2 className="text-xl font-semibold mb-5 text-light-textPrimary dark:text-dark-textPrimary">
              System Status
            </h2>
            
            <div className="space-y-3">
              {systemStatus.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="group p-3 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-white dark:bg-dark-surface mr-3 group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
                        {item.title}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className={`w-2 h-2 rounded-full mr-2 ${item.color === "text-green-500" ? "bg-green-500" : "bg-amber-500"}`}></div>
                        <span className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <span className="text-light-textMuted dark:text-dark-textMuted group-hover:text-brand-teal transition-colors">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Footer */}
      <div className="flex flex-wrap gap-3 justify-center pt-6 border-t border-light-border dark:border-dark-border">
        <Link
          to="/app/addstudent"
          className="px-4 py-2 bg-gradient-to-r from-brand-teal to-green-500 text-white rounded-lg hover:opacity-90 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
        >
          Add New Student
        </Link>
        <Link
          to="/app/addteacher"
          className="px-4 py-2 bg-gradient-to-r from-brand-navy to-blue-600 text-white rounded-lg hover:opacity-90 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
        >
          Add New Teacher
        </Link>
        <Link
          to="/app/reports"
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
        >
          Student Reports
        </Link>
        
      </div>
    </div>
  );
}

export default AdminDashboard;