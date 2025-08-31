const AUTH_TOKEN_KEY = 'authToken';

// FIX: Updated to get the token from either localStorage or sessionStorage
export const getToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
};

// FIX: Updated to accept a 'rememberMe' flag to decide where to store the token
export const setToken = (token: string, rememberMe: boolean): void => {
  if (rememberMe) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  }
};

// FIX: Updated to clear the token from both storages
export const clearToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
};