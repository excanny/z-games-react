// src/config.js

const baseUrl = import.meta.env.VITE_BASE_URL;

// WebSocket base for Socket.IO — Socket.IO can use http(s) URLs directly
const socketBaseUrl = baseUrl;

const config = {
  baseUrl,                // http(s)://...
  apiBaseUrl: `${baseUrl}/api`,
  wsBaseUrl: baseUrl.replace(/^http/, "ws"), // For native WebSocket if needed
  socketBaseUrl,          // For Socket.IO use (http or https)
};

export default config;
