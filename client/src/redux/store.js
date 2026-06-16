import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/authSlice";
import { authApi } from "../redux/features/auth/authApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // RTK Query reducer for caching and request state
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
