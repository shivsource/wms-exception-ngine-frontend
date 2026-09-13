const AUTH_KEY = "wms_auth";
const EMAIL_KEY = "wms_user_email";

export interface StoredAuth {
  isAuthenticated: boolean;
  email: string | null;
}

export function getStoredAuth(): StoredAuth {
  if (typeof window === "undefined") return { isAuthenticated: false, email: null };
  return {
    isAuthenticated: window.localStorage.getItem(AUTH_KEY) === "true",
    email: window.localStorage.getItem(EMAIL_KEY),
  };
}

export function setStoredAuth(email: string): void {
  window.localStorage.setItem(AUTH_KEY, "true");
  window.localStorage.setItem(EMAIL_KEY, email);
}

export function clearStoredAuth(): void {
  window.localStorage.removeItem(AUTH_KEY);
  window.localStorage.removeItem(EMAIL_KEY);
}
