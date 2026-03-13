import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: null, // logged-in user info
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "authStore",
  initialState,
  reducers: {
    login: (state, action) => {
      state.auth = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.auth = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action) => {
      if (state.auth) {
        state.auth = { ...state.auth, ...action.payload };
      }
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;