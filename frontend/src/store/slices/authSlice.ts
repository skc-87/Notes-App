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

export const requestSignupOtp = createAsyncThunk(
  'auth/requestSignupOtp',
  async (data: Parameters<typeof authApi.requestSignupOtp>[0], { rejectWithValue }) => {
    try {
      return await authApi.requestSignupOtp(data);
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : 'Failed to send OTP. Please try again.');
    }
  }
);
export const verifySignupOtp = createAsyncThunk(
  'auth/verifySignupOtp',
  async (data: Parameters<typeof authApi.verifySignupOtp>[0], { rejectWithValue }) => {
    try {
      return await authApi.verifySignupOtp(data);
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : 'Failed to verify OTP. Please try again.');
    }
  }
);
export const requestLoginOtp = createAsyncThunk(
  'auth/requestLoginOtp',
  async (data: Parameters<typeof authApi.requestLoginOtp>[0], { rejectWithValue }) => {
    try {
      return await authApi.requestLoginOtp(data);
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : 'Failed to send OTP. Please try again.');
    }
  }
);
export const verifyLoginOtp = createAsyncThunk(
  'auth/verifyLoginOtp',
  async (data: Parameters<typeof authApi.verifyLoginOtp>[0], { rejectWithValue }) => {
    try {
      return await authApi.verifyLoginOtp(data);
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : 'Failed to sign in. Please try again.');
    }
  }
);
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (idToken: string, { rejectWithValue }) => {
    try {
      return await authApi.googleLogin(idToken);
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : 'Google sign-in failed. Please try again.');
    }
  }
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
        setToken(action.payload.token, true);
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        setToken(action.payload.token, true);
      })
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