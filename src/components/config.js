// Base API URL can be configured via REACT_APP_API_URL in environment
// Determine environment-aware backend URL.
// In CI/build for production set REACT_APP_API_URL=https://interview-zone-backend.onrender.com
// In development we default to localhost so local backend can be used.
export const API_BASE =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://interview-zone-backend.onrender.com"
    : "http://localhost:3001");

// Optional: FRONTEND_BASE can be used for CORS checks in the backend.
export const FRONTEND_BASE =
  process.env.REACT_APP_FRONTEND_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://interview-zone-frontend.web.app"
    : "http://localhost:3000");

export const headers = () => {
  const token = localStorage.getItem("token");
  if (token !== undefined && token !== null) {
    const headers = {
      Authorization: "Bearer " + token,
    };
    return {
      headers,
    };
  }
  return undefined;
};

const config = { headers, API_BASE };

export default config;
