const AUTH_TOKEN_KEY = 'authToken';

export const getToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};