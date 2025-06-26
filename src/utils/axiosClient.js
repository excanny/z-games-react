import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",  // ✅ Base URL for all API calls
  timeout: 10000,                         // ✅ Optional: timeout after 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Example of adding interceptors (for auth token, errors, etc)
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default api;
