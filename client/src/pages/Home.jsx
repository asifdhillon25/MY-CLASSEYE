import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      
      {/* Hero Section - Simple */}
      <div className="py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-light-textPrimary dark:text-dark-textPrimary">
          Welcome to <span className="text-brand-teal">ClassEye</span>
        </h1>
        <p className="text-xl text-light-textSecondary dark:text-dark-textSecondary mb-8 max-w-2xl mx-auto">
          School Management System for efficient administration and classroom operations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-brand-navy text-brand-navy dark:border-dark-accent dark:text-dark-textPrimary rounded-lg hover:bg-light-accentSoft dark:hover:bg-dark-accentSoft transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Simple Features */}
      <div className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-light-textPrimary dark:text-dark-textPrimary">
          Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Student Management", link: "/addstudent" },
            { title: "Attendance Tracking", link: "/attendance" },
            { title: "Class Management", link: "/addclass" },
            { title: "Reports & Analytics", link: "/reports" }
          ].map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="bg-light-surface dark:bg-dark-surface p-6 rounded-lg shadow border border-light-border dark:border-dark-border hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2 text-light-textPrimary dark:text-dark-textPrimary">
                {feature.title}
              </h3>
              <p className="text-light-textSecondary dark:text-dark-textSecondary">
                Click to manage {feature.title.toLowerCase()}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="py-8 px-4 border-t border-light-border dark:border-dark-border mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-brand-navy dark:text-dark-textPrimary mb-2">
            ClassEye
          </h3>
          <p className="text-light-textSecondary dark:text-dark-textSecondary">
            © {new Date().getFullYear()} ClassEye. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;