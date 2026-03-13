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
    if (!error.response) {
      return Promise.reject('Unable to connect to the server. Please check your internet connection and try again.');
    }
    if (error.response.status === 404) {
      return Promise.reject('The requested service is currently unavailable. Please try again later.');
    }
    const message = error.response?.data?.message || error.message || 'An unknown error occurred';
    return Promise.reject(message);
  }
);

export default api;