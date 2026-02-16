import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { adminAPI } from '../services/api';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      // Check if session tokens exist
      const adminToken = sessionStorage.getItem('adminToken');
      const sessionToken = sessionStorage.getItem('sessionToken');
      const adminAuth = sessionStorage.getItem('adminAuth');

      if (!adminToken || !sessionToken || adminAuth !== 'true') {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Validate session with backend
      try {
        await adminAPI.auth.getProfile();
        setIsAuthenticated(true);
      } catch (error: any) {
        // Session invalid or expired
        console.error('Session validation failed:', error);
        
        // Clear session storage
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('sessionToken');
        sessionStorage.removeItem('adminEmail');
        sessionStorage.removeItem('adminAuth');
        
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1b981b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <Navigate to="/panel/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
