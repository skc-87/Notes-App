import axios from 'axios';
import { getToken } from '../utils/authToken';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unknown error occurred';
    return Promise.reject(message);
  }
);

export default api;