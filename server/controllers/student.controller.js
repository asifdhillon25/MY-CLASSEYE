// controllers/studentController.js
const bcrypt = require("bcryptjs");
const Student = require("../models/student.model");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const generatePrefixedId = require("./helpers/generatePrefixedId");

// Utility to generate email based on roll_no
function generateEmail(roll_no) {
  return `${roll_no.toLowerCase()}@edu.pk`;
}

async function createStudent(req, res, next) {
  try {
    const { name, department, year } = req.body;

    if (!name || !department || !year) {
      return next(new AppError("Name, department, year are required", 400));
    }

    // 1. Generate roll_no & email
    const roll_no = await generatePrefixedId("student_roll_no", "S");
    const email = generateEmail(roll_no);

    // 2. Hash default password (roll_no)
    const password_hash = await bcrypt.hash(roll_no, 12);

    // 3. Create Student
    const student = await Student.create({
      name,
      roll_no,
      email,
      department,
      year,
      status: "active",
    });

    // 4. Create corresponding User
    const user = await User.create({
      username: roll_no,
      email,
      password_hash,
      role: "student",
      linked_id: student._id,
    });

    console.log("Created student and user:", { student, user });

    res.status(201).json({
      status: "success",
      data: {
        student,
        credentials: {
          username: roll_no,
          email,
          default_password: roll_no, // optionally return once
        },
      },
    });
  } catch (err) {
    next(err);
  }
}
// Create a new student

// Get all students (optional ?status=active/inactive)
async function getStudents(req, res, next) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const students = await Student.find();
    res.status(200).json({
      status: "success",
      results: students.length,
      data: { students },
    });
  } catch (err) {
    next(err);
  }
}

// Get student by ID
async function getStudentById(req, res, next) {
  try {
    const id = req.params.id;
    const student = await Student.findById(id);

    if (!student) return next(new AppError("Student not found", 404));
    res.status(200).json({ status: "success", data: { student } });
  } catch (err) {
    next(err);
  }
}

// Update student by ID
// async function updateStudent(req, res, next) {
//   try {
//     const { student_id, roll_no, email } = req.body;

//     // Check if unique fields are being updated
//     if (student_id || roll_no || email) {
//       const existingStudent = await Student.findOne({
//         _id: { $ne: req.params.id },
//         $or: [{ student_id }, { roll_no }, { email }],
//       });
//       if (existingStudent) {
//         return next(
//           new AppError(
//             "Student with given student_id, roll_no, or email already exists",
//             400,
//           ),
//         );
//       }
//     }

//     const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!student) return next(new AppError("Student not found", 404));
//     res.status(200).json({ status: "success", data: { student } });
//   } catch (err) {
//     next(err);
//   }
// }

async function updateStudent(req, res, next) {
  try {
    const { roll_no, email } = req.body;

    const orConditions = [];

    if (roll_no) orConditions.push({ roll_no });
    if (email) orConditions.push({ email });

    if (orConditions.length > 0) {
      const existingStudent = await Student.findOne({
        _id: { $ne: req.params.id }, // exclude current student
        $or: orConditions,
      });

      if (existingStudent) {
        return next(
          new AppError(
            "Student with given roll_no or email already exists",
            400,
          ),
        );
      }
    }

    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return next(new AppError("Student not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { student },
    });
  } catch (err) {
    next(err);
  }
}

// Delete student by ID
async function deleteStudent(req, res, next) {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return next(new AppError("Student not found", 404));
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    next(err);
  }
}

// Get students by department
async function getStudentsByDepartment(req, res, next) {
  try {
    const { department } = req.params;
    const students = await Student.find({ department }).populate(
      "classes_enrolled",
    );
    res.status(200).json({
      status: "success",
      results: students.length,
      data: { students },
    });
  } catch (err) {
    next(err);
  }
}

// Update student's photo URL
const updateStudentPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { photo_url } = req.body;
    console.log("Updating photo for student ID:", id, "with URL:", photo_url);

    if (!photo_url) {
      return next(new AppError("photo_url is required", 400));
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { photo_url },
      { new: true, runValidators: true },
    );

    if (!student) {
      return next(new AppError("Student not found", 404));
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentsByDepartment,
  updateStudentPhoto,
};
