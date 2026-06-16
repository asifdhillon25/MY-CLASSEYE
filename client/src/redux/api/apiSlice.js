import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL + "/api",
    credentials: "include", // cookies always sent
  }),
  tagTypes: ["Auth", "Students", "Teachers", "Users","Classes","Dashboard"],
  endpoints: () => ({}), // empty on purpose
});
