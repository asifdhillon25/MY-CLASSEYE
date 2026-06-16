import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetTeachersQuery } from "../redux/features/teachers/teacherApi";
import TeacherCard from "../pages/components/TeacherCard";
import LoadingSpinner from "../pages/common/LoadingSpinner";
import ErrorMessage from "../pages/common/ErrorMessage";
import { 
  FaSearch, 
  FaFilter, 
  FaSortAlphaDown, 
  FaSortAlphaUp,
  FaUserPlus,
  FaChalkboardTeacher,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import { MdClear } from "react-icons/md";

const TeacherList = () => {
  const { data, isLoading, isError, error } = useGetTeachersQuery();
  const teachers = data?.data?.teachers ?? [];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showInactive, setShowInactive] = useState(false);
  
  // Filter and sort teachers
  useEffect(() => {
    if (teachers && teachers.length > 0) {
      let filtered = teachers.filter((teacher) => {
        const matchesSearch = 
          teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.phone?.includes(searchTerm) ||
          teacher.teacher_id?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = showInactive ? true : teacher.status === "active";
        
        const matchesFilter = 
          activeFilter === "all" ? true :
          activeFilter === "department" && teacher.department ? true :
          activeFilter === "designation" && teacher.designation ? true : false;
        
        return matchesSearch && matchesStatus && matchesFilter;
      });

      // Sort teachers
      filtered.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.name?.localeCompare(b.name);
        } else {
          return b.name?.localeCompare(a.name);
        }
      });

      setFilteredTeachers(filtered);
    }
  }, [searchTerm, teachers, activeFilter, sortOrder, showInactive]);

  // Get unique departments for filter
  const departments = [...new Set(teachers.map(t => t.department).filter(Boolean))];
  const designations = [...new Set(teachers.map(t => t.designation).filter(Boolean))];
  
  const activeCount = teachers.filter(t => t.status === "active").length;
  const inactiveCount = teachers.filter(t => t.status === "inactive").length;

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-background/50 to-light-surface/30 dark:from-dark-background/50 dark:to-dark-surface/30 p-4 md:p-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-teal to-green-500 text-white shadow-lg">
                  <FaChalkboardTeacher className="text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                    Teacher Directory
                  </h1>
                  <p className="text-light-textSecondary dark:text-dark-textSecondary mt-1">
                    Manage and explore all teaching faculty
                  </p>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                      {activeCount} Active
                    </span>
                  </div>
                </div>
                <div className="px-4 py-2 bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                      {inactiveCount} Inactive
                    </span>
                  </div>
                </div>
                <div className="px-4 py-2 bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                      {departments.length} Departments
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
         <div className="flex items-center gap-3">
  <Link
    to="/app/addteacher"
    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-teal to-green-500 text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
  >
    <FaUserPlus className="text-lg" />
    <span className="font-semibold">Add Teacher</span>
  </Link>
