import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Verify if token exists in LocalStorage
  const token = localStorage.getItem('token');

  // If there is no token, redirect to login
  if (!token) {
    // 'replace' avoid that usuario can return to a protected page pressing "back" button
    return <Navigate to="/" replace />;
  }

  // With token, render all content
  return <Outlet />;
};

export default ProtectedRoute;