import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const enrollmentData = [
  { week: "Week 1", students: 120 },
  { week: "Week 2", students: 135 },
  { week: "Week 3", students: 150 },
  { week: "Week 4", students: 140 },
];

export default function StudentsEnrolledCard() {
  return (
    <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-md p-6 transition-colors duration-250 hover:shadow-lg">
      <h3 className="text-lg font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-2">
        Students Enrolled
      </h3>
      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-4">
        Enrolled this month
      </p>
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={enrollmentData}>
            <CartesianGrid stroke="#E5E7EB" className="dark:stroke-dark-border" strokeDasharray="3 3" />
            <XAxis dataKey="week" stroke="#475569" className="dark:stroke-dark-textSecondary" />
            <YAxis stroke="#475569" className="dark:stroke-dark-textSecondary" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                color: "#0F172A",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="students" fill="#169BA0" radius={[8, 8, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
