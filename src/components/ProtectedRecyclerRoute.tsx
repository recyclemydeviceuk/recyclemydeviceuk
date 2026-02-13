import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRecyclerRouteProps {
  children: React.ReactNode;
}

const ProtectedRecyclerRoute: React.FC<ProtectedRecyclerRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('recyclerAuth') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/recycler/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRecyclerRoute;
