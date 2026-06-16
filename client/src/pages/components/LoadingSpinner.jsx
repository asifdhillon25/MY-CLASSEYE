import React from "react";

const LoadingSpinner = ({ 
  size = "md", 
  color = "brand-teal", 
  text = "Loading...",
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} border-4 border-light-border dark:border-dark-border rounded-full`}></div>
        
        {/* Spinning ring */}
        <div className={`absolute top-0 left-0 ${sizeClasses[size]} border-4 border-t-4 border-${color} rounded-full animate-spin`}></div>
        
        {/* Optional: Inner dot */}
        {size === "lg" || size === "xl" ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-brand-teal rounded-full"></div>
        ) : null}
      </div>
      
      {text && (
        <p className={`font-medium text-light-textSecondary dark:text-dark-textSecondary ${textSizeClasses[size]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-light-background/80 dark:bg-dark-background/80 backdrop-blur-sm">
        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-8 shadow-elevated border border-light-border dark:border-dark-border">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

// Variants for different use cases
export const PageLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading page..." />
  </div>
);

export const CardLoadingSpinner = () => (
  <div className="p-8 text-center">
    <LoadingSpinner size="md" text="Loading data..." />
  </div>
);

export const ButtonLoadingSpinner = ({ text = "Processing..." }) => (
  <div className="flex items-center justify-center gap-2">
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    <span className="text-sm">{text}</span>
  </div>
);

export const InlineLoadingSpinner = () => (
  <div className="inline-flex items-center gap-2">
    <div className="w-3 h-3 border-2 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
    <span className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Loading</span>
  </div>
);

export default LoadingSpinner; 