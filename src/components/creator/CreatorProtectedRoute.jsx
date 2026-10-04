import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCreator } from "../../context/CreatorContext";

export const CreatorProtectedRoute = ({ children }) => {
  const { isCreatorAuthenticated } = useCreator();
  const location = useLocation();

  if (!isCreatorAuthenticated) {
    return <Navigate to="/creator/login" state={{ from: location }} replace />;
  }

  return children;
};
