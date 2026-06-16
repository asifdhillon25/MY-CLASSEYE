import React from "react";

const TeacherCard = ({ teacher }) => {
  return (
    <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow p-5 border border-light-border dark:border-dark-border">
      <h3 className="text-lg font-semibold text-light-textPrimary dark:text-dark-textPrimary">
        {teacher.name}
      </h3>

      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
        {teacher.designation}
      </p>

      <div className="mt-3 space-y-1 text-sm">
        <p>
          <span className="font-medium">Teacher ID:</span>{" "}
          <span className="text-brand-teal">{teacher.teacher_id}</span>
        </p>

        <p>
          <span className="font-medium">Department:</span> {teacher.department}
        </p>

        <p>
          <span className="font-medium">Phone:</span> {teacher.phone}
        </p>
      </div>
    </div>
  );
};

export default TeacherCard;
