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
    logout: (state: AuthState) => {
      clearToken();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearAuthError: (state: AuthState) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // FIX: All .addCase calls must come before .addMatcher calls.
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        const rememberMe = action.meta.arg.rememberMe ?? true;
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        setToken(action.payload.token, rememberMe);
      })
      .addCase(verifySignupOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        setToken(action.payload.token, true); // Always remember on signup
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        setToken(action.payload.token, true); // Always remember on Google login
      })
      // Matchers for generic states come after specific cases
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
        (state: AuthState) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action): action is PayloadAction<string> => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state: AuthState, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )
      .addMatcher(
        (action) => ['auth/requestSignupOtp/fulfilled', 'auth/requestLoginOtp/fulfilled'].includes(action.type),
        (state: AuthState) => {
          state.isLoading = false;
        }
      );
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;