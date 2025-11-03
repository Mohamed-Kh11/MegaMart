// lib/axios.js
import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001/api"
    : process.env.NEXT_PUBLIC_API_URL; // Must be absolute in production

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // <— required for cross-domain cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: central error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("Unauthorized, redirecting...");
      // window.location.href = "/signin";
    }
    return Promise.reject(err);
  }
);

export default api;
