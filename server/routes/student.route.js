const express = require("express");
const router = express.Router();
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentsByDepartment,updateStudentPhoto,
} = require("../controllers/student.controller");

// Create a new student
router.post("/", createStudent);

// Get all students (optional ?status=active/inactive)
router.get("/", getStudents);

// Get a single student by ID
router.get("/:id", getStudentById);

// Update a student by ID
router.put("/:id", updateStudent);

// Delete a student by ID
router.delete("/:id", deleteStudent);

// Get students by department
router.get("/department/:department", getStudentsByDepartment);
// Update student photo URL
router.patch("/photo/:id", updateStudentPhoto);

module.exports = router;
