import React from 'react';
import { Navigate } from 'react-router-dom';
import { recyclerAuthService } from '../services/recyclerAuth';

interface ProtectedRecyclerRouteProps {
  children: React.ReactNode;
}

const ProtectedRecyclerRoute: React.FC<ProtectedRecyclerRouteProps> = ({ children }) => {
  // Simple check - if authenticated locally, allow access
  // Backend validation happens via axios interceptor on API calls
  const isAuthenticated = recyclerAuthService.isAuthenticated();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/recycler/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRecyclerRoute;
