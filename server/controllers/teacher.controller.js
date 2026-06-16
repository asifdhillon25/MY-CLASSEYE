// controllers/teacherController.js
const Teacher = require("../models/teacher.model");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const generatePrefixedId = require("./helpers/generatePrefixedId");




// Utility to generate teacher email
function generateTeacherEmail(teacher_id) {
  return `${teacher_id.toLowerCase()}@edu.pk`;
}


// Create a new teacher
async function createTeacher(req, res, next) {
  try {
    const {
      name,
      department,
      designation,
      phone,
     
    } = req.body;
console.log(req.body);
    // Validate required fields
    if (!name || !department) {
      return next(new AppError("Name and department are required", 400));
    }

    // 1. Generate teacher_id & email
    const teacher_id = await generatePrefixedId("teacher_id", "T");
    const email = generateTeacherEmail(teacher_id);

    // 2. Hash default password (teacher_id)
    const password_hash = await bcrypt.hash(teacher_id, 12);

    console.log("Generated:", { teacher_id, email, password_hash ,department,designation,phone  });

    // 3. Create Teacher
    const teacher = await Teacher.create({
      name,
      teacher_id,
      email,
      department,
      designation,
      phone,
  
     
      status: "active",
    });

    console.log("Teacher created:", teacher);

    // 4. Create corresponding User
    const user = await User.create({
      username: teacher_id,
      email,
      password_hash,
      role: "teacher",
      linked_id: teacher._id,
    });

    console.log("Created teacher and user:", { teacher, user });

    res.status(201).json({
      status: "success",
      data: {
        teacher,
        credentials: {
          username: teacher_id,
          email,
          default_password: teacher_id, // return once, same as student
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

// Get all teachers (optional ?status=active/inactive)
async function getTeachers(req, res, next) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const teachers = await Teacher.find();
    res.status(200).json({
      status: "success",
      results: teachers.length,
      data: { teachers },
    });
  } catch (err) {
    next(err);
  }
}

// Get teacher by ID
async function getTeacherById(req, res, next) {
  try {
    const teacher = await Teacher.findById(req.params.id).populate("classes_assigned");
    if (!teacher) return next(new AppError("Teacher not found", 404));
    res.status(200).json({ status: "success", data: { teacher } });
  } catch (err) {
    next(err);
  }
}

// Update teacher by ID
async function updateTeacher(req, res, next) {
  try {
    const { name, email, department } = req.body;

    // Optional: Validate required fields if provided
    if (email) {
      const existingTeacher = await Teacher.findOne({ email, _id: { $ne: req.params.id } });
      if (existingTeacher) return next(new AppError("Email already exists", 400));
    }

    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!teacher) return next(new AppError("Teacher not found", 404));
    res.status(200).json({ status: "success", data: { teacher } });
  } catch (err) {
    next(err);
  }
}

// Delete teacher by ID
async function deleteTeacher(req, res, next) {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return next(new AppError("Teacher not found", 404));
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
