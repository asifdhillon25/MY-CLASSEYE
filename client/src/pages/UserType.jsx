import React from "react";
import { Link } from "react-router-dom";
import { FaUserFriends, FaChalkboardTeacher, FaUserGraduate, FaUserShield } from "react-icons/fa";

function UserType() {
  const userTypes = [
    {
      id: "student",
      title: "Student",
      icon: <FaUserGraduate className="text-4xl" />,
      description: "View your grades, attendance, and behavior analytics",
      color: "from-brand-teal to-brand-aqua",
      link: "/login/student"
    },
    {
      id: "teacher",
      title: "Teacher",
      icon: <FaChalkboardTeacher className="text-4xl" />,
      description: "Manage classes, track attendance, and view insights",
      color: "from-brand-navy to-brand-teal",
      link: "/login/teacher"
    },
    {
      id: "parent",
      title: "Parent",
      icon: <FaUserFriends className="text-4xl" />,
      description: "Monitor your child's progress and behavior reports",
      color: "from-brand-aqua to-brand-navy",
      link: "/login/parent"
    },
    {
      id: "admin",
      title: "Admin",
      icon: <FaUserShield className="text-4xl" />,
      description: "System administration and user management",
      color: "from-purple-600 to-indigo-600",
      link: "/login/admin"
    }
  ];

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
          Welcome to ClassEye Portal
        </h2>
        <p className="text-light-textSecondary dark:text-dark-textSecondary mt-2">
          Select your user type to continue
        </p>
      </div>

      {/* User Type Selection Card */}
      <div className="bg-light-surface dark:bg-dark-surface rounded-2xl shadow-soft-lg p-8 max-w-5xl w-full border border-light-border dark:border-dark-border">
        <h3 className="text-2xl font-bold text-center mb-6 text-light-textPrimary dark:text-dark-textPrimary">
          Select User Type
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userTypes.map((type) => (
            <Link
              key={type.id}
              to={type.link}
              className="group block"
            >
              <div className="h-full p-6 rounded-xl border-2 border-light-border dark:border-dark-border hover:border-brand-teal transition-all hover:shadow-soft-lg group-hover:-translate-y-1">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${type.color} text-white mb-4`}>
                  {type.icon}
                </div>
                <h4 className="text-xl font-bold mb-2 text-light-textPrimary dark:text-dark-textPrimary">
                  {type.title}
                </h4>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  {type.description}
                </p>
                <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border">
                  <button className="w-full py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg font-medium hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors">
                    Select as {type.title}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Back to Home */}
        <div className="text-center pt-6 border-t border-light-border dark:border-dark-border">
          <Link 
            to="/" 
            className="text-light-textSecondary dark:text-dark-textSecondary hover:text-brand-teal transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-light-textMuted dark:text-dark-textMuted">
        <p>ClassEye Smart Class Monitoring System • Final Year Project</p>
      </div>
    </div>
  );
}

export default UserType;