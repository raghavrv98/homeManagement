import React from "react";

const PageLoader = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-medium text-sm">
        Loading, please wait...
      </p>
    </div>
  );
};

export default PageLoader;
