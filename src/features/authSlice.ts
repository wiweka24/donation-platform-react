import { createSlice } from "@reduxjs/toolkit";
import { apiService } from "../services/apiService";

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") ?? null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiService.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        localStorage.setItem("token", payload.token);
      }
    );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
