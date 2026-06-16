import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../pages/sidebar/SideBar";
import Header from "../pages/header/Header";
import Footer from "../pages/footer/Footer";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const role = useSelector((state) => state.auth.user?.role);

  console.log("role in MainLayout:", role);



  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[16rem_1fr] bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-dark-border h-screen sticky top-0">
        <Sidebar isOpen={true} currentRole={role} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="relative w-64 bg-light-surface dark:bg-dark-surface shadow-lg transition-transform duration-300 transform translate-x-0">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-md text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-accentSoft dark:hover:bg-dark-accentSoft transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <Sidebar isOpen={true} currentRole={role} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-32 flex items-center px-6 bg-light-surface dark:bg-dark-surface sticky top-0 z-20">
          {/* Hamburger button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 rounded-md text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-accentSoft dark:hover:bg-dark-accentSoft transition-colors mr-4"
          >
            <FaBars />
          </button>

          <Header onToggle={() => setIsSidebarOpen(prev => !prev)}  />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto bg-light-background dark:bg-dark-surface">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="h-20 flex items-center justify-center text-sm bg-light-surface dark:bg-dark-surface border-t border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary ">
          <Footer />
        </footer>
      </div>
    </div>
  );
}

export default MainLayout;