import { apiSlice } from "../../api/apiSlice";

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET all students
    getStudents: builder.query({
      query: () => "/students",
      providesTags: ["Students"],
    }),

    // ✅ GET single student
    getStudentById: builder.query({
      query: (id) => `/students/${id}`,
      providesTags: ["Students"],
    }),

    // GET calculated student dashboard data
    getStudentDashboard: builder.query({
      query: ({ id, timeframe = "week", date }) => ({
        url: `/students/dashboard/${id}`,
        params: {
          timeframe,
          ...(date && { date }),
        },
      }),
      providesTags: ["Students"],
    }),

    // GET complete attendance details for a student
    getStudentAttendance: builder.query({
      query: (id) => `/students/${id}/attendance`,
      providesTags: ["Students"],
    }),

    // ✅ ADD student
    addStudent: builder.mutation({
      query: (studentData) => ({
        url: "/students",
        method: "POST",
        body: studentData,
      }),
      invalidatesTags: ["Students"],
    }),

    // ✅ UPDATE student
    updateStudent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/students/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Students"],
    }),

    // ✅ DELETE student
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Students"],
    }),
    updateStudentPhoto: builder.mutation({
      query: ({ id, photo_url }) => ({
        url: `/students/photo/${id}`,
        method: "PATCH",
        body: { photo_url },
      }),
      invalidatesTags: ["Students"], // re-fetch students if needed
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useGetStudentDashboardQuery,
  useGetStudentAttendanceQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useUpdateStudentPhotoMutation,
} = studentApi;
