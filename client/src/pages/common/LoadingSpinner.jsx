const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-light-border dark:border-dark-border border-t-brand-teal rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-light-textSecondary dark:text-dark-textSecondary">Loading students...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;