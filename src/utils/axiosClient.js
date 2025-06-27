// src/api.js

import axios from 'axios';
import config from "../config";
import { getAuthToken, clearAuthToken, isTokenExpired } from './jwtUtils';

const axiosClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to headers
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    
    if (token) {
      // Check if token is expired before making request
      if (isTokenExpired(token)) {
        console.log('JWT token expired, clearing from storage');
        clearAuthToken();
        // Redirect to login if we're not already there
        if (window.location.pathname !== '/admin-login') {
          window.location.href = '/admin-login';
        }
        return Promise.reject(new Error('Token expired'));
      }
      
      // Add token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle JWT expiration and auth errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // Handle JWT expiration or invalid token
      if (status === 401) {
        console.log('Received 401 - Token invalid or expired');
        clearAuthToken();
        
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/admin-login') {
          window.location.href = '/admin-login';
        }
      }
      
      // Handle forbidden access
      if (status === 403) {
        console.log('Received 403 - Access forbidden');
        // You might want to show a "access denied" message
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
