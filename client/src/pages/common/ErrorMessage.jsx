const ErrorMessage = ({ error }) => {
  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background flex items-center justify-center p-4">
      <div className="max-w-md bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-red-500">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-2">
          Failed to load students
        </h3>
        <p className="text-light-textSecondary dark:text-dark-textSecondary mb-4">
          {error?.data?.message || 'An error occurred while fetching data'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;