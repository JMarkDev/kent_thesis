// In ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles }) => {
  // Check if the user is logged in (you can use a token check)
  const isLoggedIn = localStorage.getItem('token') !== null;

  // Get the user's role from local storage
  const userRole = localStorage.getItem('role');

  // Check if the user's role is allowed for this route
  const isRoleAllowed = allowedRoles.includes(userRole);

  if (!isLoggedIn) {
    // Redirect to the login page if not logged in
    return <Navigate to="/Log-in" />;
  }

  if (!isRoleAllowed) {
    // Redirect to an unauthorized page if the user's role is not allowed
    return <Navigate to="/unauthorized" />;
  }

  // Render the element if the user is authenticated and authorized
  return element;
};

export default ProtectedRoute;
