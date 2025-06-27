import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking, true = authenticated, false = not authenticated
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Helper function to check if JWT token is expired
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return true; // Consider invalid tokens as expired
    }
  };

  // Helper function to extract user info from JWT
  const getUserFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id || payload.userId,
        email: payload.email,
        role: payload.role,
        exp: payload.exp,
        iat: payload.iat
      };
    } catch (error) {
      console.error('Error extracting user from JWT:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Check if JWT token is expired
        if (isTokenExpired(token)) {
          console.log('JWT token is expired');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Extract user info from JWT
        const userInfo = getUserFromToken(token);
        if (!userInfo) {
          console.log('Invalid JWT token structure');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Optionally verify with backend (recommended for critical operations)
        try {
          const response = await axiosClient.get('/auth/verify');
          
          if (response.data.success || response.status === 200) {
            setIsAuthenticated(true);
          } else {
            // Token is invalid on server side, remove it
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        } catch (verifyError) {
          // If verification endpoint fails, but token is valid and not expired,
          // we can still proceed (depends on your security requirements)
          console.warn('Token verification with server failed, but JWT is valid:', verifyError);
          setIsAuthenticated(true); // Comment this line if you want strict server verification
        }

      } catch (error) {
        console.error('Auth check failed:', error);
        // If anything fails, remove token and redirect to login
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to admin login
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;