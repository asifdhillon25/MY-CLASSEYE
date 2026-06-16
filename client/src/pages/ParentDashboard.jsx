import React, { useState } from "react";
import { 
  FaUserGraduate, 
  FaCalendarCheck, 
  FaChartLine,
  FaSchool,
  FaBook,
  FaBell,
  FaUserFriends
} from "react-icons/fa";

function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState("Ali Ahmed");

  // Parent Stats
  const parentStats = [
    {
      title: "Child's Grade",
      value: "A-",
      change: "+2%",
      icon: <FaUserGraduate className="text-2xl" />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Attendance",
      value: "96%",
      change: "+1%",
      icon: <FaCalendarCheck className="text-2xl" />,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Behavior Score",
      value: "88/100",
      change: "+5%",
      icon: <FaChartLine className="text-2xl" />,
      color: "from-brand-teal to-brand-aqua",
    },
    {
      title: "Assignments Done",
      value: "24/30",
      change: "+3",
      icon: <FaBook className="text-2xl" />,
      color: "from-purple-500 to-pink-500",
    },
  ];

  // Children
  const children = [
    { name: "Ali Ahmed", grade: "10-A", age: 15, studentId: "STU-001" },
    { name: "Sara Ahmed", grade: "8-B", age: 13, studentId: "STU-002" },
  ];

  // Child's Schedule
  const schedule = [
    { time: "8:00 AM", subject: "Mathematics", teacher: "Mr. Khan" },
    { time: "9:00 AM", subject: "Science", teacher: "Ms. Ali" },
    { time: "10:00 AM", subject: "English", teacher: "Mrs. Smith" },
    { time: "11:00 AM", subject: "Break", teacher: "-" },
    { time: "12:00 PM", subject: "Computer Science", teacher: "Mr. Raza" },
    { time: "1:00 PM", subject: "Physical Education", teacher: "Coach Ahmed" },
  ];

  // Recent Updates
  const updates = [
    { type: "Grade", message: "Mathematics test: 85% (B+)", date: "Today", icon: "📊" },
    { type: "Attendance", message: "Present all week", date: "Yesterday", icon: "✅" },
    { type: "Behavior", message: "Good participation in class", date: "2 days ago", icon: "⭐" },
    { type: "Assignment", message: "Science project submitted", date: "3 days ago", icon: "📝" },
    { type: "Notice", message: "Parent-Teacher meeting next week", date: "1 week ago", icon: "📢" },
  ];

  // Performance by Subject
  const subjectPerformance = [
    { subject: "Mathematics", grade: "B+", progress: 85, teacher: "Mr. Khan" },
    { subject: "Science", grade: "A-", progress: 90, teacher: "Ms. Ali" },
    { subject: "English", grade: "A", progress: 95, teacher: "Mrs. Smith" },
    { subject: "Computer Science", grade: "A+", progress: 98, teacher: "Mr. Raza" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
            Welcome, <span className="text-brand-teal">Parent!</span>
          </h1>
          <p className="text-light-textSecondary dark:text-dark-textSecondary mt-1">
            Monitor your child's progress and school activities
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-4">
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal"
            >
              {children.map(child => (
                <option key={child.name} value={child.name}>
                  {child.name} ({child.grade})
                </option>
              ))}
            </select>
            <button className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors">
              Contact Teacher
            </button>
          </div>
        </div>
      </div>

      {/* Selected Child Info */}
      <div className="bg-gradient-to-r from-brand-teal/10 to-brand-aqua/10 dark:from-brand-teal/20 dark:to-brand-aqua/20 rounded-xl p-4 border border-brand-teal/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-brand-teal to-brand-navy text-white flex items-center justify-center text-xl font-bold">
              {selectedChild.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                {selectedChild}
              </h2>
              <p className="text-light-textSecondary dark:text-dark-textSecondary">
                Grade {children.find(c => c.name === selectedChild)?.grade} • 
                Student ID: {children.find(c => c.name === selectedChild)?.studentId}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Overall Performance</p>
            <p className="text-2xl font-bold text-brand-teal">A-</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {parentStats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 shadow border border-light-border dark:border-dark-border"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">{stat.title}</p>
                <p className="text-2xl font-bold mt-2 text-light-textPrimary dark:text-dark-textPrimary">
                  {stat.value}
                </p>
                <p className="text-sm text-green-500 mt-1">
                  <span className="mr-1">↑</span> {stat.change} this month
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Updates & Performance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Updates */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 shadow border border-light-border dark:border-dark-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                Recent Updates
              </h2>
              <button className="text-sm text-brand-teal hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {updates.map((update, idx) => (
                <div key={idx} className="p-4 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                  <div className="flex items-start">
                    <div className="text-2xl mr-4">{update.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
                          {update.type}
                        </h3>
                        <span className="text-xs text-light-textMuted dark:text-dark-textMuted">
                          {update.date}
                        </span>
                      </div>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">
                        {update.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Performance */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 shadow border border-light-border dark:border-dark-border">
            <h2 className="text-xl font-semibold mb-4 text-light-textPrimary dark:text-dark-textPrimary">
              Subject Performance
            </h2>
            <div className="space-y-4">
              {subjectPerformance.map((subject, idx) => (
                <div key={idx} className="p-4 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-brand-teal to-brand-navy text-white flex items-center justify-center font-bold mr-3">
                        {subject.subject.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
                          {subject.subject}
                        </h3>
                        <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                          {subject.teacher}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">
                        {subject.grade}
                      </div>
                      <div className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                        {subject.progress}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-brand-teal to-brand-aqua h-2 rounded-full"
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Schedule & Quick Actions */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 shadow border border-light-border dark:border-dark-border">
            <h2 className="text-xl font-semibold mb-4 text-light-textPrimary dark:text-dark-textPrimary">
              Today's Schedule
            </h2>
            <div className="space-y-3">
              {schedule.map((period, idx) => (
                <div key={idx} className="p-3 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium text-light-textPrimary dark:text-dark-textPrimary">{period.time}</span>
                    <span className={`text-sm ${
                      period.subject === "Break" ? 'text-gray-500' : 'text-brand-teal'
                    }`}>
                      {period.subject}
                    </span>
                  </div>
                  {period.teacher !== "-" && (
                    <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-1">
                      Teacher: {period.teacher}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-brand-navy to-brand-teal text-white rounded-xl p-4 shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaBell className="mr-2" /> Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-left">
                📧 Email Teacher
              </button>
              <button className="w-full p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-left">
                📊 View Report Card
              </button>
              <button className="w-full p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-left">
                📅 Schedule Meeting
              </button>
              <button className="w-full p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-left">
                💳 Pay School Fees
              </button>
            </div>
          </div>

          {/* Important Dates */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 shadow border border-light-border dark:border-dark-border">
            <h2 className="text-xl font-semibold mb-4 text-light-textPrimary dark:text-dark-textPrimary">
              Important Dates
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex justify-between">
                  <span className="font-medium text-red-800 dark:text-red-200">Parent-Teacher Meeting</span>
                  <span className="text-sm text-red-600 dark:text-red-300">Jan 20</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between">
                  <span className="font-medium text-blue-800 dark:text-blue-200">Science Fair</span>
                  <span className="text-sm text-blue-600 dark:text-blue-300">Jan 25</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex justify-between">
                  <span className="font-medium text-green-800 dark:text-green-200">Sports Day</span>
                  <span className="text-sm text-green-600 dark:text-green-300">Feb 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="pt-6 border-t border-light-border dark:border-dark-border text-center">
        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
          For emergencies, contact school office: +92 341 4152012
        </p>
      </div>
    </div>
  );
}

export default ParentDashboard;