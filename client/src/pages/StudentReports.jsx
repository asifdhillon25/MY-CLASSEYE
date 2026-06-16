import React, { useState } from "react";
import { FaChartLine, FaCheckCircle, FaUserGraduate, FaExclamationCircle } from "react-icons/fa";

const dummyReports = [
  {
    student_id: "S001",
    name: "Ali Khan",
    attendance: 95,
    grades: "A",
    behavior: "Excellent",
  },
  {
    student_id: "S002",
    name: "Sara Ahmed",
    attendance: 88,
    grades: "B+",
    behavior: "Good",
  },
  {
    student_id: "S003",
    name: "Ahmed Raza",
    attendance: 70,
    grades: "C",
    behavior: "Needs Improvement",
  },
];

function StudentReports() {
  const [students] = useState(dummyReports);

  return (
    <div className="min-h-screen p-6 bg-light-background dark:bg-dark-background">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-light-textPrimary dark:text-dark-textPrimary">
          Student Reports
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="flex items-center p-4 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow hover:shadow-md transition">
            <FaCheckCircle className="text-light-success dark:text-dark-success text-3xl mr-4" />
            <div>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Total Students</p>
              <p className="text-lg font-semibold text-light-textPrimary dark:text-dark-textPrimary">{students.length}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow hover:shadow-md transition">
            <FaChartLine className="text-light-accent dark:text-dark-accent text-3xl mr-4" />
            <div>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Average Attendance</p>
              <p className="text-lg font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                {Math.round(students.reduce((a, b) => a + b.attendance, 0) / students.length)}%
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow hover:shadow-md transition">
            <FaUserGraduate className="text-light-primary dark:text-dark-primary text-3xl mr-4" />
            <div>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Top Grade</p>
              <p className="text-lg font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                {students.map(s => s.grades).sort().reverse()[0]}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow hover:shadow-md transition">
            <FaExclamationCircle className="text-light-warning dark:text-dark-warning text-3xl mr-4" />
            <div>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Needs Attention</p>
              <p className="text-lg font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                {students.filter(s => s.attendance < 75 || s.behavior === "Needs Improvement").length}
              </p>
            </div>
          </div>
        </div>

        {/* Students Table / Cards */}
        <div className="space-y-4">
          {students.map((s) => (
            <div
              key={s.student_id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <div className="mb-2 sm:mb-0">
                <p className="text-lg font-semibold text-light-textPrimary dark:text-dark-textPrimary">{s.name} ({s.student_id})</p>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  Grade: <span className="font-medium">{s.grades}</span> | Attendance: <span className="font-medium">{s.attendance}%</span>
                </p>
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  s.behavior === "Excellent" ? "text-light-success dark:text-dark-success" :
                  s.behavior === "Good" ? "text-light-primary dark:text-dark-primary" :
                  "text-light-warning dark:text-dark-warning"
                }`}>
                  {s.behavior}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default StudentReports;
