import axios from "axios";

// Base URL of the backend, e.g. http://localhost:3000 (no trailing slash).
// The Express server exposes REST routes under /api and static uploads
// (posters, voice clips) at its root, so we keep both derived from one value.
export const API_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  // The backend issues an httpOnly session cookie ("token") on login/register
  // and reads it back in auth.middleware.js — credentials must travel with
  // every request for protected routes to work.
  withCredentials: true,
});

// Resolves a relative media path returned by the backend (e.g.
// "/uploads/images/poster-123.png") into an absolute URL the browser can load.
export function resolveMediaUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${API_ORIGIN}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

let onUnauthorized = null;
export function registerUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

// Normalizes backend error payloads into a readable message.
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return error?.response?.data?.message || error?.message || fallback;
}

export default api;
