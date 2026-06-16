import React, { useState } from "react";
import { 
  FaChalkboardTeacher, 
  FaUserGraduate, 
  FaCalendarCheck, 
  FaChartLine,
  FaBook,
  FaClipboardList,
  FaBell,
  FaUsers
} from "react-icons/fa";

function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState("CS101");

  // Teacher Stats
  const teacherStats = [
    {
      title: "Total Students",
      value: "45",
      change: "+3",
      icon: <FaUserGraduate className="text-2xl" />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Classes Teaching",
      value: "3",
      change: "+0",
      icon: <FaChalkboardTeacher className="text-2xl" />,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Avg. Attendance",
      value: "92%",
      change: "+2%",
      icon: <FaCalendarCheck className="text-2xl" />,
      color: "from-brand-teal to-brand-aqua",
    },
    {
      title: "Assignments Graded",
      value: "85%",
      change: "+10%",
      icon: <FaClipboardList className="text-2xl" />,
      color: "from-purple-500 to-pink-500",
    },
  ];

  // Classes
  const classes = [
    { id: "CS101", name: "Introduction to CS", students: 25, time: "Mon 9-10 AM", room: "Room 101" },
    { id: "CS201", name: "Data Structures", students: 20, time: "Tue 11-12 PM", room: "Room 205" },
    { id: "CS301", name: "Algorithms", students: 15, time: "Wed 2-4 PM", room: "Lab 3" },
  ];

  // Upcoming Tasks
  const tasks = [
    { task: "Grade CS101 Midterm", due: "Tomorrow", priority: "high" },
    { task: "Prepare DS Lecture", due: "In 2 days", priority: "medium" },
    { task: "Update Attendance", due: "Today", priority: "high" },
    { task: "Meet Parent - Ali", due: "Friday", priority: "low" },
  ];

  // Student Performance
  const studentPerformance = [
    { name: "Ali Khan", grade: "A", attendance: "95%", assignments: "9/10" },
    { name: "Sara Ahmed", grade: "B+", attendance: "88%", assignments: "8/10" },
    { name: "Ahmed Raza", grade: "A-", attendance: "92%", assignments: "10/10" },
    { name: "Fatima Noor", grade: "C+", attendance: "75%", assignments: "6/10" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
            Welcome, <span className="text-brand-teal">Mr. Raza!</span>
          </h1>
          <p className="text-light-textSecondary dark:text-dark-textSecondary mt-1">
            Computer Science Department • Teacher ID: TCH-001
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-4">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal"
            >
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
            <button className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors">
              Today's Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teacherStats.map((stat, index) => (
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
        {/* Left Column: Classes & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Classes */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 shadow border border-light-border dark:border-dark-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                My Classes
              </h2>
              <button className="text-sm text-brand-teal hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {classes.map(cls => (
                <div key={cls.id} className="p-4 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg hover:bg-light-accentSoft dark:hover:bg-dark-accentSoft transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-light-textPrimary dark:text-dark-textPrimary">{cls.id}</h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                      {cls.students} students
                    </span>
                  </div>
                  <p className="text-sm text-light-textPrimary dark:text-dark-textPrimary mb-2">{cls.name}</p>
                  <div className="text-xs text-light-textSecondary dark:text-dark-textSecondary space-y-1">
                    <p>⏰ {cls.time}</p>
                    <p>📍 {cls.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Performance */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 shadow border border-light-border dark:border-dark-border">
            <h2 className="text-xl font-semibold mb-4 text-light-textPrimary dark:text-dark-textPrimary">
              Student Performance - {selectedClass}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">Student</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">Grade</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">Attendance</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">Assignments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border">
                  {studentPerformance.map((student, idx) => (
                    <tr key={idx} className="hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted">
                      <td className="px-4 py-3 text-sm text-light-textPrimary dark:text-dark-textPrimary">{student.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.grade === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          student.grade.includes('B') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {student.grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-light-textPrimary dark:text-dark-textPrimary">{student.attendance}</td>
                      <td className="px-4 py-3 text-sm text-light-textPrimary dark:text-dark-textPrimary">{student.assignments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Tasks & Quick Actions */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 shadow border border-light-border dark:border-dark-border">
            <h2 className="text-xl font-semibold mb-4 text-light-textPrimary dark:text-dark-textPrimary">
              Upcoming Tasks
            </h2>
            <div className="space-y-3">
              {tasks.map((task, idx) => (
                <div key={idx} className="p-3 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary">{task.task}</h3>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">
                        Due: {task.due}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
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
                📝 Take Attendance for Today
              </button>
              <button className="w-full p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-left">
                📤 Upload Assignment
              </button>
              <button className="w-full p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-left">
                📊 Generate Class Report
              </button>
              <button className="w-full p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-left">
                👥 Schedule Parent Meeting
              </button>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 shadow border border-light-border dark:border-dark-border">
            <h2 className="text-xl font-semibold mb-4 text-light-textPrimary dark:text-dark-textPrimary">
              Today's Schedule
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium text-light-textPrimary dark:text-dark-textPrimary">CS101</span>
                  <span className="text-sm text-brand-teal">9:00 AM</span>
                </div>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">Room 101</p>
              </div>
              <div className="p-3 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium text-light-textPrimary dark:text-dark-textPrimary">CS201</span>
                  <span className="text-sm text-brand-teal">11:00 AM</span>
                </div>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">Room 205</p>
              </div>
              <div className="p-3 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium text-light-textPrimary dark:text-dark-textParent">Faculty Meeting</span>
                  <span className="text-sm text-brand-teal">2:00 PM</span>
                </div>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">Conference Room</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="pt-6 border-t border-light-border dark:border-dark-border text-center">
        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
          Need help? Contact admin@classeye.edu
        </p>
      </div>
    </div>
  );
}

export default TeacherDashboard;