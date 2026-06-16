import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const completionData = [
  { name: "Completed", value: 75 },
  { name: "In Progress", value: 25 },
];

const COLORS = ["#2FB8A0", "#E6F2F4"];

export default function CourseCompletionCard() {
  return (
    <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-md p-6 transition-colors duration-250 hover:shadow-lg">
      <h3 className="text-lg font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-2">
        Course Completion
      </h3>
      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-4">
        Overall student progress
      </p>
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={completionData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              paddingAngle={2}
            >
              {completionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                color: "#0F172A",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Legend verticalAlign="bottom" wrapperStyle={{ color: "#475569", fontFamily: "Inter, sans-serif" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
