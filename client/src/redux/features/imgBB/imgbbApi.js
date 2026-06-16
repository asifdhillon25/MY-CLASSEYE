// imgbbApi.js
import { apiSlice } from "../../api/apiSlice";

// Backend endpoints
const SERVER_UPLOAD_URL = "/upload/imgbb";
const GENERATE_EMBEDDINGS_URL = "/upload/generate-embeddings";
const EMBEDDINGS_STATUS_URL = "/upload/embeddings-status";

export const imgbbApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ Upload image via backend proxy
    uploadImage: builder.mutation({
      // frontend must provide already encoded base64 string or image URL
      query: (image) => {
        if (!image) throw new Error("No image provided to upload");

        return {
          url: SERVER_UPLOAD_URL,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: { image }, // just send what frontend gives
        };
      },
    }),

    // ✅ Generate face embeddings from multiple images
    generateEmbeddings: builder.mutation({
      query: ({ studentId, images }) => {
        if (!studentId) throw new Error("Student ID is required");
        if (!images || images.length < 3) throw new Error("At least 3 images are required");

        return {
          url: GENERATE_EMBEDDINGS_URL,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: { studentId, images },
        };
      },
      transformResponse: (response) => {
        // You can transform the response here if needed
        return response;
      },
      invalidatesTags: (result, error, { studentId }) => [
        { type: 'Student', id: studentId },
        { type: 'Embeddings', id: studentId }
      ],
    }),

    // ✅ Get embeddings status for a student
    getEmbeddingsStatus: builder.query({
      query: (studentId) => ({
        url: `${EMBEDDINGS_STATUS_URL}/${studentId}`,
        method: "GET",
      }),
      providesTags: (result, error, studentId) => [
        { type: 'Embeddings', id: studentId }
      ],
    }),

  }),
});

export const { 
  useUploadImageMutation, 
  useGenerateEmbeddingsMutation,
  useGetEmbeddingsStatusQuery 
} = imgbbApi;