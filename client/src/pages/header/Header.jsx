import React, { useContext } from "react";
import ThemeContext from "../../theme/ThemeContext";
import logo from "../../assets/SVG/Asset 1.svg";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import useLogoutHandler from "../components/useLogoutHandler";

function Header({ onToggleSidebar }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="flex justify-between w-full items-center px-6 py-4 m-4 mb-0 rounded-lg shadow-md bg-light-surface dark:bg-dark-surface text-light-textPrimary dark:text-dark-textPrimary transition-colors duration-300">
      {/* Left Side: Sidebar Toggle & Logo */}
      <div className="flex items-center">
        {/* Sidebar Toggle (Mobile) */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-md text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-accentSoft dark:hover:bg-dark-accentSoft transition-colors mr-4"
          >
            <FaBars />
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-10" />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Logout Button */}
        <button 
          onClick={useLogoutHandler()}
          className="flex items-center gap-2 px-4 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors text-sm"
          title="Logout"
        >
          <FaSignOutAlt className="text-light-textSecondary dark:text-dark-textSecondary" />
          <span className="hidden md:inline text-light-textPrimary dark:text-dark-textPrimary">Logout</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-light-accent dark:border-dark-accent bg-light-background dark:bg-dark-background hover:opacity-90 transition"
          aria-label="Toggle Theme"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <span className="text-lg font-semibold">🌙</span>
          ) : (
            <span className="text-lg font-semibold">☀️</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default Header;