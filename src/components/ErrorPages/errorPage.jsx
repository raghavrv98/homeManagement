import React from "react";

/**
 * Reusable Error Page Component
 * Props:
 * - code: number (401, 404, 500, 502)...
 * - message: string (custom message)
 * - onRetry: function (optional retry handler)
 */

const ErrorPage = ({ code = 401, message, onRetry }) => {
  const defaultMessages = {
    401: "Unauthorized access. Please login with valid credentials",
    404: "Page not found",
    500: "Internal server error. We're sorry problem is at our end..",
    502: "Bad gateway",
  };

  const finalMessage = message || defaultMessages[code] || "Unexpected error";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-slate-50">
      <h1 className="text-7xl font-extrabold text-slate-900 tracking-tight mb-2">
        {code}
      </h1>

      <p className="text-lg text-slate-500 max-w-md mb-6 leading-relaxed">
        {finalMessage}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorPage;
