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

// Return a headers object for axios. When no token is present we return
// an empty headers object so endpoints that don't require auth can still be
// called without guarding for `undefined`.
export const headers = () => {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) {
    headers.Authorization = "Bearer " + token;
  }
  return { headers };
};

// Backwards-compatible helper: returns undefined when no token exists. Use
// this where callers explicitly rely on `header === undefined` behavior.
export const authHeaders = () => {
  const token = localStorage.getItem("token");
  if (token) return { headers: { Authorization: "Bearer " + token } };
  return undefined;
};

const config = { headers, authHeaders, API_BASE };

export default config;
