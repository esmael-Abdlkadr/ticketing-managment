import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../store/useAuth';
import { UserRole, Permissions } from '../services/users/types';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: Permissions[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRoles = [], 
  requiredPermissions = [] 
}) => {
  const { isAuthenticated, user, token } = useAuth();
  const location = useLocation();

  // Check if user is authenticated at all
  if (!isAuthenticated || !token) {
    // User is not logged in - redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, now check permissions
  const hasRequiredRole = requiredRoles.length === 0 || 
    (user?.role && requiredRoles.includes(user.role));
  
  const hasRequiredPermission = requiredPermissions.length === 0 || 
    requiredPermissions.some(permission => 
      user?.permissions?.includes(permission)
    );

  // If either role or permission requirements are not met
  if (!hasRequiredRole || !hasRequiredPermission) {
    // You could either redirect to a "forbidden" page
    // return <Navigate to="/forbidden" replace />;
    
    // Or show an inline unauthorized message
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg w-full text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-700 mb-4">
            You don't have permission to access this resource.
            {user?.role && (
              <span className="block mt-2">
                Your current role: <strong>{user.role}</strong>
              </span>
            )}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // User has required role and permissions, render the protected content
  return <>{children}</>;
};

export default AuthGuard;