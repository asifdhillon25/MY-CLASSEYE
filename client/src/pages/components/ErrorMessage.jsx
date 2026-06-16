import React from "react";
import { 
  FaExclamationCircle, 
  FaTimes, 
  FaRedo, 
  FaInfoCircle,
  FaExclamationTriangle 
} from "react-icons/fa";

const ErrorMessage = ({ 
  error, 
  onRetry, 
  onDismiss, 
  title = "Error",
  variant = "error", // error, warning, info
  showDetails = false,
  className = ""
}) => {
  // Extract error message from different error formats
  const getErrorMessage = () => {
    if (!error) return "An unknown error occurred";
    
    if (typeof error === "string") return error;
    
    if (error.message) return error.message;
    
    if (error.data?.message) return error.data.message;
    
    if (error.status) {
      switch (error.status) {
        case 400: return "Bad Request - Please check your input";
        case 401: return "Unauthorized - Please login again";
        case 403: return "Forbidden - You don't have permission";
        case 404: return "Not Found - Resource not available";
        case 500: return "Internal Server Error - Please try again later";
        case 502: return "Bad Gateway - Server is unavailable";
        case 503: return "Service Unavailable - Please try again later";
        case 504: return "Gateway Timeout - Request took too long";
        default: return `Error ${error.status} - Something went wrong`;
      }
    }
    
    return "An unexpected error occurred";
  };

  // Get error details for debugging
  const getErrorDetails = () => {
    if (!error || typeof error === 'string') return null;
    
    const details = {};
    
    if (error.data) {
      if (error.data.details) details.details = error.data.details;
      if (error.data.error) details.error = error.data.error;
      if (error.data.stack) details.stack = error.data.stack;
    }
    
    if (error.stack) details.stack = error.stack;
    
    return Object.keys(details).length > 0 ? details : null;
  };

  const errorDetails = getErrorDetails();
  const errorMessage = getErrorMessage();

  // Variant styling
  const variantConfig = {
    error: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-300",
      icon: FaExclamationCircle,
      iconColor: "text-red-500",
      title: "Error"
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-800 dark:text-yellow-300",
      icon: FaExclamationTriangle,
      iconColor: "text-yellow-500",
      title: "Warning"
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-300",
      icon: FaInfoCircle,
      iconColor: "text-blue-500",
      title: "Information"
    }
  };

  const config = variantConfig[variant] || variantConfig.error;
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 text-light-textPrimary dark:text-dark-textPrimary">
                {title || config.title}
              </h3>
              <p className={`${config.text} text-sm leading-relaxed`}>
                {errorMessage}
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-start">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  title="Retry"
                >
                  <FaRedo className="w-4 h-4 text-light-textSecondary dark:text-dark-textSecondary" />
                </button>
              )}
              
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  title="Dismiss"
                >
                  <FaTimes className="w-4 h-4 text-light-textSecondary dark:text-dark-textSecondary" />
                </button>
              )}
            </div>
          </div>

          {/* Error Details (for debugging) */}
          {showDetails && errorDetails && (
            <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border">
              <details className="cursor-pointer">
                <summary className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary">
                  Technical Details
                </summary>
                <div className="mt-2 p-3 bg-black/5 dark:bg-white/5 rounded-lg overflow-x-auto">
                  <pre className="text-xs text-light-textSecondary dark:text-dark-textSecondary whitespace-pre-wrap">
                    {JSON.stringify(errorDetails, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          )}

          {/* Actions */}
          {(onRetry || onDismiss) && !showDetails && (
            <div className="mt-4 flex flex-wrap gap-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-3 py-1.5 bg-brand-teal text-white text-sm rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors flex items-center gap-2"
                >
                  <FaRedo className="w-3 h-3" />
                  Try Again
                </button>
              )}
              
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="px-3 py-1.5 border border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary text-sm rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Pre-configured variants
export const NetworkError = ({ error, onRetry, onDismiss }) => (
  <ErrorMessage
    error={error}
    onRetry={onRetry}
    onDismiss={onDismiss}
    title="Network Error"
    variant="error"
    showDetails={process.env.NODE_ENV === 'development'}
  />
);

export const NotFoundError = ({ resource = "Resource", onRetry, onDismiss }) => (
  <ErrorMessage
    error={`${resource} not found`}
    onRetry={onRetry}
    onDismiss={onDismiss}
    title="Not Found"
    variant="info"
  />
);

export const PermissionError = ({ onRetry, onDismiss }) => (
  <ErrorMessage
    error="You don't have permission to access this resource"
    onRetry={onRetry}
    onDismiss={onDismiss}
    title="Access Denied"
    variant="warning"
  />
);

export const ServerError = ({ error, onRetry, onDismiss }) => (
  <ErrorMessage
    error={error}
    onRetry={onRetry}
    onDismiss={onDismiss}
    title="Server Error"
    variant="error"
    showDetails={process.env.NODE_ENV === 'development'}
  />
);

export const ValidationError = ({ errors = [], onDismiss }) => (
  <ErrorMessage
    error={errors.length > 0 ? errors.join(', ') : "Validation failed"}
    onDismiss={onDismiss}
    title="Validation Error"
    variant="warning"
  />
);

// Empty state component (often used with errors)
export const EmptyState = ({ 
  icon: Icon = FaInfoCircle,
  title = "No Data",
  message = "There's nothing to display here yet.",
  action,
  className = ""
}) => (
  <div className={`text-center py-12 px-4 ${className}`}>
    <div className="w-16 h-16 mx-auto mb-4 text-light-textMuted dark:text-dark-textMuted">
      <Icon className="w-full h-full" />
    </div>
    <h3 className="text-lg font-medium text-light-textPrimary dark:text-dark-textPrimary mb-2">
      {title}
    </h3>
    <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6 max-w-md mx-auto">
      {message}
    </p>
    {action && (
      <div className="mt-4">
        {action}
      </div>
    )}
  </div>
);

export default ErrorMessage;