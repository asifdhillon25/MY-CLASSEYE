import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function UserDetail() {
  // Grab logged-in user from Redux store
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-light-textPrimary dark:text-dark-textPrimary">
        You are not logged in.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-light-background dark:bg-dark-background">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
          My Profile
        </h1>
        <Link
          to="/app/dashboard"
          className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 transition"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-xl shadow-md max-w-xl mx-auto flex flex-col gap-4">
        {/* Avatar / Initial */}
        <div className="w-24 h-24 rounded-full bg-brand-teal flex items-center justify-center text-white text-3xl font-bold">
          {user.name?.charAt(0).toUpperCase()}
        </div>

        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Status:</strong> {user.status ?? "Active"}
          </p>
          {user.phone && (
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
