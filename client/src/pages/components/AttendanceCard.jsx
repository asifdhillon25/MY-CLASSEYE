import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const attendanceData = [
  { day: "Mon", attendance: 90 },
  { day: "Tue", attendance: 92 },
  { day: "Wed", attendance: 88 },
  { day: "Thu", attendance: 95 },
  { day: "Fri", attendance: 91 },
];

export default function AttendanceCard() {
  return (
    <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-md p-6 transition-colors duration-250 hover:shadow-lg">
      <h3 className="text-lg font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-2">
        Weekly Attendance
      </h3>
      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-4">
        Average attendance per day
      </p>
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={attendanceData}>
            <CartesianGrid stroke="#E5E7EB" className="dark:stroke-dark-border" strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="#475569" className="dark:stroke-dark-textSecondary" />
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
            <Line type="monotone" dataKey="attendance" stroke="#0F3866" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
