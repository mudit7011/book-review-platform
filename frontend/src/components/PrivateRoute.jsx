// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const PrivateRoute = () => {
  const { isAuthenticated, authLoading } = useAuth(); // Get isAuthenticated and authLoading

  if (authLoading) {
    // Show a loading indicator while authentication status is being determined
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-700">Loading authentication...</p>
        {/* You can replace this with a spinner or a more elaborate loading screen */}
      </div>
    );
  }

  // Once loading is complete, check authentication status
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;