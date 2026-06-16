// routes/teacherRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacher.controller");

// Create a new teacher
router.post("/", createTeacher);

// Get all teachers (optional ?status=active/inactive)
router.get("/", getTeachers);

// Get a single teacher by ID
router.get("/:id", getTeacherById);

// Update a teacher by ID
router.put("/:id", updateTeacher);

// Delete a teacher by ID
router.delete("/:id", deleteTeacher);

module.exports = router;
