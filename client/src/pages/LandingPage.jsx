import React from "react";
import { Link } from "react-router-dom";
import {
  FaUserFriends,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUserShield,
} from "react-icons/fa";

function LandingPage() {
  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-teal to-brand-navy flex items-center justify-center">
            <span className="text-white font-bold text-xl">CE</span>
          </div>
          <h1 className="ml-3 text-4xl font-bold text-brand-navy dark:text-dark-textPrimary">
            CLASSEYE
          </h1>
        </div>
        <h2 className="text-2xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
          Smart Class Monitoring System
        </h2>
        <p className="text-light-textSecondary dark:text-dark-textSecondary mt-2">
          Select your role to continue
        </p>
      </div>

      {/* User Type Selection Card */}
      <div className="bg-light-surface dark:bg-dark-surface rounded-2xl shadow-soft-lg p-8 max-w-5xl w-full border border-light-border dark:border-dark-border">
        <h3 className="text-2xl font-bold text-center mb-6 text-light-textPrimary dark:text-dark-textPrimary">
          Select User Type
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              id: "student",
              title: "Student",
              icon: <FaUserGraduate className="text-4xl" />,
              description:
                "View your grades, attendance, and behavior analytics",
              color: "from-brand-teal to-brand-aqua",
              link: "/app/student",
            },
            {
              id: "teacher",
              title: "Teacher",
              icon: <FaChalkboardTeacher className="text-4xl" />,
              description:
                "Manage classes, track attendance, and view insights",
              color: "from-brand-navy to-brand-teal",
              link: "/app/teacher",
            },
            {
              id: "parent",
              title: "Parent",
              icon: <FaUserFriends className="text-4xl" />,
              description: "Monitor your child's progress and behavior reports",
              color: "from-brand-aqua to-brand-navy",
              link: "/app/parent",
            },
            {
              id: "admin",
              title: "Admin",
              icon: <FaUserShield className="text-4xl" />,
              description:
                "System administration, user management, and analytics",
              color: "from-brand-teal to-brand-aqua",
              link: "/app/admin",
            },
          ].map((type) => (
            <Link key={type.id} to={type.link} className="group block">
              <div className="h-full p-6 rounded-xl border-2 border-light-border dark:border-dark-border hover:border-brand-teal transition-all hover:shadow-soft-lg group-hover:-translate-y-1">
                <div
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${type.color} text-white mb-4`}
                >
                  {type.icon}
                </div>
                <h4 className="text-xl font-bold mb-2 text-light-textPrimary dark:text-dark-textPrimary">
                  {type.title}
                </h4>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  {type.description}
                </p>
                <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border">
                  <div className="w-full py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg font-medium text-center">
                    Continue as {type.title}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-light-textMuted dark:text-dark-textMuted">
        <p>ClassEye Smart Class Monitoring System • Final Year Project</p>
        <p> Email: ClassEye@gmail.com</p>
      </div>
    </div>
  );
}

export default LandingPage;
