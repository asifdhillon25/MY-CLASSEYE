import { apiSlice } from "../../api/apiSlice";

export const teacherApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ GET all teachers
    getTeachers: builder.query({
      query: () => "/teachers",
      providesTags: ["Teachers"],
    }),

    // ✅ GET single teacher
    getTeacherById: builder.query({
      query: (id) => `/teachers/${id}`,
      providesTags: ["Teachers"],
    }),

    // GET calculated teacher dashboard data
    getTeacherDashboard: builder.query({
      query: ({ id, timeframe = "week", classId, date }) => ({
        url: `/teachers/dashboard/${id}`,
        params: {
          timeframe,
          ...(classId && { classId }),
          ...(date && { date }),
        },
      }),
      providesTags: ["Teachers"],
    }),

    // ✅ ADD teacher
    addTeacher: builder.mutation({
      query: (teacherData) => ({
        url: "/teachers",
        method: "POST",
        body: teacherData,
      }),
      invalidatesTags: ["Teachers"],
    }),

    // ✅ UPDATE teacher
    updateTeacher: builder.mutation({
      query: ({ id, data }) => ({
        url: `/teachers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Teachers"],
    }),

    // ✅ DELETE teacher
    deleteTeacher: builder.mutation({
      query: (id) => ({
        url: `/teachers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teachers"],
    }),

  }),
});

export const {
  useGetTeachersQuery,
  useGetTeacherByIdQuery,
  useGetTeacherDashboardQuery,
  useAddTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherApi;
