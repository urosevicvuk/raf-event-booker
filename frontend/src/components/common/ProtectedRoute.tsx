import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.status !== 'active') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>Your account is inactive. Please contact an administrator.</p>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>This page requires administrator privileges.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;