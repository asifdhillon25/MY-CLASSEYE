// controllers/studentController.js
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Student = require("../models/student.model");
const User = require("../models/user.model");
const Class = require("../models/class.model");
const Attendance = require("../models/attendance.model");
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

// Get calculated dashboard data for a student
const getStudentDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const timeframe = ["day", "week", "month", "year"].includes(
      req.query.timeframe,
    )
      ? req.query.timeframe
      : "week";

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid student ID", 400));
    }

    const student = await Student.findById(id).lean();
    if (!student) {
      return next(new AppError("Student not found", 404));
    }

    const enrolledClassIds = student.classes_enrolled || [];
    const classes = await Class.find({
      $or: [{ students: id }, { _id: { $in: enrolledClassIds } }],
    })
      .select(
        "class_code course_name subject_code teacher schedule semester room created_at",
      )
      .populate("teacher", "name email department designation photo_url")
      .lean();

    const attendanceDocuments = await Attendance.find({
      "records.student": id,
    })
      .populate("class", "class_code course_name subject_code room semester")
      .populate("teacher", "name email department designation")
      .sort({ date: 1 })
      .lean();

    const attendance = attendanceDocuments.map((document) => {
      const studentRecord = document.records.find(
        (record) => record.student.toString() === id,
      );

      return {
        attendance_id: document._id,
        class: document.class,
        teacher: document.teacher,
        date: document.date,
        status: studentRecord.status,
        marked_by: studentRecord.marked_by,
        confidence: studentRecord.confidence,
        marked_at: studentRecord.marked_at,
        method: document.method,
        is_finalized: document.is_finalized,
      };
    });

    const now = req.query.date ? new Date(req.query.date) : new Date();
    if (Number.isNaN(now.getTime())) {
      return next(new AppError("Invalid date", 400));
    }

    const periodStart = new Date(now);
    periodStart.setHours(0, 0, 0, 0);

    if (timeframe === "week") {
      const day = periodStart.getDay();
      periodStart.setDate(periodStart.getDate() - (day === 0 ? 6 : day - 1));
    } else if (timeframe === "month") {
      periodStart.setDate(1);
    } else if (timeframe === "year") {
      periodStart.setMonth(0, 1);
    }

    const periodEnd = new Date(now);
    const previousPeriodEnd = new Date(periodStart.getTime() - 1);
    const previousPeriodStart = new Date(periodStart);

    if (timeframe === "day") {
      previousPeriodStart.setDate(previousPeriodStart.getDate() - 1);
    } else if (timeframe === "week") {
      previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
    } else if (timeframe === "month") {
      previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1, 1);
    } else {
      previousPeriodStart.setFullYear(previousPeriodStart.getFullYear() - 1, 0, 1);
    }

    const inRange = (item, start, end) => {
      const date = new Date(item.date);
      return date >= start && date <= end;
    };

    const selectedAttendance = attendance.filter((item) =>
      inRange(item, periodStart, periodEnd),
    );
    const previousAttendance = attendance.filter((item) =>
      inRange(item, previousPeriodStart, previousPeriodEnd),
    );

    const calculateSummary = (records) => {
      const total = records.length;
      const present = records.filter((item) => item.status === "present").length;
      const absent = records.filter((item) => item.status === "absent").length;

      return {
        total,
        present,
        absent,
        percentage: total ? Number(((present / total) * 100).toFixed(2)) : 0,
      };
    };

    const overallSummary = calculateSummary(attendance);
    const selectedSummary = calculateSummary(selectedAttendance);
    const previousSummary = calculateSummary(previousAttendance);

    let currentStreak = 0;
    for (let index = attendance.length - 1; index >= 0; index -= 1) {
      if (attendance[index].status !== "present") break;
      currentStreak += 1;
    }

    let longestStreak = 0;
    let runningStreak = 0;
    attendance.forEach((item) => {
      runningStreak = item.status === "present" ? runningStreak + 1 : 0;
      longestStreak = Math.max(longestStreak, runningStreak);
    });

    const targetPercentage = 75;
    const attendanceNeeded =
      overallSummary.percentage >= targetPercentage
        ? 0
        : Math.ceil(
            (targetPercentage * overallSummary.total -
              100 * overallSummary.present) /
              (100 - targetPercentage),
          );

    const attendanceByClass = classes.map((classItem) => {
      const records = attendance.filter(
        (item) => item.class?._id?.toString() === classItem._id.toString(),
      );
      const summary = calculateSummary(records);
      const latest = records[records.length - 1] || null;

      let consecutiveAbsences = 0;
      for (let index = records.length - 1; index >= 0; index -= 1) {
        if (records[index].status !== "absent") break;
        consecutiveAbsences += 1;
      }

      return {
        class: classItem,
        summary,
        latest_status: latest?.status || null,
        latest_date: latest?.date || null,
        consecutive_absences: consecutiveAbsences,
        below_target:
          summary.total > 0 && summary.percentage < targetPercentage,
      };
    });

    const trendMap = selectedAttendance.reduce((trend, item) => {
      const date = new Date(item.date).toISOString().split("T")[0];
      if (!trend[date]) trend[date] = { date, present: 0, absent: 0, total: 0 };
      trend[date][item.status] += 1;
      trend[date].total += 1;
      return trend;
    }, {});

    const attendanceTrend = Object.values(trendMap).map((point) => ({
      ...point,
      percentage: Number(((point.present / point.total) * 100).toFixed(2)),
    }));

    const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
    const todaySchedule = classes
      .flatMap((classItem) =>
        (classItem.schedule || [])
          .filter((slot) => slot.day === weekday)
          .map((slot) => {
            const todayAttendance = attendance.find(
              (item) =>
                item.class?._id?.toString() === classItem._id.toString() &&
                new Date(item.date).toDateString() === now.toDateString(),
            );

            return {
              class_id: classItem._id,
              class_code: classItem.class_code,
              course_name: classItem.course_name,
              subject_code: classItem.subject_code,
              room: classItem.room,
              teacher: classItem.teacher,
              start_time: slot.start_time,
              end_time: slot.end_time,
              attendance_status: todayAttendance?.status || null,
              attendance_recorded: Boolean(todayAttendance),
            };
          }),
      )
      .sort((first, second) => first.start_time.localeCompare(second.start_time));

    const teachers = new Set(
      classes.map((classItem) => classItem.teacher?._id?.toString()).filter(Boolean),
    );
    const coursesBelowTarget = attendanceByClass.filter(
      (item) => item.below_target,
    );

    const insights = [];
    if (overallSummary.total === 0) {
      insights.push("No attendance has been recorded yet.");
    } else if (overallSummary.percentage < targetPercentage) {
      insights.push(
        `Attend the next ${attendanceNeeded} classes to reach ${targetPercentage}% attendance.`,
      );
    } else {
      insights.push(
        `Your overall attendance is ${overallSummary.percentage}%, above the ${targetPercentage}% target.`,
      );
    }
    if (currentStreak >= 2) {
      insights.push(`You are currently on a ${currentStreak}-class present streak.`);
    }
    if (coursesBelowTarget.length) {
      insights.push(
        `${coursesBelowTarget.length} course${coursesBelowTarget.length > 1 ? "s are" : " is"} below the attendance target.`,
      );
    }
    if (todaySchedule.length) {
      insights.push(
        `You have ${todaySchedule.length} class${todaySchedule.length > 1 ? "es" : ""} scheduled today.`,
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        student: {
          _id: student._id,
          name: student.name,
          roll_no: student.roll_no,
          email: student.email,
          department: student.department,
          year: student.year,
          semester: student.semester,
          photo_url: student.photo_url,
          status: student.status,
        },
        timeframe: {
          selected: timeframe,
          start: periodStart,
          end: periodEnd,
        },
        summary: {
          enrolled_classes: classes.length,
          teachers: teachers.size,
          classes_today: todaySchedule.length,
          current_present_streak: currentStreak,
          longest_present_streak: longestStreak,
          courses_below_target: coursesBelowTarget.length,
        },
        attendance_overview: {
          overall: overallSummary,
          selected_period: selectedSummary,
          previous_period: previousSummary,
          percentage_change: Number(
            (selectedSummary.percentage - previousSummary.percentage).toFixed(2),
          ),
          target_percentage: targetPercentage,
          classes_needed_for_target: Math.max(0, attendanceNeeded),
        },
        attendance_by_class: attendanceByClass,
        attendance_trend: attendanceTrend,
        recent_attendance: attendance.slice(-10).reverse(),
        today_schedule: todaySchedule,
        insights,
      },
    });
  } catch (error) {
    next(error);
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
  getStudentDashboard,
};
