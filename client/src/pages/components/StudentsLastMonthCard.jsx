import React from "react";
import { FaChartLine } from "react-icons/fa";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const lastMonthData = [
  { day: "1", count: 20 },
  { day: "8", count: 35 },
  { day: "15", count: 40 },
  { day: "22", count: 45 },
  { day: "28", count: 50 },
];

export default function StudentsLastMonthCard() {
  return (
    <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-md p-6 flex flex-col justify-between transition-colors duration-300 hover:shadow-lg">
      <h3 className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-2">
        Students Enrolled Last Month
      </h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaChartLine size={28} className="text-light-primary dark:text-dark-primary" />
          <span className="text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
            190
          </span>
        </div>

        {/* Mini trend */}
        <div className="w-24 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lastMonthData}>
              <Line type="monotone" dataKey="count" stroke="#169BA0" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
