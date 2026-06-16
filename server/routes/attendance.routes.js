const express = require("express");
const router = express.Router();
const { getClassAttendance,
  createManualAttendance,
  createImageAttendance,
  updateStudentStatus,
  finalizeAttendance,
  getClassAttendanceHistory,
  getStudentAttendanceSummary,
  getStudentAttendanceDetails,} = require("../controllers/attendance.controller");
const upload = require("../middleware/uploadMiddleware");

// Get attendance for a class on specific date
router.get("/class/:classId/:date", getClassAttendance);
// Create/update manual attendance
router.post("/manual/:classId", createManualAttendance);

// Create/update image-based attendance
router.post("/auto/:classId", 
  upload.array('images', 10), // Max 10 images
  createImageAttendance
);

// Update individual student status
router.patch("/:attendanceId/student/:studentId", updateStudentStatus);
// Finalize attendance
router.post("/:attendanceId/finalize", finalizeAttendance);

// Get attendance history for a class
router.get("/history/class/:classId", getClassAttendanceHistory);

// Get student attendance summary
router.get("/history/student/:studentId/class/:classId", getStudentAttendanceSummary);

//student attendance details (all records)
router.get("/student/:studentId/details", getStudentAttendanceDetails);

module.exports = router;