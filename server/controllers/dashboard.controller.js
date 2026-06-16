const User = require("../models/user.model");
const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const Class = require("../models/class.model");
const Attendance = require("../models/attendance.model");

const getDashboardOverview = async (req, res, next) => {
  try {
    const now = new Date();

    // ---------- DATE HELPERS ----------
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const startOfThisMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const startOfLastWeek = new Date(now);
    startOfLastWeek.setDate(now.getDate() - 7);

    // ---------- TOP KPIs ----------
    const [
      totalStudents,
      totalTeachers,
      totalClasses,
    ] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Class.countDocuments(),
    ]);

    const activeClasses = await Class.countDocuments({
      teacher: { $ne: null },
      students: { $exists: true, $not: { $size: 0 } },
    });

    // ---------- ATTENDANCE TODAY ----------
    // Get attendance for today and count present records
    const attendanceToday = await Attendance.findOne({
      date: { $gte: startOfToday }
    });

    let attendanceTodayPercent = 0;
    if (attendanceToday && attendanceToday.records.length > 0) {
      const presentToday = attendanceToday.records.filter(r => r.status === "present").length;
      attendanceTodayPercent = Math.round((presentToday / attendanceToday.records.length) * 100);
    }

    // ---------- TRENDS ----------
    const [
      attendanceLast7Days,
      newStudentsThisMonth,
      newTeachersThisMonth,
    ] = await Promise.all([
      Attendance.countDocuments({ date: { $gte: startOfLastWeek } }),
      Student.countDocuments({ created_at: { $gte: startOfThisMonth } }),
      Teacher.countDocuments({ join_date: { $gte: startOfThisMonth } }),
    ]);

    // ---------- RISK METRICS ----------
    // Get all attendance records from the last 14 days
    const attendanceFromLast14Days = await Attendance.find({
      date: { $gte: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) }
    });

    // Create a map to track student attendance
    const studentAttendanceMap = new Map();
    
    attendanceFromLast14Days.forEach(attendance => {
      attendance.records.forEach(record => {
        const studentId = record.student.toString();
        if (!studentAttendanceMap.has(studentId)) {
          studentAttendanceMap.set(studentId, {
            total: 0,
            present: 0,
            lastSeen: attendance.date
          });
        }
        
        const stats = studentAttendanceMap.get(studentId);
        stats.total++;
        if (record.status === "present") {
          stats.present++;
        }
        if (attendance.date > stats.lastSeen) {
          stats.lastSeen = attendance.date;
        }
      });
    });

    // Calculate at-risk and inactive students
    let atRiskStudents = 0;
    let inactiveStudents = 0;
    
    studentAttendanceMap.forEach(stats => {
      const attendanceRate = stats.total === 0 ? 0 : (stats.present / stats.total) * 100;
      
      if (attendanceRate < 75) {
        atRiskStudents++;
      }
      
      const diffDays = (now - stats.lastSeen) / (1000 * 60 * 60 * 24);
      if (diffDays > 14) {
        inactiveStudents++;
      }
    });

    // Count classes without attendance this week
    const classesWithAttendanceThisWeek = await Attendance.distinct("class", {
      date: { $gte: startOfLastWeek }
    });

    const classesWithoutAttendanceThisWeek = await Class.countDocuments({
      _id: { $nin: classesWithAttendanceThisWeek }
    });

    // ---------- AI / SYSTEM SANITY ----------
    const studentsWithEmbeddings = await Student.countDocuments({
      has_embeddings: true
    });

    const imageAttendanceCount = await Attendance.countDocuments({
      method: "image"
    });

    const manualAttendanceCount = await Attendance.countDocuments({
      method: "manual"
    });

    const mixedAttendanceCount = await Attendance.countDocuments({
      method: "mixed"
    });

    const totalAttendance = imageAttendanceCount + manualAttendanceCount + mixedAttendanceCount;

    const imageAttendanceRatio =
      totalAttendance === 0
        ? 0
        : Math.round((imageAttendanceCount / totalAttendance) * 100);

    // ---------- RESPONSE ----------
    res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalStudents,
          totalTeachers,
          activeClasses,
          attendanceTodayPercent,
        },

        trends: {
          attendanceLast7Days,
          newStudentsThisMonth,
          newTeachersThisMonth,
        },

        risks: {
          atRiskStudents,
          inactiveStudents,
          classesWithoutAttendanceThisWeek,
        },

        aiUsage: {
          embeddingCoveragePercent:
            totalStudents === 0
              ? 0
              : Math.round(
                  (studentsWithEmbeddings / totalStudents) * 100
                ),
          imageAttendanceRatio,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardOverview,
};