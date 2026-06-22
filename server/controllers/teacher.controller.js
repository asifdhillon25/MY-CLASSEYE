// controllers/teacherController.js
const Teacher = require("../models/teacher.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Class = require("../models/class.model");
const Attendance = require("../models/attendance.model");
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

// Get calculated dashboard data for a teacher
async function getTeacherDashboard(req, res, next) {
  try {
    const { id } = req.params;
    const { classId } = req.query;
    const timeframe = ["day", "week", "month", "year"].includes(
      req.query.timeframe,
    )
      ? req.query.timeframe
      : "week";

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid teacher ID", 400));
    }

    if (classId && !mongoose.Types.ObjectId.isValid(classId)) {
      return next(new AppError("Invalid class ID", 400));
    }

    const teacher = await Teacher.findById(id).lean();
    if (!teacher) {
      return next(new AppError("Teacher not found", 404));
    }

    const assignedClassIds = teacher.classes_assigned || [];
    const classes = await Class.find({
      $or: [{ teacher: id }, { _id: { $in: assignedClassIds } }],
    })
      .select(
        "class_code course_name subject_code teacher students schedule semester room created_at",
      )
      .populate(
        "students",
        "name roll_no email department year photo_url status has_embeddings embeddings_updated_at",
      )
      .lean();

    if (
      classId &&
      !classes.some((classItem) => classItem._id.toString() === classId)
    ) {
      return next(new AppError("Class is not assigned to this teacher", 404));
    }

    const scopedClasses = classId
      ? classes.filter((classItem) => classItem._id.toString() === classId)
      : classes;
    const scopedClassIds = scopedClasses.map((classItem) => classItem._id);

    const attendance = await Attendance.find({
      class: { $in: scopedClassIds },
    })
      .populate("class", "class_code course_name subject_code room semester")
      .sort({ date: 1 })
      .lean();

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
      previousPeriodStart.setFullYear(
        previousPeriodStart.getFullYear() - 1,
        0,
        1,
      );
    }

    const isInRange = (document, start, end) => {
      const date = new Date(document.date);
      return date >= start && date <= end;
    };

    const selectedAttendance = attendance.filter((document) =>
      isInRange(document, periodStart, periodEnd),
    );
    const previousAttendance = attendance.filter((document) =>
      isInRange(document, previousPeriodStart, previousPeriodEnd),
    );

    const calculateAttendance = (documents) => {
      let present = 0;
      let absent = 0;

      documents.forEach((document) => {
        document.records.forEach((record) => {
          if (record.status === "present") present += 1;
          if (record.status === "absent") absent += 1;
        });
      });

      const total = present + absent;
      return {
        sessions: documents.length,
        total_records: total,
        present,
        absent,
        percentage: total
          ? Number(((present / total) * 100).toFixed(2))
          : 0,
        finalized_sessions: documents.filter(
          (document) => document.is_finalized,
        ).length,
        draft_sessions: documents.filter(
          (document) => !document.is_finalized,
        ).length,
      };
    };

    const overallAttendance = calculateAttendance(attendance);
    const selectedSummary = calculateAttendance(selectedAttendance);
    const previousSummary = calculateAttendance(previousAttendance);
    const attendanceTarget = 75;

    const allStudents = new Map();
    scopedClasses.forEach((classItem) => {
      classItem.students.forEach((student) => {
        allStudents.set(student._id.toString(), student);
      });
    });

    const getStudentRecords = (studentId, documents = attendance) => {
      const records = [];
      documents.forEach((document) => {
        const record = document.records.find(
          (item) => item.student.toString() === studentId,
        );
        if (record) {
          records.push({
            attendance_id: document._id,
            class: document.class,
            date: document.date,
            is_finalized: document.is_finalized,
            status: record.status,
            marked_by: record.marked_by,
            confidence: record.confidence,
            marked_at: record.marked_at,
          });
        }
      });
      return records;
    };

    const studentAttendance = Array.from(allStudents.values()).map(
      (student) => {
        const records = getStudentRecords(student._id.toString());
        const selectedRecords = records.filter((record) =>
          isInRange(record, periodStart, periodEnd),
        );
        const total = selectedRecords.length;
        const present = selectedRecords.filter(
          (record) => record.status === "present",
        ).length;
        const absent = selectedRecords.filter(
          (record) => record.status === "absent",
        ).length;
        const percentage = total
          ? Number(((present / total) * 100).toFixed(2))
          : 0;

        let consecutiveAbsences = 0;
        for (let index = records.length - 1; index >= 0; index -= 1) {
          if (records[index].status !== "absent") break;
          consecutiveAbsences += 1;
        }

        const latest = records[records.length - 1] || null;

        return {
          student,
          summary: { total, present, absent, percentage },
          latest_status: latest?.status || null,
          latest_date: latest?.date || null,
          consecutive_absences: consecutiveAbsences,
          risk_level:
            total === 0
              ? "no_data"
              : percentage < 60 || consecutiveAbsences >= 3
                ? "critical"
                : percentage < attendanceTarget
                  ? "at_risk"
                  : percentage < 85
                    ? "watch"
                    : "good",
        };
      },
    );

    const classSummaries = scopedClasses.map((classItem) => {
      const classAttendance = attendance.filter(
        (document) =>
          document.class?._id?.toString() === classItem._id.toString(),
      );
      const selectedClassAttendance = classAttendance.filter((document) =>
        isInRange(document, periodStart, periodEnd),
      );
      const atRiskStudents = classItem.students.filter((student) => {
        let present = 0;
        let total = 0;

        selectedClassAttendance.forEach((document) => {
          const record = document.records.find(
            (item) => item.student.toString() === student._id.toString(),
          );
          if (record) {
            total += 1;
            if (record.status === "present") present += 1;
          }
        });

        return total > 0 && (present / total) * 100 < attendanceTarget;
      }).length;

      return {
        _id: classItem._id,
        class_code: classItem.class_code,
        course_name: classItem.course_name,
        subject_code: classItem.subject_code,
        schedule: classItem.schedule,
        semester: classItem.semester,
        room: classItem.room,
        student_count: classItem.students.length,
        students_with_embeddings: classItem.students.filter(
          (student) => student.has_embeddings,
        ).length,
        students_without_embeddings: classItem.students.filter(
          (student) => !student.has_embeddings,
        ).length,
        at_risk_students: atRiskStudents,
        overall_attendance: calculateAttendance(classAttendance),
        selected_period_attendance: calculateAttendance(
          selectedClassAttendance,
        ),
        latest_attendance:
          classAttendance[classAttendance.length - 1] || null,
      };
    });

    const trendMap = selectedAttendance.reduce((trend, document) => {
      const date = new Date(document.date).toISOString().split("T")[0];
      if (!trend[date]) {
        trend[date] = { date, sessions: 0, present: 0, absent: 0, total: 0 };
      }

      trend[date].sessions += 1;
      document.records.forEach((record) => {
        trend[date][record.status] += 1;
        trend[date].total += 1;
      });
      return trend;
    }, {});

    const attendanceTrend = Object.values(trendMap).map((point) => ({
      ...point,
      percentage: point.total
        ? Number(((point.present / point.total) * 100).toFixed(2))
        : 0,
    }));

    const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const todayAttendance = attendance.filter((document) => {
      const date = new Date(document.date);
      return date >= todayStart && date < todayEnd;
    });

    const todaySchedule = scopedClasses
      .flatMap((classItem) =>
        (classItem.schedule || [])
          .filter((slot) => slot.day === weekday)
          .map((slot) => {
            const attendanceDocument = todayAttendance.find(
              (document) =>
                document.class?._id?.toString() === classItem._id.toString(),
            );

            return {
              class_id: classItem._id,
              class_code: classItem.class_code,
              course_name: classItem.course_name,
              subject_code: classItem.subject_code,
              room: classItem.room,
              student_count: classItem.students.length,
              start_time: slot.start_time,
              end_time: slot.end_time,
              attendance_id: attendanceDocument?._id || null,
              attendance_recorded: Boolean(attendanceDocument),
              is_finalized: attendanceDocument?.is_finalized || false,
              attendance_summary: attendanceDocument
                ? calculateAttendance([attendanceDocument])
                : null,
            };
          }),
      )
      .sort((first, second) => first.start_time.localeCompare(second.start_time));

    const studentsWithoutEmbeddings = Array.from(allStudents.values()).filter(
      (student) => !student.has_embeddings,
    );
    const atRiskStudents = studentAttendance.filter((item) =>
      ["critical", "at_risk"].includes(item.risk_level),
    );
    const lowConfidenceRecords = attendance.reduce(
      (count, document) =>
        count +
        document.records.filter(
          (record) =>
            record.confidence !== null &&
            record.confidence !== undefined &&
            record.confidence < 0.7,
        ).length,
      0,
    );

    const methodUsage = attendance.reduce(
      (usage, document) => {
        usage[document.method] += 1;
        return usage;
      },
      { manual: 0, image: 0, mixed: 0 },
    );

    const actionItems = [];
    const missingToday = todaySchedule.filter(
      (item) => !item.attendance_recorded,
    );
    const draftSessions = attendance.filter(
      (document) => !document.is_finalized,
    );

    if (missingToday.length) {
      actionItems.push({
        type: "attendance",
        priority: "high",
        count: missingToday.length,
        message: `${missingToday.length} scheduled class${missingToday.length > 1 ? "es need" : " needs"} attendance today.`,
      });
    }
    if (draftSessions.length) {
      actionItems.push({
        type: "finalization",
        priority: "high",
        count: draftSessions.length,
        message: `${draftSessions.length} attendance session${draftSessions.length > 1 ? "s are" : " is"} awaiting finalization.`,
      });
    }
    if (atRiskStudents.length) {
      actionItems.push({
        type: "student_risk",
        priority: "medium",
        count: atRiskStudents.length,
        message: `${atRiskStudents.length} student${atRiskStudents.length > 1 ? "s are" : " is"} below the attendance target.`,
      });
    }
    if (studentsWithoutEmbeddings.length) {
      actionItems.push({
        type: "embeddings",
        priority: "medium",
        count: studentsWithoutEmbeddings.length,
        message: `${studentsWithoutEmbeddings.length} student${studentsWithoutEmbeddings.length > 1 ? "s need" : " needs"} face embeddings.`,
      });
    }
    if (lowConfidenceRecords) {
      actionItems.push({
        type: "recognition_review",
        priority: "low",
        count: lowConfidenceRecords,
        message: `${lowConfidenceRecords} low-confidence recognition record${lowConfidenceRecords > 1 ? "s need" : " needs"} review.`,
      });
    }

    const recentActivity = attendance
      .slice(-10)
      .reverse()
      .map((document) => ({
        attendance_id: document._id,
        class: document.class,
        date: document.date,
        method: document.method,
        is_finalized: document.is_finalized,
        images_count: document.images_used?.length || 0,
        summary: calculateAttendance([document]),
        created_at: document.created_at,
        updated_at: document.updated_at,
      }));

    res.status(200).json({
      status: "success",
      data: {
        teacher: {
          _id: teacher._id,
          teacher_id: teacher.teacher_id,
          name: teacher.name,
          email: teacher.email,
          department: teacher.department,
          designation: teacher.designation,
          phone: teacher.phone,
          photo_url: teacher.photo_url,
          join_date: teacher.join_date,
          status: teacher.status,
        },
        timeframe: {
          selected: timeframe,
          start: periodStart,
          end: periodEnd,
          selected_class_id: classId || null,
        },
        summary: {
          assigned_classes: classes.length,
          classes_in_current_view: scopedClasses.length,
          total_students: allStudents.size,
          classes_today: todaySchedule.length,
          at_risk_students: atRiskStudents.length,
          students_without_embeddings: studentsWithoutEmbeddings.length,
          draft_attendance_sessions: draftSessions.length,
        },
        available_classes: classes.map((classItem) => ({
          _id: classItem._id,
          class_code: classItem.class_code,
          course_name: classItem.course_name,
          subject_code: classItem.subject_code,
        })),
        attendance_overview: {
          overall: overallAttendance,
          selected_period: selectedSummary,
          previous_period: previousSummary,
          percentage_change: Number(
            (selectedSummary.percentage - previousSummary.percentage).toFixed(
              2,
            ),
          ),
          target_percentage: attendanceTarget,
          method_usage: methodUsage,
        },
        classes: classSummaries,
        today_schedule: todaySchedule,
        attendance_trend: attendanceTrend,
        student_attendance: studentAttendance.sort(
          (first, second) =>
            first.summary.percentage - second.summary.percentage,
        ),
        face_id_readiness: {
          total_students: allStudents.size,
          students_with_embeddings:
            allStudents.size - studentsWithoutEmbeddings.length,
          students_without_embeddings: studentsWithoutEmbeddings.length,
          coverage_percentage: allStudents.size
            ? Number(
                ((
                  (allStudents.size - studentsWithoutEmbeddings.length) /
                  allStudents.size
                ) *
                  100).toFixed(2),
              )
            : 0,
          low_confidence_records: lowConfidenceRecords,
        },
        action_items: actionItems,
        recent_activity: recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherDashboard,
};
