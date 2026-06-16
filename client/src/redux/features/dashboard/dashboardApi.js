import { apiSlice } from "../../api/apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query({
      query: () => "/dashboard/overview",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
} = dashboardApi;
