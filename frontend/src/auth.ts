interface JWTPayload {
  exp?: number;
  [key: string]: any;
}

export const isAuthenticated = (): boolean => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) return false;

  try {
    const parts = jwt.split(".");
    if (parts.length !== 3) return false; // JWT must have three parts

    const payload: JWTPayload = JSON.parse(atob(parts[1])); // Decode payload

    if (!payload.exp) return false; // If no exp, it's not valid

    return Date.now() < payload.exp * 1000; // Check if token has expired
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return false; // If error occurs, return false
  }
};

type NavigateFunction = (path: string) => void;

export const logout = (navigate: NavigateFunction): void => {
  localStorage.removeItem("jwt");
  navigate("/login");
};