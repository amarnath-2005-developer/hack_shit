import axios from "axios";

// Base API client — points at the user's Node/Express backend.
// Set VITE_API_URL in your environment to override the default.
const baseURL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "http://localhost:5000";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach JWT if present (client-side only) and ensure /api prefix.
api.interceptors.request.use((config) => {
  if (config.url && !config.url.startsWith("/api")) {
    config.url = `/api${config.url.startsWith("/") ? "" : "/"}${config.url}`;
  }

  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to unwrap success envelopes
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success === true && response.data.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => Promise.reject(error),
);
