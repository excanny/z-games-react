// utils/jwtUtils.js
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return true; // Consider invalid tokens as expired
  }
};

export const getUserFromToken = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id || payload.userId || payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name,
      exp: payload.exp,
      iat: payload.iat
    };
  } catch (error) {
    console.error('Error extracting user from JWT:', error);
    return null;
  }
};

export const getTokenTimeRemaining = (token) => {
  if (!token) return 0;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return Math.max(0, payload.exp - currentTime);
  } catch (error) {
    console.error('Error calculating token time remaining:', error);
    return 0;
  }
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const clearAuthToken = () => {
  localStorage.removeItem('token');
};

// Auto-refresh token if close to expiry (optional)
export const shouldRefreshToken = (token, bufferMinutes = 5) => {
  const timeRemaining = getTokenTimeRemaining(token);
  const bufferSeconds = bufferMinutes * 60;
  return timeRemaining > 0 && timeRemaining < bufferSeconds;
};