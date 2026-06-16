import React from "react";
import { FaClipboardList } from "react-icons/fa";
import { BarChart, Bar, ResponsiveContainer } from "recharts";

const assignmentsData = [
  { day: "Mon", count: 10 },
  { day: "Tue", count: 12 },
  { day: "Wed", count: 8 },
  { day: "Thu", count: 15 },
  { day: "Fri", count: 11 },
];

export default function AssignmentsSubmittedCard() {
  return (
    <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-md p-6 flex flex-col justify-between transition-colors duration-300 hover:shadow-lg">
      <h3 className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-2">
        Assignments Submitted
      </h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaClipboardList size={28} className="text-light-primary dark:text-dark-primary" />
          <span className="text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
            56
          </span>
        </div>

        {/* Mini bar chart */}
        <div className="w-24 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assignmentsData}>
              <Bar dataKey="count" fill="#0F3866" radius={[4, 4, 0, 0]} barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
