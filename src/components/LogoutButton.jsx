import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthToken } from '../utils/jwtUtils';

const LogoutButton = ({ className = "" }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optionally call logout endpoint to invalidate token on server
      // await axiosClient.post('/auth/logout');
      
      // Clear JWT token from localStorage
      clearAuthToken();
      
      // Redirect to admin login
      navigate('/admin-login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server logout fails, still clear local token and redirect
      clearAuthToken();
      navigate('/admin-login', { replace: true });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ${className}`}
      title="Sign out of admin dashboard"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Logout
    </button>
  );
};

export default LogoutButton;