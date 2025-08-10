import type { JWTPayload } from './types';

// Helper function to decode JWT token
const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) return false;

  const payload = decodeJWT(jwt);
  if (!payload || !payload.exp) return false;

  // Check if token is expired
  return Date.now() < payload.exp * 1000;
};

// Get current user info from JWT token
export const getCurrentUser = (): { email: string; role: 'admin' | 'event creator' } | null => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) return null;

  const payload = decodeJWT(jwt);
  if (!payload) return null;

  return {
    email: payload.sub,
    role: payload.role
  };
};

// Check if current user is admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

// Check if current user is event creator or admin
export const canManageEvents = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin' || user?.role === 'event creator';
};

// Get JWT token for API requests
export const getToken = (): string | null => {
  return localStorage.getItem("jwt");
};

// Logout function
export const logout = (navigate: (path: string) => void): void => {
  localStorage.removeItem("jwt");
  navigate("/login");
};

// Store JWT token after successful login
export const setToken = (token: string): void => {
  localStorage.setItem("jwt", token);
};