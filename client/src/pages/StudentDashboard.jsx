import React, { useState } from "react";
import { 
  FaChartLine, 
  FaCalendarCheck, 
  FaUserGraduate, 
  FaBullseye,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock
} from "react-icons/fa";

function StudentDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  // Student Stats
  const studentStats = [
    {
      title: "Overall Grade",
      value: "A-",
      change: "+2%",
      icon: <FaUserGraduate className="text-2xl" />,
      color: "from-brand-teal to-brand-aqua",
    },
    {
      title: "Attendance",
      value: "96%",
      change: "+1%",
      icon: <FaCalendarCheck className="text-2xl" />,
      color: "from-brand-navy to-brand-teal",
    },
    {
      title: "Behavior Score",
      value: "88/100",
      change: "+5%",
      icon: <FaChartLine className="text-2xl" />,
      color: "from-brand-teal to-brand-navy",
    },
    {
      title: "Focus Level",
      value: "92%",
      change: "+3%",
      icon: <FaBullseye className="text-2xl" />,
      color: "from-brand-aqua to-brand-navy",
    },
  ];

  // Recent Behavior Analytics (from AI system)
  const behaviorAnalytics = [
    { 
      date: "Today", 
      class: "Physics", 
      behavior: "Highly Engaged", 
      score: 95,
      details: "Active participation, asking questions"
    },
    { 
      date: "Yesterday", 
      class: "Mathematics", 
      behavior: "Distracted", 
      score: 65,
      details: "Looking away frequently, low participation"
    },
    { 
      date: "Dec 29", 
      class: "Chemistry Lab", 
      behavior: "Focused", 
      score: 88,
      details: "Following instructions carefully"
    },
    { 
      date: "Dec 28", 
      class: "English", 
      behavior: "Sleepy", 
      score: 45,
      details: "Head on desk, low engagement"
    },
  ];

  // Upcoming Assignments
  const assignments = [
    { subject: "Physics", title: "Chapter 5 Problems", due: "Tomorrow", status: "pending" },
    { subject: "Mathematics", title: "Calculus Worksheet", due: "In 2 days", status: "in-progress" },
    { subject: "Chemistry", title: "Lab Report", due: "Next week", status: "completed" },
    { subject: "Computer Science", title: "Python Project", due: "Jan 15", status: "pending" },
  ];

  // AI Insights
  const aiInsights = [
    "You perform best in morning classes (9 AM - 11 AM)",
    "Physics is your strongest subject with 95% engagement",
    "Try to improve participation in Mathematics class",
    "Your focus drops after 2 PM - consider shorter study sessions",
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header with Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
            Welcome back, <span className="text-brand-teal">Ali Ahmed</span>!
          </h1>
          <p className="text-light-textSecondary dark:text-dark-textSecondary mt-1">
            Student ID: STU-001 • Grade 10-A
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex space-x-2 bg-light-surface dark:bg-dark-surface p-1 rounded-lg">
            {["day", "week", "month", "year"].map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTimeframe(time)}
                className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${
                  selectedTimeframe === time
                    ? "bg-brand-teal text-white"
                    : "text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {studentStats.map((stat, index) => (
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
                <p className="text-sm text-green-500 mt-1 flex items-center">
                  <span className="mr-1">↑</span> {stat.change} this {selectedTimeframe}
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
        {/* Left Column: Behavior Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Behavior Analytics Card */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 shadow border border-light-border dark:border-dark-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                Behavior Analytics
              </h2>
              <span className="text-xs px-3 py-1 bg-brand-teal/10 text-brand-teal rounded-full">
                AI-Powered Analysis
              </span>
            </div>
            <div className="space-y-4">
              {behaviorAnalytics.map((item, index) => (
                <div key={index} className="p-4 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          item.score >= 85 ? 'bg-green-500' :
                          item.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
                          {item.class} • {item.date}
                        </h3>
                      </div>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-2">
                        {item.details}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {item.behavior === "Highly Engaged" && <FaCheckCircle className="text-green-500 mr-2" />}
                          {item.behavior === "Distracted" && <FaExclamationTriangle className="text-yellow-500 mr-2" />}
                          {item.behavior === "Sleepy" && <FaClock className="text-red-500 mr-2" />}
                          <span className={`text-sm font-medium ${
                            item.behavior === "Highly Engaged" ? "text-green-600" :
                            item.behavior === "Distracted" ? "text-yellow-600" : "text-red-600"
                          }`}>
                            {item.behavior}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">
                            {item.score}/100
                          </div>
                          <div className="text-xs text-light-textMuted dark:text-dark-textMuted">
                            AI Score
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Assignments & Insights */}
        <div className="space-y-6">
          {/* Upcoming Assignments */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 shadow border border-light-border dark:border-dark-border">
            <h2 className="text-xl font-semibold mb-4 text-light-textPrimary dark:text-dark-textPrimary">
              Upcoming Assignments
            </h2>
            <div className="space-y-3">
              {assignments.map((assignment, index) => (
                <div key={index} className="p-3 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
                        {assignment.subject}
                      </h3>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">
                        {assignment.title}
                      </p>
                      <p className="text-xs text-light-textMuted dark:text-dark-textMuted mt-1">
                        Due: {assignment.due}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      assignment.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : assignment.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-brand-navy to-brand-teal text-white rounded-xl p-4 shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaChartLine className="mr-2" /> AI Insights
            </h2>
            <div className="space-y-3">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <p className="text-sm">• {insight}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs opacity-80">
              Based on classroom footage analysis and performance data
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Preview */}
      <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 shadow border border-light-border dark:border-dark-border">
        <h2 className="text-xl font-semibold mb-4 text-light-textPrimary dark:text-dark-textPrimary">
          Today's Schedule
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { time: "8:00 AM", subject: "Physics", room: "Room 101", teacher: "Mr. Khan" },
            { time: "10:00 AM", subject: "Mathematics", room: "Room 205", teacher: "Ms. Ali" },
            { time: "12:00 PM", subject: "Lunch", room: "Cafeteria", teacher: "-" },
            { time: "1:00 PM", subject: "Chemistry", room: "Lab 3", teacher: "Dr. Ahmed" },
            { time: "3:00 PM", subject: "Computer Science", room: "Lab 1", teacher: "Mr. Raza" },
          ].map((period, index) => (
            <div key={index} className="p-3 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg text-center">
              <p className="font-medium text-light-textPrimary dark:text-dark-textPrimary">{period.time}</p>
              <p className="text-lg font-bold text-brand-teal mt-1">{period.subject}</p>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">
                {period.room}
              </p>
              <p className="text-xs text-light-textMuted dark:text-dark-textMuted mt-1">
                {period.teacher}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;