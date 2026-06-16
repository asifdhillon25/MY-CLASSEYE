import { apiSlice } from "../../api/apiSlice";

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // ==================== QUERIES ====================
    
    getClassAttendance: builder.query({
      query: ({ classId, date }) => ({
        url: `/attendance/class/${classId}/${date}`,
        method: "GET",
      }),
      providesTags: (result, error, { classId, date }) => [
        { type: 'Attendance', id: `${classId}-${date}` },
        { type: 'Attendance', id: 'LIST' }
      ],
      transformResponse: (response) => response.data,
    }),

    getClassAttendanceHistory: builder.query({
      query: ({ classId, ...params }) => ({
        url: `/attendance/history/class/${classId}`,
        method: "GET",
        params: {
          startDate: params.startDate,
          endDate: params.endDate,
          limit: params.limit || 50
        }
      }),
      providesTags: (result, error, { classId }) => [
        { type: 'AttendanceHistory', id: classId }
      ],
      transformResponse: (response) => response.data,
    }),

    getStudentAttendanceSummary: builder.query({
      query: ({ studentId, classId, ...params }) => ({
        url: `/attendance/history/student/${studentId}/class/${classId}`,
        method: "GET",
        params: {
          startDate: params.startDate,
          endDate: params.endDate
        }
      }),
      providesTags: (result, error, { studentId, classId }) => [
        { type: 'StudentAttendance', id: `${studentId}-${classId}` }
      ],
      transformResponse: (response) => response.data,
    }),

    // ==================== MUTATIONS ====================

    createManualAttendance: builder.mutation({
      query: ({ classId, teacherId, records }) => ({
        url: `/attendance/manual/${classId}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { teacherId, records },
      }),
      invalidatesTags: (result, error, { classId }) => [
        { type: 'Attendance', id: `${classId}-${new Date().toISOString().split('T')[0]}` },
        { type: 'Attendance', id: 'LIST' },
        { type: 'AttendanceHistory', id: classId }
      ],
      transformResponse: (response) => response.data,
    }),

    createImageAttendance: builder.mutation({
      query: ({ classId, teacherId, images }) => {
        // Create FormData
        const formData = new FormData();
        formData.append('teacherId', teacherId);
        
        // Add images - images should be File objects
        images.forEach((imageFile, index) => {
          if (imageFile instanceof File) {
            formData.append('images', imageFile);
          } else if (imageFile.file && imageFile.file instanceof File) {
            // Handle the object format from ImageAttendanceModal
            formData.append('images', imageFile.file);
          } else {
            console.warn('Invalid image format at index', index, imageFile);
          }
        });

        return {
          url: `/attendance/auto/${classId}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { classId }) => [
        { type: 'Attendance', id: `${classId}-${new Date().toISOString().split('T')[0]}` },
        { type: 'Attendance', id: 'LIST' },
        { type: 'AttendanceHistory', id: classId }
      ],
      transformResponse: (response) => response.data,
    }),

    updateStudentStatus: builder.mutation({
      query: ({ attendanceId, studentId, status, marked_by = "manual" }) => ({
        url: `/attendance/${attendanceId}/student/${studentId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: { status, marked_by },
      }),
      invalidatesTags: (result, error, { attendanceId }) => [
        { type: 'Attendance', id: attendanceId },
        { type: 'Attendance', id: 'LIST' }
      ],
      transformResponse: (response) => response.data,
    }),

    finalizeAttendance: builder.mutation({
      query: ({ attendanceId, teacherId }) => ({
        url: `/attendance/${attendanceId}/finalize`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { teacherId },
      }),
      invalidatesTags: (result, error, { attendanceId }) => [
        { type: 'Attendance', id: attendanceId },
        { type: 'Attendance', id: 'LIST' }
      ],
      transformResponse: (response) => response.data,
    }),

    bulkUpdateAttendance: builder.mutation({
      query: ({ classId, teacherId, updates }) => ({
        url: `/attendance/bulk/${classId}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { teacherId, updates },
      }),
      invalidatesTags: (result, error, { classId }) => [
        { type: 'Attendance', id: `${classId}-${new Date().toISOString().split('T')[0]}` },
        { type: 'Attendance', id: 'LIST' }
      ],
      transformResponse: (response) => response.data,
    }),

  }),
  
  overrideExisting: true,
});

// Export hooks
export const {
  useGetClassAttendanceQuery,
  useGetClassAttendanceHistoryQuery,
  useGetStudentAttendanceSummaryQuery,
  useCreateManualAttendanceMutation,
  useCreateImageAttendanceMutation,
  useUpdateStudentStatusMutation,
  useFinalizeAttendanceMutation,
  useBulkUpdateAttendanceMutation,
  usePrefetch,
} = attendanceApi;

// Helper functions
export function dataURLtoBlob(dataURL) {
  if (!dataURL) return null;
  
  try {
    let base64Data;
    if (dataURL.startsWith('data:')) {
      base64Data = dataURL.split(',')[1];
    } else {
      base64Data = dataURL;
    }
    
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: 'image/jpeg' });
  } catch (error) {
    console.error('Error converting data URL to blob:', error);
    return null;
  }
}

export const createAttendanceRecord = (studentId, status = "absent", marked_by = "manual", confidence = null) => ({
  studentId,
  status,
  marked_by,
  confidence,
  marked_at: new Date().toISOString(),
});

export const formatDateForAPI = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateAttendanceStats = (records) => {
  if (!records || !Array.isArray(records)) {
    return {
      present: 0,
      absent: 0,
      total: 0,
      percentage: 0
    };
  }
  
  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const total = records.length;
  const percentage = total > 0 ? (present / total) * 100 : 0;
  
  return {
    present,
    absent,
    total,
    percentage: percentage.toFixed(1)
  };
};