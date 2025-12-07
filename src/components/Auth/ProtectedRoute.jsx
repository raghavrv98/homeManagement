import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("loginStatus");

  if (!isLoggedIn) {
    return <Navigate to="/error" replace />;
  }

  return children;
};

export default ProtectedRoute;
