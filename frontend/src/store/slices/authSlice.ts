import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import * as authApi from '../../api/authApi';
import { setToken, clearToken, getToken } from '../../utils/authToken';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Helper to decode token and get user data
const getUserFromToken = (token: string | null): User | null => {
  if (!token) return null;
  try {
    // Note: The decoded object might not have a 'name'. Adjust your backend to include it if needed.
    const decoded: { userId: string; email: string; name?: string } = jwtDecode(token);
    return { id: decoded.userId, name: decoded.name || '', email: decoded.email };
  } catch (error) {
    clearToken();
    return null;
  }
};

const initialToken = getToken();
const initialState: AuthState = {
  user: getUserFromToken(initialToken),
  token: initialToken,
  isAuthenticated: !!initialToken,
  isLoading: false,
  error: null,
};

// Async Thunks
export const requestSignupOtp = createAsyncThunk(
  'auth/requestSignupOtp',
  authApi.requestSignupOtp
);
export const verifySignupOtp = createAsyncThunk(
  'auth/verifySignupOtp',
  authApi.verifySignupOtp
);
export const requestLoginOtp = createAsyncThunk(
  'auth/requestLoginOtp',
  authApi.requestLoginOtp
);
export const verifyLoginOtp = createAsyncThunk(
  'auth/verifyLoginOtp',
  authApi.verifyLoginOtp
);
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  authApi.googleLogin
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      clearToken();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state for all thunks
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      // Handle successful login/verification
      .addMatcher(
        (action): action is PayloadAction<{ token: string; user: User }> =>
          ['auth/verifySignupOtp/fulfilled', 'auth/verifyLoginOtp/fulfilled', 'auth/googleLogin/fulfilled'].includes(action.type),
        (state, action) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user;
          setToken(action.payload.token);
        }
      )
       // Handle OTP request success
      .addMatcher(
        (action) => ['auth/requestSignupOtp/fulfilled', 'auth/requestLoginOtp/fulfilled'].includes(action.type),
        (state) => {
          state.isLoading = false;
        }
      )
      // Handle rejected state for all thunks
      .addMatcher(
        // FIX IS HERE: Type the action as PayloadAction<string>
        (action): action is PayloadAction<string> => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload; // No need for 'as string' anymore
        }
      );
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;