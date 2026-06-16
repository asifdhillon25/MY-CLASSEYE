import { apiSlice } from "../../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ GET all users
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    // ✅ GET single user by ID
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["Users"],
    }),

    // ✅ ADD new user
    addUser: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ UPDATE user by ID
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ DELETE user by ID
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ LOGIN user
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      // Typically you don't invalidate list on login
    }),

    // ✅ GET users by role
    getUsersByRole: builder.query({
      query: (role) => `/users/role/${role}`,
      providesTags: ["Users"],
    }),

  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLoginUserMutation,
  useGetUsersByRoleQuery,
} = userApi;