</div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border shadow-lg p-5 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-light-textMuted dark:text-dark-textMuted" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, department, ID, phone, or designation..."
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all duration-300"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-light-textPrimary dark:hover:text-dark-textPrimary transition-colors"
                  >
                    <MdClear className="text-lg" />
                  </button>
                )}
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap gap-3">
                {/* Sort Button */}
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="flex items-center gap-2 px-4 py-3 bg-light-surfaceMuted dark:bg-dark-surfaceMuted border border-light-border dark:border-dark-border rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-colors group"
                >
                  {sortOrder === "asc" ? (
                    <FaSortAlphaDown className="text-light-textSecondary dark:text-dark-textSecondary group-hover:text-brand-teal" />
                  ) : (
                    <FaSortAlphaUp className="text-light-textSecondary dark:text-dark-textSecondary group-hover:text-brand-teal" />
                  )}
                  <span className="text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
                  </span>
                </button>

                {/* Show Inactive Toggle */}
                <button
                  onClick={() => setShowInactive(!showInactive)}
                  className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-all duration-300 ${showInactive 
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' 
                    : 'bg-light-surfaceMuted dark:bg-dark-surfaceMuted border-light-border dark:border-dark-border hover:bg-light-surface dark:hover:bg-dark-surface'
                  }`}
                >
                  {showInactive ? (
                    <FaEye className="text-amber-600 dark:text-amber-400" />
                  ) : (
                    <FaEyeSlash className="text-light-textSecondary dark:text-dark-textSecondary" />
                  )}
                  <span className={`text-sm font-medium ${showInactive 
                    ? 'text-amber-700 dark:text-amber-300' 
                    : 'text-light-textPrimary dark:text-dark-textPrimary'
                  }`}>
                    {showInactive ? "Showing All" : "Hide Inactive"}
                  </span>
                </button>

                {/* Filter Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-3 bg-light-surfaceMuted dark:bg-dark-surfaceMuted border border-light-border dark:border-dark-border rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                    <FaFilter className="text-light-textSecondary dark:text-dark-textSecondary group-hover:text-brand-teal" />
                    <span className="text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                      Filter
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="p-2">
                      <button
                        onClick={() => setActiveFilter("all")}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${activeFilter === "all" 
                          ? 'bg-brand-teal/10 text-brand-teal' 
                          : 'text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted'
                        }`}
                      >
                        All Teachers
                      </button>
                      {departments.slice(0, 5).map(dept => (
                        <button
                          key={dept}
                          onClick={() => setActiveFilter("department")}
                          className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors"
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || activeFilter !== "all" || showInactive) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-light-border dark:border-dark-border">
                <span className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  Active filters:
                </span>
                {searchTerm && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-blue-800 dark:hover:text-blue-200">
                      <MdClear />
                    </button>
                  </div>
                )}
                {activeFilter !== "all" && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm">
                    Filtered
                    <button onClick={() => setActiveFilter("all")} className="ml-1 hover:text-green-800 dark:hover:text-green-200">
                      <MdClear />
                    </button>
                  </div>
                )}
                {showInactive && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg text-sm">
                    Showing Inactive
                    <button onClick={() => setShowInactive(false)} className="ml-1 hover:text-amber-800 dark:hover:text-amber-200">
                      <MdClear />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
              Faculty Members
            </h2>
            <p className="text-light-textSecondary dark:text-dark-textSecondary">
              {filteredTeachers.length} teachers found
            </p>
          </div>
          <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
            Sorted by name ({sortOrder === "asc" ? "A → Z" : "Z → A"})
          </div>
        </div>

        {/* Teacher Grid */}
        {filteredTeachers.length === 0 ? (
          <div className="bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border shadow-sm p-12 text-center">
            <div className="w-32 h-32 mx-auto mb-6 text-light-textMuted dark:text-dark-textMuted opacity-50">
              <FaChalkboardTeacher className="w-full h-full" />
            </div>
            <h3 className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary mb-3">
              {searchTerm ? "No matching teachers found" : "No teachers available"}
            </h3>
            <p className="text-light-textSecondary dark:text-dark-textSecondary mb-8 max-w-md mx-auto">
              {searchTerm 
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "Start by adding teachers to build your faculty directory."
              }
            </p>
            {searchTerm ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("all");
                  setShowInactive(false);
                }}
                className="px-6 py-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors font-medium"
              >
                Clear all filters
              </button>
            ) : (
              <a
                href="/app/addteacher"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-teal to-green-500 text-white rounded-xl hover:opacity-90 transition-all duration-300 font-medium shadow-lg"
              >
                <FaUserPlus />
                Add First Teacher
              </a>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher) => (
                <TeacherCard key={teacher._id} teacher={teacher} />
              ))}
            </div>

            {/* Pagination/Info Footer */}
            <div className="mt-8 pt-8 border-t border-light-border dark:border-dark-border">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  Displaying <span className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">{filteredTeachers.length}</span> of{" "}
                  <span className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">{teachers.length}</span> total teachers
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="flex items-center gap-2 px-4 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors text-sm font-medium"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 11l7-7 7 7M5 19l7-7 7 7"
                      />
                    </svg>
                    Back to top
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherList;