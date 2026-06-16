import { apiSlice } from "../../api/apiSlice";

export const classesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ GET all classes
    getClasses: builder.query({
      query: () => "/classes",
      providesTags: ["Classes"],
    }),

    // ✅ GET single class by ID
    getClassById: builder.query({
      query: (id) => `/classes/${id}`,
      providesTags: ["Classes"],
    }),

    // ✅ ADD class
    addClass: builder.mutation({
      query: (classData) => ({
        url: "/classes",
        method: "POST",
        body: classData,
      }),
      invalidatesTags: ["Classes"],
    }),

    // ✅ UPDATE class
    updateClass: builder.mutation({
      query: ({ id, data }) => ({
        url: `/classes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Classes"],
    }),

    // ✅ DELETE class
    deleteClass: builder.mutation({
      query: (id) => ({
        url: `/classes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Classes"],
    }),

  }),
});

export const {
  useGetClassesQuery,
  useGetClassByIdQuery,
  useAddClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = classesApi;
