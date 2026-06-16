import React from 'react';
import { Link } from 'react-router-dom';

const StudentCard = ({ student }) => {
  return (
    <Link 
      to={`${student._id}`}
      className="block group"
    >
      <div className="bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border p-6 hover:shadow-lg transition-all duration-300 hover:border-brand-teal/50 dark:hover:border-brand-teal/30 group-hover:translate-y-[-2px]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-teal to-brand-navy flex items-center justify-center text-white font-semibold text-xl">
              {student.name?.charAt(0) || 'S'}
            </div>
            
            {/* Info */}
            <div>
              <h3 className="text-lg font-semibold text-light-textPrimary dark:text-dark-textPrimary group-hover:text-brand-teal transition-colors">
                {student.name}
              </h3>
              <p className="text-light-textSecondary dark:text-dark-textSecondary mt-1">
                {student.department}
              </p>
              <div className="flex items-center gap-3 mt-2">
                
                <span className="text-sm text-light-textMuted dark:text-dark-textMuted">
                  {student.year ? `Year ${student.year}` : 'Year N/A'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Arrow */}
          <div className="text-light-textMuted dark:text-dark-textMuted group-hover:text-brand-teal transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-light-border dark:border-dark-border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Student ID</p>
              <p className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
                {student.roll_no|| 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Email</p>
              <p className="font-medium text-light-textPrimary dark:text-dark-textPrimary truncate">
                {student.email || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StudentCard;