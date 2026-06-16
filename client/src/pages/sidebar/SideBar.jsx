import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaHome,
  FaTachometerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCalendarCheck,
  FaChartBar,
  FaSearch,
  FaCog,
  FaSignInAlt,
  FaUsers,
  FaList,
  FaIdCard,
  FaUserFriends,
} from "react-icons/fa";

export default function Sidebar({ isOpen, onToggle, currentRole = "guest" }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-dark-border flex flex-col shadow-lg transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Header / Brand */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-light-border dark:border-dark-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-brand-teal to-brand-navy text-white flex items-center justify-center font-bold shadow">
            CE
          </div>
          <span className="text-base font-semibold text-light-textPrimary dark:text-dark-textPrimary">
            ClassEye
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-2 overflow-y-auto">
        {/* Dashboard links based on role */}
        {currentRole === "admin" && (
          <SidebarItem label="My Dashboard" to="/app/admin" icon={<FaHome />} />
        )}
        {currentRole === "student" && (
          <SidebarItem
            label="My Dashboard"
            to="/app/student"
            icon={<FaHome />}
          />
        )}
        {currentRole === "teacher" && (
          <SidebarItem
            label="My Dashboard"
            to="/app/teacher"
            icon={<FaHome />}
          />
        )}

        {/* Common Dashboard (for all roles) */}
        {/* <SidebarItem
          label="System Dashboard"
          to="/app/dashboard"
          icon={<FaTachometerAlt />}
        /> */}

        {/* Admin-only features */}
        {currentRole === "admin" && (
          <>
            <div className="px-4 py-2 text-xs font-semibold text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider">
              Admin Management
            </div>
            <SidebarItem
              label="Manage Users"
              to="/app/manage-users"
              icon={<FaUsers />}
            />
            <SidebarItem
              label="System Settings"
              to="/app/settings"
              icon={<FaCog />}
            />
            <SidebarItem
              label="All Teachers"
              to="/app/teachers"
              icon={<FaChalkboardTeacher />}
            />
           
            <SidebarItem
              label="Add Teacher"
              to="/app/addteacher"
              icon={<FaChalkboardTeacher />}
            />
          </>
        )}

        {/* Shared features (for admin and teacher) */}
        {(currentRole === "admin" || currentRole === "teacher") && (
          <>
            <div className="px-4 py-2 text-xs font-semibold text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider">
              Academic Management
            </div>
            <SidebarItem
              label="Add Student"
              to="/app/addstudent"
              icon={<FaUserGraduate />}
            />
            <SidebarItem
              label="Classes Management"
              to="/app/classes"
              icon={<FaChalkboardTeacher />}
            />
            <SidebarItem
              label="Add Class"
              to="/app/addclass"
              icon={<FaChalkboardTeacher />}
            />

            {/* Student Management Section */}
            <div className="px-4 py-2 text-xs font-semibold text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider">
              Student Management
            </div>
            <SidebarItem
              label="All Students"
              to="/app/students"
              icon={<FaList />}
            />
            <SidebarItem
              label="Search Students"
              to="/app/searchstudents"
              icon={<FaSearch />}
            />
          </>
        )}

        {/* Teacher-only features */}
        {currentRole === "teacher" && (
          <>
            <div className="px-4 py-2 text-xs font-semibold text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider">
              My Classes
            </div>
            <SidebarItem
              label="My Attendance"
              to="/app/attendance"
              icon={<FaCalendarCheck />}
            />
            <SidebarItem
              label="My Reports"
              to="/app/reports"
              icon={<FaChartBar />}
            />
          </>
        )}

        {/* Student-specific features */}
        {currentRole === "student" && (
          <>
            <div className="px-4 py-2 text-xs font-semibold text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider">
              My Academics
            </div>
            <SidebarItem
              label="My Profile"
              to="/app/students/profile"
              icon={<FaIdCard />}
            />
            <SidebarItem
              label="My Attendance"
              to="/app/attendance"
              icon={<FaCalendarCheck />}
            />
            <SidebarItem
              label="My Reports"
              to="/app/reports"
              icon={<FaChartBar />}
            />
          </>
        )}

        {/* Shared attendance feature */}
        {(currentRole === "admin" || currentRole === "teacher") && (
          <SidebarItem
            label="Attendance"
            to="/app/attendance"
            icon={<FaCalendarCheck />}
          />
        )}

        {/* Shared reports feature */}
        {(currentRole === "admin" || currentRole === "teacher" || currentRole === "student") && (
          <SidebarItem
            label="Reports"
            to="/app/reports"
            icon={<FaChartBar />}
          />
        )}
      </nav>

      {/* Footer / Settings */}
      <div className="px-3 py-4 border-t border-light-border dark:border-dark-border flex flex-col gap-2">
        {/* Show Settings only for Admin */}
        {currentRole === "admin" && (
          <SidebarItem label="Settings" to="/app/settings" icon={<FaCog />} />
        )}

        {/* Login Link - Goes back to landing page */}
        <SidebarLink label="Back to Home" to="/" icon={<FaSignInAlt />} />
      </div>
    </aside>
  );
}

function SidebarItem({ label, to, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200
        ${
          isActive
            ? "bg-light-accentSoft dark:bg-dark-accentSoft text-brand-teal dark:text-dark-primary font-semibold"
            : "text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted hover:text-light-textPrimary dark:hover:text-dark-textPrimary"
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

// SidebarLink uses react-router-dom's Link
function SidebarLink({ label, to, icon }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted hover:text-light-textPrimary dark:hover:text-dark-textPrimary transition-all duration-200"
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}