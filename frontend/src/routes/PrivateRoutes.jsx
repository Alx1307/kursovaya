import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => Boolean(localStorage.getItem('authToken'));

const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default PrivateRoute;