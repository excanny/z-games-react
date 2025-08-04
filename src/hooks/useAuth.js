// hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { getAuthToken, getUserFromToken, isTokenExpired, clearAuthToken } from '../utils/jwtUtils';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  const checkAuth = useCallback(() => {
    const token = getAuthToken();
    
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    if (isTokenExpired(token)) {

      clearAuthToken();
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    const userInfo = getUserFromToken(token);
    if (userInfo) {
      setUser(userInfo);
      setIsAuthenticated(true);
    } else {
      clearAuthToken();
      setUser(null);
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Set up token expiration check
  useEffect(() => {
    const token = getAuthToken();
    if (token && !isTokenExpired(token)) {
      const userInfo = getUserFromToken(token);
      if (userInfo && userInfo.exp) {
        const expirationTime = userInfo.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiration = expirationTime - currentTime;

        if (timeUntilExpiration > 0) {
          const timer = setTimeout(() => {
    
            logout();
          }, timeUntilExpiration);

          return () => clearTimeout(timer);
        }
      }
    }
  }, [user]);

  // Logout function
  const logout = useCallback(() => {
    clearAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Get user role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return user?.role === 'admin' || user?.role === 'administrator';
  }, [user]);

  // Get token expiration info
  const getTokenInfo = useCallback(() => {
    const token = getAuthToken();
    if (!token) return null;

    const userInfo = getUserFromToken(token);
    return {
      expiresAt: userInfo?.exp ? new Date(userInfo.exp * 1000) : null,
      issuedAt: userInfo?.iat ? new Date(userInfo.iat * 1000) : null,
      timeRemaining: userInfo?.exp ? Math.max(0, userInfo.exp - Date.now() / 1000) : 0
    };
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    checkAuth,
    logout,
    hasRole,
    isAdmin,
    getTokenInfo
  };
};