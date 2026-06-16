import React from "react";
import { FaUserGraduate, FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function TotalStudentsCard() {
  const growth = 5; // percent change
  const isUp = true; // increase or decrease

  return (
    <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-md p-6 flex flex-col justify-between transition-colors duration-300 hover:shadow-lg">
      {/* Title */}
      <h3 className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-2">
        Total Students
      </h3>

      {/* Main Number */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaUserGraduate size={28} className="text-light-primary dark:text-dark-primary" />
          <span className="text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
            1,245
          </span>
        </div>

        {/* Growth */}
        <div className={`flex items-center space-x-1 ${isUp ? "text-green-500" : "text-red-500"}`}>
          {isUp ? <FaArrowUp /> : <FaArrowDown />}
          <span className="text-sm font-medium">{growth}%</span>
        </div>
      </div>
    </div>
  );
}
