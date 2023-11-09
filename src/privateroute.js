import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

function PrivateRoute({ isAuthenticated, ...props }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet {...props} />;
}

export default PrivateRoute;
