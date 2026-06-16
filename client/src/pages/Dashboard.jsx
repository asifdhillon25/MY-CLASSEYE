import React from "react";

// Chart KPI Cards
import StudentsEnrolledCard from "../pages/components/StudentsEnrolledCard";
import CourseCompletionCard from "../pages/components/CourseCompletionCard";
import AttendanceCard from "../pages/components/AttendanceCard";
import AtRiskStudentsCard from "../pages/components/AtRiskStudentsCard";

// Stat Cards
import TotalStudentsCard from "../pages/components/TotalStudentsCard";
import StudentsLastMonthCard from "../pages/components/StudentsLastMonthCard";
import TotalTeachersCard from "../pages/components/TotalTeachersCard";
import AssignmentsSubmittedCard from "../pages/components/AssignmentsSubmittedCard";

function Dashboard() {
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
          Welcome to the University LMS Dashboard
        </h1>
        <p className="text-sm sm:text-base text-light-textSecondary dark:text-dark-textSecondary mt-1">
          Here’s a quick overview of student performance, attendance, and course progress.
        </p>
      </div>

      {/* Row 2: Stat / Mini Chart Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TotalStudentsCard />
        <StudentsLastMonthCard />
        <TotalTeachersCard />
        <AssignmentsSubmittedCard />
        
      </div>

      {/* Row 1: Chart KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StudentsEnrolledCard />
        <CourseCompletionCard />
        <AttendanceCard />
        <AtRiskStudentsCard />
      </div>

      

      {/* Optional future section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-4">
          Additional Insights
        </h2>
        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
          Here you could add upcoming assignments, top courses, or other analytics to make the dashboard more comprehensive.
        </p>
      </div>
    </div>
  );
}
{/* Back to Home Link */}
<div className="mt-8 pt-6 border-t border-light-border dark:border-dark-border text-center">
  <a 
    href="/" 
    className="inline-flex items-center gap-2 text-brand-teal hover:underline"
  >
    ← Back to Home
  </a>
</div>
export default Dashboard;
