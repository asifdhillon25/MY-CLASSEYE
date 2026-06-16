import React from "react";
import { FaChalkboardTeacher, FaArrowUp } from "react-icons/fa";

export default function TotalTeachersCard() {
  const growth = 2; // percent change
  return (
    <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-md p-6 flex flex-col justify-between transition-colors duration-300 hover:shadow-lg">
      <h3 className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-2">
        Total Faculty Members
      </h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaChalkboardTeacher size={28} className="text-light-primary dark:text-dark-primary" />
          <span className="text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
            75
          </span>
        </div>

        <div className="flex items-center space-x-1 text-green-500">
          <FaArrowUp />
          <span className="text-sm font-medium">{growth}%</span>
        </div>
      </div>
    </div>
  );
}
