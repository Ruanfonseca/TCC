import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, UserInfo } from "@/types/auth";

// Estado inicial
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Slice de autenticação
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ---- LOGIN ----
    loginRequest: (
      state,
      _action: PayloadAction<{ email: string; password: string }>
    ) => {},

    loginSuccess: (
      state,
      action: PayloadAction<{ user: UserInfo; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    loginFailure: (state, _action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },

    // ---- LOGOUT ----
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },

    // ---- REHYDRATE ----
    rehydrate: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout, rehydrate } =
  authSlice.actions;

export default authSlice.reducer;
