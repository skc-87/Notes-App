import api from './axios';
import { User } from '../types';

export const requestSignupOtp = async (data: {
  name: string;
  email: string;
  dateOfBirth: string;
}) => {
  const response = await api.post('/auth/request-otp', data);
  return response.data;
};

export const verifySignupOtp = async (data: {
  email: string;
  otp: string;
  password: string;
}) => {
  const response = await api.post<{ token: string; user: User }>(
    '/auth/verify-otp',
    data
  );
  return response.data;
};

export const requestLoginOtp = async (data: { email: string }) => {
  const response = await api.post('/auth/login/request-otp', data);
  return response.data;
};

// Corrected function
export const verifyLoginOtp = async (data: { email: string; otp: string; rememberMe?: boolean }) => {
  // We only send email and otp to the backend. 
  // The 'rememberMe' flag is only used on the frontend in your Redux slice.
  const { email, otp } = data;
  const response = await api.post<{ token: string; user: User }>(
    '/auth/login/verify-otp',
    { email, otp }
  );
  return response.data;
};

export const googleLogin = async (idToken: string) => {
  const response = await api.post<{ token: string; user: User }>('/auth/google', {
    idToken,
  });
  return response.data;
};