const Attendance = require("../models/attendance.model");
const Class = require("../models/class.model");
const Student = require("../models/student.model");
const AI_API_URL = process.env.AI_API_URL || "https://asifdhillon25-classeye.hf.space";

/**
 * Get attendance for a class on specific date
 * If no attendance exists, create empty records for all students
 */
const getClassAttendance = async (req, res) => {
  try {
    const { classId, date } = req.params;
    console.log("Fetching attendance for class:", classId, "on date:", date);
    
    if (!classId || !date) {
      return res.status(400).json({
        success: false,
        message: "Class ID and date are required"
      });
    }

    // Parse date (expecting YYYY-MM-DD format)
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD"
      });
    }

    // Set time to start of day for accurate comparison
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Find class with students
    const classData = await Class.findById(classId)
      .populate({
        path: 'students',
        select: '_id name roll_no photo_url email phone_number has_embeddings'
      })
      .populate('teacher', '_id name email');

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    // Find existing attendance for this date
    let attendance = await Attendance.findOne({
      class: classId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    }).populate({
      path: 'records.student',
      select: '_id name roll_no photo_url email phone_number has_embeddings', // ADD has_embeddings here
      model: 'Students' 
    });

   // If no attendance exists, return template with all students as absent
if (!attendance) {
  // Ensure has_embeddings field exists with default value
  const templateRecords = classData.students.map(student => ({
    student: {
      _id: student._id,
      name: student.name || "Unknown Student",
      roll_no: student.roll_no,
      photo_url: student.photo_url,
      email: student.email,
      phone_number: student.phone_number,
      // Ensure has_embeddings is always included with a proper default
      has_embeddings: student.has_embeddings !== undefined ? student.has_embeddings : false,
    },
    status: "absent",
    marked_by: "manual",
    confidence: null,
    marked_at: null
  }));

  // Calculate statistics for template
  const presentCount = 0;
  const absentCount = classData.students.length;
  const totalStudents = classData.students.length;
  
  // Count students with embeddings for frontend info
  const studentsWithEmbeddingsCount = classData.students.filter(
    student => student.has_embeddings === true
  ).length;

  return res.json({
    success: true,
    data: {
      _id: null,
      class: classData._id,
      date: targetDate,
      teacher: classData.teacher,
      records: templateRecords,
      method: "manual",
      images_used: [],
      is_finalized: false,
      created_at: null,
      updated_at: null,
      present_count: presentCount,
      absent_count: absentCount,
      total_students: totalStudents,
      class_info: {
        code: classData.class_code,
        course_name: classData.course_name,
        total_students: totalStudents,
        // Include full students list with embeddings info
        students: classData.students.map(student => ({
          _id: student._id,
          name: student.name || "Unknown Student",
          roll_no: student.roll_no,
          photo_url: student.photo_url,
          email: student.email,
          phone_number: student.phone_number,
          has_embeddings: student.has_embeddings !== undefined ? student.has_embeddings : false
        })),
        // Add embeddings statistics for frontend
        embeddings_stats: {
          total_with_embeddings: studentsWithEmbeddingsCount,
          total_students: totalStudents,
          percentage_with_embeddings: totalStudents > 0 
            ? Math.round((studentsWithEmbeddingsCount / totalStudents) * 100) 
            : 0
        }
      }
    },
    message: "No attendance found for this date. Template created."
  });
}

    // If attendance exists, ensure all enrolled students are included
    const existingStudentIds = attendance.records.map(r => 
      r.student ? r.student._id.toString() : r.student.toString()
    );
    
    const newStudents = classData.students.filter(
      student => !existingStudentIds.includes(student._id.toString())
    );

    if (newStudents.length > 0) {
      newStudents.forEach(student => {
        attendance.records.push({
          student: student._id, // Store only ID initially
          status: "absent",
          marked_by: "manual",
          confidence: null,
          marked_at: null
        });
      });

      attendance.updated_at = new Date();
      await attendance.save();
      
      // Re-populate the attendance record after adding new students
      attendance = await Attendance.findById(attendance._id)
        .populate({
          path: 'records.student',
          select: '_id name roll_no photo_url email phone_number has_embeddings', // ADD has_embeddings here too
          model: 'Student' // Check if this should be 'Student' or 'Students'
        });
    }

    // Convert to plain object and ensure all student data is included
    const attendanceWithStats = attendance.toObject();
    
    // Calculate statistics
    attendanceWithStats.present_count = attendance.records.filter(r => r.status === 'present').length;
    attendanceWithStats.absent_count = attendance.records.filter(r => r.status === 'absent').length;
    attendanceWithStats.total_students = attendance.records.length;

    // Ensure all records have populated student data
    attendanceWithStats.records = attendanceWithStats.records.map(record => {
      // If student is already populated, keep it
      if (record.student && record.student._id) {
        return record;
      }
      
      // If student is just an ID, find the student data from classData
      const studentData = classData.students.find(s => 
        s._id.toString() === record.student.toString()
      );
      
      return {
        ...record,
        student: studentData || { 
          _id: record.student, 
          name: "Unknown Student",
          has_embeddings: false 
        }
      };
    });

    res.json({
      success: true,
      data: {
        ...attendanceWithStats,
        class_info: {
          code: classData.class_code,
          course_name: classData.course_name,
          total_students: classData.students.length,
          // Also pass the full students array with embeddings
          students: classData.students.map(student => ({
            _id: student._id,
            name: student.name,
            roll_no: student.roll_no,
            has_embeddings: student.has_embeddings || false
          }))
        }
      }
    });

  } catch (error) {
    console.error("Get class attendance error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch attendance"
    });
  }
};
/**
 * Create/update manual attendance
 */
const createManualAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { teacherId, records } = req.body;

    console.log("records received for manual attendance:", records);

    // Validate inputs
    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID is required" 
      });
    }

    if (!records || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: "Attendance records array is required"
      });
    }

    // Get class to validate
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    console.log("Class data teacher ID:", classData, "Provided teacher ID:", teacherId);

  // Validate teacher has access to this class
// Convert both to string for comparison
// if (classData.teacher._id.toString() !== teacherId) {
//   console.log("Unauthorized teacher:", teacherId, "for class:", classData.teacher._id.toString());
//   return res.status(403).json({
//     success: false,
//     message: "You are not authorized to mark attendance for this class"
//   });
// }

    // Get current date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find existing attendance for today
    let attendance = await Attendance.findOne({
      class: classId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    // Process each record
    const processedRecords = records.map(record => ({
      student: record.studentId,
      status: record.status || "absent",
      marked_by: "manual",
      confidence: null,
      marked_at: new Date()
    }));

    if (attendance) {
      // Update existing attendance
      attendance.records = processedRecords;
      attendance.method = "manual";
      attendance.teacher = teacherId;
      attendance.updated_at = new Date();
    } else {
      // Create new attendance
      attendance = new Attendance({
        class: classId,
        date: today,
        teacher: teacherId,
        records: processedRecords,
        method: "manual",
        images_used: [],
        is_finalized: false
      });
    }

    await attendance.save();

    // Populate student info for response
    await attendance.populate({
      path: 'records.student',
      select: '_id name roll_no'
    });

    res.json({
      success: true,
      message: "Attendance recorded successfully",
      data: {
        _id: attendance._id,
        present_count: attendance.records.filter(r => r.status === 'present').length,
        absent_count: attendance.records.filter(r => r.status === 'absent').length,
        total_students: attendance.records.length,
        is_finalized: attendance.is_finalized,
        date: attendance.date
      }
    });

  } catch (error) {
    console.error("Create manual attendance error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to record attendance"
    });
  }
};

/**
 * Create/update attendance using images (AI-assisted)
 */
const createImageAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { teacherId } = req.body;
    const images = req.files; // From multer middleware

    console.log("Received images for AI attendance:", images ? images.length : 0);

    // Validate inputs
    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID is required"
      });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required"
      });
    }

    // Get class with students who have embeddings
    const classData = await Class.findById(classId)
      .populate({
        path: 'students',
        select: '_id name roll_no face_embedding has_embeddings',
        match: { has_embeddings: true }
      });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    // // Check teacher authorization
    // if (classData.teacher.toString() !== teacherId) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You are not authorized to mark attendance for this class"
    //   });
    // }

    // Check if any students have embeddings
    if (classData.students.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No students in this class have face embeddings configured"
      });
    }

    // Convert images to base64
    const base64Images = images.map(file => {
      return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    });

    // Prepare data for Flask face recognition
    const studentsWithEmbeddings = classData.students.map(student => ({
      studentId: student._id.toString(),
      name: student.name,
      roll_no: student.roll_no,
      embedding: student.face_embedding
    }));

    // Call Flask face recognition API
   
    // 'http://127.0.0.1:8000/recognize'
    
    const flaskResponse = await fetch( `${AI_API_URL}/recognize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        images: base64Images,
        students: studentsWithEmbeddings
      }),
      timeout: 30000 // 30 second timeout
    });

    if (!flaskResponse.ok) {
      throw new Error('Face recognition service failed');
    }

    const recognitionResult = await flaskResponse.json();
    console.log("Face recognition result:", recognitionResult);

    // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find existing attendance for today
    let attendance = await Attendance.findOne({
      class: classId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    // Create records for recognized students
    const recognizedStudentIds = recognitionResult.recognized?.map(r => r.studentId) || [];
    
    // Get all students in class (not just those with embeddings)
    const allClassStudents = await Class.findById(classId)
      .populate({
        path: 'students',
        select: '_id name roll_no has_embeddings'
      });

    const allStudentIds = allClassStudents.students.map(s => s._id.toString());

    // Create attendance records
    const attendanceRecords = allStudentIds.map(studentId => {
      const isRecognized = recognizedStudentIds.includes(studentId);
      const recognitionInfo = recognitionResult.recognized?.find(r => r.studentId === studentId);
      
      return {
        student: studentId,
        status: isRecognized ? "present" : "absent",
        marked_by: isRecognized ? "image" : "manual",
        confidence: isRecognized ? recognitionInfo.confidence : null,
        marked_at: new Date()
      };
    });

    if (attendance) {
      // Update existing attendance - merge with existing
      attendance.records = attendanceRecords;
      attendance.method = recognitionResult.recognized?.length > 0 ? "image" : "mixed";
      attendance.teacher = teacherId;
      attendance.images_used = [...(attendance.images_used || []), ...base64Images];
      attendance.updated_at = new Date();
    } else {
      // Create new attendance
      attendance = new Attendance({
        class: classId,
        date: today,
        teacher: teacherId,
        records: attendanceRecords,
        method: recognitionResult.recognized?.length > 0 ? "image" : "mixed",
        images_used: base64Images,
        is_finalized: false
      });
    }

    await attendance.save();

    // Populate student info with has_embeddings
    await attendance.populate({
      path: 'records.student',
      select: '_id name roll_no has_embeddings'
    });

    // Prepare recognized students info
    const recognizedStudents = recognitionResult.recognized?.map(rec => {
      const student = classData.students.find(s => s._id.toString() === rec.studentId);
      return {
        studentId: rec.studentId,
        name: student?.name || rec.name,
        confidence: rec.confidence,
        roll_no: student?.roll_no,
        has_embeddings: true
      };
    }) || [];

    res.json({
      success: true,
      message: "AI attendance processed successfully",
      data: {
        attendance_id: attendance._id,
        recognized_students: recognizedStudents,
        present_count: attendance.records.filter(r => r.status === 'present').length,
        absent_count: attendance.records.filter(r => r.status === 'absent').length,
        total_students: attendance.records.length,
        images_processed: images.length,
        is_finalized: attendance.is_finalized,
        note: "Teacher should review and finalize the attendance"
      }
    });

  } catch (error) {
    console.error("Create image attendance error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process image attendance"
    });
  }
};

/**
 * Update individual student attendance status
 */
const updateStudentStatus = async (req, res) => {
  try {
    const { attendanceId, studentId } = req.params;
    const { status, marked_by = "manual" } = req.body;

    if (!status || !["present", "absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status (present/absent) is required"
      });
    }

    // Find attendance
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found"
      });
    }

    // Check if attendance is finalized
    if (attendance.is_finalized) {
      return res.status(400).json({
        success: false,
        message: "Cannot update finalized attendance"
      });
    }

    // Find and update student record
    const studentRecord = attendance.records.find(
      record => record.student.toString() === studentId
    );

    if (!studentRecord) {
      // Add new record if student not found
      attendance.records.push({
        student: studentId,
        status,
        marked_by,
        confidence: null,
        marked_at: new Date()
      });
    } else {
      // Update existing record
      studentRecord.status = status;
      studentRecord.marked_by = marked_by;
      studentRecord.marked_at = new Date();
      
      // Reset confidence if manually changed
      if (marked_by === "manual") {
        studentRecord.confidence = null;
      }
    }

    // Update method to mixed if combining manual and auto
    if (marked_by === "manual" && attendance.method === "image") {
      attendance.method = "mixed";
    } else if (marked_by === "image" && attendance.method === "manual") {
      attendance.method = "mixed";
    }

    attendance.updated_at = new Date();
    await attendance.save();

    // Populate student info
    await attendance.populate({
      path: 'records.student',
      select: '_id name roll_no'
    });

    res.json({
      success: true,
      message: "Student attendance updated",
      data: {
        attendance_id: attendance._id,
        student_id: studentId,
        status,
        marked_by,
        present_count: attendance.records.filter(r => r.status === 'present').length,
        absent_count: attendance.records.filter(r => r.status === 'absent').length
      }
    });

  } catch (error) {
    console.error("Update student status error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update student status"
    });
  }
};

/**
 * Finalize attendance (teacher confirms)
 */
const finalizeAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { teacherId } = req.body;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID is required"
      });
    }

    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found"
      });
    }

    // Verify teacher owns this attendance
    if (attendance.teacher.toString() !== teacherId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to finalize this attendance"
      });
    }

    // Check if already finalized
    if (attendance.is_finalized) {
      return res.status(400).json({
        success: false,
        message: "Attendance is already finalized"
      });
    }

    // Finalize attendance
    attendance.is_finalized = true;
    attendance.updated_at = new Date();
    await attendance.save();

    res.json({
      success: true,
      message: "Attendance finalized successfully",
      data: {
        attendance_id: attendance._id,
        is_finalized: true,
        date: attendance.date,
        present_count: attendance.records.filter(r => r.status === 'present').length,
        absent_count: attendance.records.filter(r => r.status === 'absent').length,
        total_students: attendance.records.length
      }
    });

  } catch (error) {
    console.error("Finalize attendance error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to finalize attendance"
    });
  }
};

/**
 * Get attendance history for a class
 */
const getClassAttendanceHistory = async (req, res) => {
  try {
    const { classId } = req.params;
    const { startDate, endDate, limit = 50 } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    // Build query
    const query = { class: classId };
    if (Object.keys(dateFilter).length > 0) {
      query.date = dateFilter;
    }

    // Get attendance records
    const attendanceRecords = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .populate('teacher', '_id name')
      .lean(); // Use lean for better performance

    // Calculate stats for each record
    const recordsWithStats = attendanceRecords.map(record => ({
      ...record,
      present_count: record.records.filter(r => r.status === 'present').length,
      absent_count: record.records.filter(r => r.status === 'absent').length,
      total_students: record.records.length
    }));

    // Calculate overall stats
    const totalRecords = recordsWithStats.length;
    const totalPresent = recordsWithStats.reduce((sum, record) => sum + record.present_count, 0);
    const totalStudents = recordsWithStats.reduce((sum, record) => sum + record.total_students, 0);
    const averageAttendance = totalRecords > 0 ? (totalPresent / totalStudents) * 100 : 0;

    res.json({
      success: true,
      data: {
        records: recordsWithStats,
        stats: {
          total_records: totalRecords,
          total_present: totalPresent,
          total_students: totalStudents,
          average_attendance: averageAttendance.toFixed(2)
        }
      }
    });

  } catch (error) {
    console.error("Get class attendance history error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch attendance history"
    });
  }
};

/**
 * Get student attendance summary
 */
const getStudentAttendanceSummary = async (req, res) => {
  try {
    const { studentId, classId } = req.params;
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = { class: classId };
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    // Get all attendance records for this class
    const attendanceRecords = await Attendance.find(dateFilter)
      .sort({ date: -1 })
      .lean();

    // Extract this student's attendance from each record
    const studentAttendance = attendanceRecords.map(record => {
      const studentRecord = record.records.find(
        r => r.student.toString() === studentId
      );
      
      return {
        date: record.date,
        status: studentRecord?.status || "absent",
        method: record.method,
        marked_by: studentRecord?.marked_by || "manual",
        confidence: studentRecord?.confidence,
        is_finalized: record.is_finalized
      };
    }).filter(record => record.status); // Remove null entries

    // Calculate stats
    const totalDays = studentAttendance.length;
    const presentDays = studentAttendance.filter(a => a.status === 'present').length;
    const absentDays = studentAttendance.filter(a => a.status === 'absent').length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    // Get student info
    const student = await Student.findById(studentId).select('name roll_no');

    res.json({
      success: true,
      data: {
        student: {
          _id: studentId,
          name: student?.name,
          roll_no: student?.roll_no
        },
        attendance: studentAttendance,
        summary: {
          total_days: totalDays,
          present_days: presentDays,
          absent_days: absentDays,
          attendance_percentage: attendancePercentage.toFixed(2)
        }
      }
    });

  } catch (error) {
    console.error("Get student attendance summary error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch student attendance"
    });
  }
};

const getStudentAttendanceDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).select(
      "name roll_no email department year photo_url status"
    );

    console.log("Fetching attendance details for student:", studentId, "Student found:", !!student);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const attendanceDocs = await Attendance.find({
      "records.student": studentId,
    })
      .populate("class", "name class_name section department")
      .populate("teacher", "name email")
      .sort({ date: -1 });

    const attendanceDetails = attendanceDocs.map((attendance) => {
      const record = attendance.records.find(
        (r) => r.student.toString() === studentId
      );

      return {
        attendance_id: attendance._id,
        class: attendance.class,
        teacher: attendance.teacher,
        date: attendance.date,

        status: record?.status || "absent",
        marked_by: record?.marked_by || null,
        confidence: record?.confidence || null,
        marked_at: record?.marked_at || null,

        method: attendance.method,
        images_count: attendance.images_used?.length || 0,
        is_finalized: attendance.is_finalized,

        created_at: attendance.created_at,
        updated_at: attendance.updated_at,
      };
    });

    const totalDays = attendanceDetails.length;

    const presentDays = attendanceDetails.filter(
      (item) => item.status === "present"
    ).length;

    const absentDays = attendanceDetails.filter(
      (item) => item.status === "absent"
    ).length;

    const attendancePercentage =
      totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        student,
        summary: {
          total_days: totalDays,
          present_days: presentDays,
          absent_days: absentDays,
          attendance_percentage: attendancePercentage,
        },
        attendance: attendanceDetails,
      },
    });
  } catch (error) {
    console.log("Get student attendance details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get student attendance details",
      error: error.message,
    });
  }
};

module.exports = {
  getClassAttendance,
  createManualAttendance,
  createImageAttendance,
  updateStudentStatus,
  finalizeAttendance,
  getClassAttendanceHistory,
  getStudentAttendanceSummary,
  getStudentAttendanceDetails,
};  