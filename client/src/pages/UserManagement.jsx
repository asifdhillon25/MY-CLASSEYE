import React, { useState } from "react";
import { 
  FaUserPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
  FaSpinner,
  FaExclamationCircle,
  FaSync,
  FaCalendar,
  FaIdBadge
} from "react-icons/fa";
import { 
  useGetUsersQuery, 
  useDeleteUserMutation 
} from "../redux/features/users/userApi";

const UserManagement = () => {
  // Fetch users from API
  const { 
    data: response, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetUsersQuery();

  // Extract users from response - adjust based on your actual API response structure
  const users = response?.data?.users || response?.data || response || [];
  console.log("Fetched users:", users);

  // Delete user mutation
  const [deleteUser] = useDeleteUserMutation();

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchLower) || 
      user.email?.toLowerCase().includes(searchLower) ||
      user.name?.toLowerCase().includes(searchLower) ||
      user.rollNumber?.toLowerCase().includes(searchLower) ||
      user.teacherId?.toLowerCase().includes(searchLower) ||
      user.studentId?.toLowerCase().includes(searchLower);

    // Normalize role for comparison
    const userRole = user.role?.toLowerCase();
    const filterRoleLower = filterRole.toLowerCase();
    const matchesRole = filterRole === "all" || userRole === filterRoleLower;

    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Role icons mapping with proper fallbacks
  const roleIcons = {
    student: <FaUserGraduate className="text-blue-500" />,
    teacher: <FaChalkboardTeacher className="text-green-500" />,
    admin: <FaUserShield className="text-red-500" />,
    super_admin: <FaUserShield className="text-purple-500" />,
  };

  // Role colors mapping using your theme colors
  const roleColors = {
    student: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    teacher: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    admin: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    super_admin: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  };

  // Status colors mapping using your theme colors
  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  };

  // Get role display text
  const getRoleDisplay = (role) => {
    if (!role) return "Unknown";
    const roleMap = {
      student: "Student",
      teacher: "Teacher",
      admin: "Admin",
      super_admin: "Super Admin"
    };
    return roleMap[role.toLowerCase()] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Get user display name
  const getUserDisplayName = (user) => {
    return user.name || user.username || user.email || "Unnamed User";
  };

  // Get role-specific ID
  const getRoleId = (user) => {
    if (user.role?.toLowerCase() === 'student') {
      return user.studentId || user.rollNumber || 'N/A';
    } else if (user.role?.toLowerCase() === 'teacher') {
      return user.teacherId || 'N/A';
    }
    return user._id?.slice(-6) || 'N/A';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Handle delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        // You could add a toast notification here
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  // Handle refresh data
  const handleRefresh = () => {
    refetch();
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-light-background dark:bg-dark-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-96">
            <FaSpinner className="w-12 h-12 text-brand-teal animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-2">
              Loading Users...
            </h2>
            <p className="text-light-textSecondary dark:text-dark-textSecondary">
              Please wait while we fetch user data
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-light-background dark:bg-dark-background">
        <div className="max-w-7xl mx-auto">
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border p-8 text-center">
            <FaExclamationCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-2">
              Error Loading Users
            </h2>
            <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6">
              {error?.data?.message || "Failed to fetch user data"}
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors flex items-center gap-2 mx-auto"
            >
              <FaSync />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-light-background dark:bg-dark-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary mb-2">
                User Management
              </h1>
              <p className="text-light-textSecondary dark:text-dark-textSecondary">
                Manage all users in the system - students, teachers, and administrators
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors"
              >
                <FaSync className={isLoading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl border border-light-border dark:border-dark-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Total Users</p>
                <p className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary mt-1">
                  {users.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-brand-teal/10">
                <FaUserShield className="w-6 h-6 text-brand-teal" />
              </div>
            </div>
          </div>

          <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl border border-light-border dark:border-dark-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Active Users</p>
                <p className="text-2xl font-bold text-green-500 mt-1">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <FaUserGraduate className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl border border-light-border dark:border-dark-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Students</p>
                <p className="text-2xl font-bold text-blue-500 mt-1">
                  {users.filter(u => u.role?.toLowerCase() === 'student').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <FaUserGraduate className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl border border-light-border dark:border-dark-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Teachers</p>
                <p className="text-2xl font-bold text-green-500 mt-1">
                  {users.filter(u => u.role?.toLowerCase() === 'teacher').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <FaChalkboardTeacher className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 mb-6 shadow border border-light-border dark:border-dark-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-textMuted dark:text-dark-textMuted" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-light-textMuted dark:text-dark-textMuted hover:text-light-textPrimary dark:hover:text-dark-textPrimary rounded-full hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <FaFilter className="text-light-textSecondary dark:text-dark-textSecondary" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal min-w-[120px]"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="teacher">Teachers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg border border-light-border dark:border-dark-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
              <thead className="bg-light-surfaceMuted dark:bg-dark-surfaceMuted">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
                    User Information
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
                    Role & Status
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 md:px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 mb-4 text-light-textMuted dark:text-dark-textMuted">
                          <FaSearch className="w-full h-full opacity-50" />
                        </div>
                        <h3 className="text-lg font-medium text-light-textPrimary dark:text-dark-textPrimary mb-2">
                          No users found
                        </h3>
                        <p className="text-light-textSecondary dark:text-dark-textSecondary max-w-md">
                          {searchTerm || filterRole !== "all" || filterStatus !== "all" 
                            ? "Try adjusting your search or filters to find users" 
                            : "No users found in the system. Add your first user to get started."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const userRole = user.role?.toLowerCase();
                    const roleIcon = roleIcons[userRole] || <FaUserGraduate className="text-gray-400" />;
                    const roleColor = roleColors[userRole] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
                    const statusColor = statusColors[user.status] || "bg-gray-100 text-gray-800";

                    return (
                      <tr key={user._id || user.id} className="hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors">
                        {/* User Information */}
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-brand-teal/20 to-brand-navy/20 dark:from-brand-teal/10 dark:to-brand-navy/10 flex items-center justify-center">
                              {roleIcon}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                                {getUserDisplayName(user)}
                              </div>
                              <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                                {user.email || "No email"}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <FaIdBadge className="w-3 h-3 text-light-textMuted dark:text-dark-textMuted" />
                                <span className="text-xs text-light-textMuted dark:text-dark-textMuted">
                                  ID: {getRoleId(user)}
                                </span>
                                {user.department && (
                                  <span className="text-xs px-2 py-0.5 bg-light-accentSoft dark:bg-dark-accentSoft text-brand-teal rounded">
                                    {user.department}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role & Status */}
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${roleColor}`}>
                              {roleIcon}
                              <span className="ml-1.5">{getRoleDisplay(user.role)}</span>
                            </span>
                            <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${statusColor}`}>
                              {user.status || "unknown"}
                            </span>
                          </div>
                        </td>

                        {/* Join Date */}
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <FaCalendar className="text-light-textMuted dark:text-dark-textMuted" />
                            <span className="text-light-textPrimary dark:text-dark-textPrimary">
                              {formatDate(user.joinDate || user.join_date || user.createdAt)}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              className="p-2 rounded-lg text-brand-teal hover:bg-light-accentSoft dark:hover:bg-dark-accentSoft transition-colors"
                              title="Edit User"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDelete(user._id || user.id)}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={userRole === 'admin' || userRole === 'super_admin'}
                              title={userRole === 'admin' || userRole === 'super_admin' ? "Cannot delete admin users" : "Delete User"}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {filteredUsers.length > 0 && (
            <div className="px-4 md:px-6 py-3 border-t border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  Showing <span className="font-medium text-light-textPrimary dark:text-dark-textPrimary">{filteredUsers.length}</span> of{" "}
                  <span className="font-medium text-light-textPrimary dark:text-dark-textPrimary">{users.length}</span> users
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Students: {users.filter(u => u.role?.toLowerCase() === 'student').length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Teachers: {users.filter(u => u.role?.toLowerCase() === 'teacher').length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>Admins: {users.filter(u => ['admin', 'super_admin'].includes(u.role?.toLowerCase())).length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Info for Mobile */}
        <div className="mt-6 md:hidden">
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-4 border border-light-border dark:border-dark-border">
            <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary mb-3">
              Quick Actions
            </h3>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors">
                <FaUserPlus />
                <span>Add User</span>
              </button>
              <button 
                onClick={handleRefresh}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-light-border dark:border-dark-border rounded-lg text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors"
              >
                <FaSync />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;