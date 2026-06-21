import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaArrowRight,
  FaBookOpen,
  FaBrain,
  FaCalendarAlt,
  FaCalendarCheck,
  FaCamera,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaGraduationCap,
  FaHistory,
  FaIdBadge,
  FaLightbulb,
  FaMapMarkerAlt,
  FaRedo,
  FaTimesCircle,
  FaUserEdit,
  FaUserTie,
} from "react-icons/fa";
import { useGetStudentDashboardQuery } from "../redux/features/students/studentApi";

const timeframes = ["day", "week", "month", "year"];

const formatDate = (date, options = {}) => {
  if (!date) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(new Date(date));
};

const formatTime = (time) => {
  if (!time) return "TBA";
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const getAttendanceTone = (percentage) => {
  if (percentage >= 85) return "text-green-600 dark:text-green-400";
  if (percentage >= 75) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
};

const StudentDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const user = useSelector((state) => state.auth.user);
  const studentId = user?.linked_id?._id || user?.linked_id;

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetStudentDashboardQuery(
    { id: studentId, timeframe: selectedTimeframe },
    { skip: !studentId },
  );

  const dashboard = response?.data;
  const student = dashboard?.student;
  const overview = dashboard?.attendance_overview;
  const summary = dashboard?.summary;
  const selectedAttendance = overview?.selected_period;
  const overallAttendance = overview?.overall;

  const bestCourse = useMemo(() => {
    const courses = dashboard?.attendance_by_class || [];
    return courses
      .filter((course) => course.summary.total > 0)
      .reduce(
        (best, course) =>
          !best || course.summary.percentage > best.summary.percentage
            ? course
            : best,
        null,
      );
  }, [dashboard?.attendance_by_class]);

  if (!studentId) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-800 dark:bg-amber-900/20">
        <FaExclamationTriangle className="mx-auto mb-4 text-3xl text-amber-500" />
        <h1 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
          Student profile is not linked
        </h1>
        <p className="mt-2 text-sm text-light-textSecondary dark:text-dark-textSecondary">
          This account does not contain a linked student ID. Please ask an
          administrator to connect the account to a student profile.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-light-border border-t-light-primary dark:border-dark-border dark:border-t-dark-primary" />
          <p className="mt-4 text-sm text-light-textSecondary dark:text-dark-textSecondary">
            Preparing your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
        <FaTimesCircle className="mx-auto mb-4 text-3xl text-red-500" />
        <h1 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
          We could not load your dashboard
        </h1>
        <p className="mt-2 text-sm text-light-textSecondary dark:text-dark-textSecondary">
          {error?.data?.message || "Please check the server and try again."}
        </p>
        <button
          type="button"
          onClick={refetch}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-light-primary px-5 py-2.5 font-medium text-white transition hover:bg-light-primaryHover dark:bg-dark-primary dark:hover:bg-dark-primaryHover"
        >
          <FaRedo /> Try again
        </button>
      </div>
    );
  }

  const stats = [
    {
      label: "Overall attendance",
      value: `${overallAttendance?.percentage || 0}%`,
      note: `${overallAttendance?.present || 0} of ${overallAttendance?.total || 0} classes`,
      icon: FaCalendarCheck,
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      label: "Enrolled courses",
      value: summary?.enrolled_classes || 0,
      note: `${summary?.teachers || 0} instructors`,
      icon: FaBookOpen,
      gradient: "from-blue-600 to-indigo-500",
    },
    {
      label: "Present streak",
      value: summary?.current_present_streak || 0,
      note: `Best streak: ${summary?.longest_present_streak || 0} classes`,
      icon: FaChartLine,
      gradient: "from-violet-500 to-fuchsia-500",
    },
    {
      label: "Needs attention",
      value: summary?.courses_below_target || 0,
      note: `Below ${overview?.target_percentage || 75}% target`,
      icon: FaExclamationTriangle,
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy via-blue-700 to-brand-teal p-5 text-white shadow-elevated sm:p-7 lg:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-brand-aqua/20 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10 shadow-xl">
              {student?.photo_url ? (
                <img
                  src={student.photo_url}
                  alt={student.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-bold">
                  {student?.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
              )}
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  Student workspace
                </span>
                <span className="rounded-full bg-green-400/20 px-3 py-1 text-xs font-medium text-green-100">
                  {student?.status || "active"}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Welcome back, {student?.name?.split(" ")[0] || "Student"}
              </h1>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-blue-50/90">
                <span className="flex items-center gap-2">
                  <FaIdBadge /> {student?.roll_no || "No roll number"}
                </span>
                <span className="flex items-center gap-2">
                  <FaGraduationCap /> {student?.department || "Department"}
                  {student?.semester ? ` · ${student.semester}` : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={`/app/students/${studentId}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-brand-navy shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <FaCamera /> Photo & Face ID
            </Link>
            <Link
              to={`/app/students/edit/${studentId}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              <FaUserEdit /> Edit details
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-light-border bg-light-surface p-4 shadow-card dark:border-dark-border dark:bg-dark-surface sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">
            Attendance period
          </p>
          <p className="text-xs text-light-textMuted dark:text-dark-textMuted">
            Compare your activity across different time ranges
          </p>
        </div>
        <div className="grid grid-cols-4 rounded-xl bg-light-surfaceMuted p-1 dark:bg-dark-surfaceMuted">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              type="button"
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition sm:px-5 sm:text-sm ${
                selectedTimeframe === timeframe
                  ? "bg-light-primary text-white shadow dark:bg-dark-primary"
                  : "text-light-textSecondary hover:text-light-textPrimary dark:text-dark-textSecondary dark:hover:text-dark-textPrimary"
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </section>

      <section className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 ${isFetching ? "opacity-70" : ""}`}>
        {stats.map(({ label, value, note, icon: Icon, gradient }) => (
          <article
            key={label}
            className="group rounded-2xl border border-light-border bg-light-surface p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-dark-border dark:bg-dark-surface"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
                  {label}
                </p>
                <p className="mt-2 text-3xl font-extrabold text-light-textPrimary dark:text-dark-textPrimary">
                  {value}
                </p>
                <p className="mt-2 text-xs text-light-textMuted dark:text-dark-textMuted">
                  {note}
                </p>
              </div>
              <div className={`rounded-xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg transition group-hover:scale-105`}>
                <Icon className="text-xl" />
              </div>
            </div>
          </article>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-light-border bg-light-surface p-5 shadow-card dark:border-dark-border dark:bg-dark-surface sm:p-6 xl:col-span-2">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                Attendance overview
              </h2>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                Your performance for this {selectedTimeframe}
              </p>
            </div>
            <div className={`text-3xl font-extrabold ${getAttendanceTone(selectedAttendance?.percentage || 0)}`}>
              {selectedAttendance?.percentage || 0}%
            </div>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-light-surfaceMuted dark:bg-dark-surfaceMuted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-light-primary to-light-accent transition-all duration-700 dark:from-dark-primary dark:to-dark-accent"
              style={{ width: `${Math.min(selectedAttendance?.percentage || 0, 100)}%` }}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
              <FaCheckCircle className="mb-2 text-green-500" />
              <p className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                {selectedAttendance?.present || 0}
              </p>
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Present</p>
            </div>
            <div className="rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
              <FaTimesCircle className="mb-2 text-red-500" />
              <p className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                {selectedAttendance?.absent || 0}
              </p>
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Absent</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
              <FaHistory className="mb-2 text-blue-500" />
              <p className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                {selectedAttendance?.total || 0}
              </p>
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Recorded</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
              <FaChartLine className="mb-2 text-amber-500" />
              <p className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                {(overview?.percentage_change || 0) > 0 ? "+" : ""}
                {overview?.percentage_change || 0}%
              </p>
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Period change</p>
            </div>
          </div>

          <div className="mt-6 border-t border-light-border pt-5 dark:border-dark-border">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">Daily trend</h3>
              <span className="text-xs text-light-textMuted dark:text-dark-textMuted">
                {formatDate(dashboard?.timeframe?.start)} – {formatDate(dashboard?.timeframe?.end)}
              </span>
            </div>
            {dashboard?.attendance_trend?.length ? (
              <div className="flex min-h-40 items-end gap-2 overflow-x-auto pb-2">
                {dashboard.attendance_trend.map((point) => (
                  <div key={point.date} className="flex min-w-14 flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-bold text-light-textPrimary dark:text-dark-textPrimary">
                      {point.percentage}%
                    </span>
                    <div className="flex h-24 w-full max-w-10 items-end overflow-hidden rounded-lg bg-light-surfaceMuted dark:bg-dark-surfaceMuted">
                      <div
                        className="w-full rounded-lg bg-gradient-to-t from-light-primary to-brand-aqua dark:from-dark-primary dark:to-dark-accent"
                        style={{ height: `${Math.max(point.percentage, 6)}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-light-textMuted dark:text-dark-textMuted">
                      {formatDate(point.date, { month: "short", day: "numeric", year: undefined })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-light-surfaceMuted py-10 text-center text-sm text-light-textMuted dark:bg-dark-surfaceMuted dark:text-dark-textMuted">
                No attendance was recorded during this period.
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl bg-gradient-to-br from-brand-navy to-brand-teal p-5 text-white shadow-card">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-3"><FaLightbulb /></div>
              <div>
                <h2 className="font-bold">Personal insights</h2>
                <p className="text-xs text-white/70">Based on your attendance</p>
              </div>
            </div>
            <div className="space-y-3">
              {(dashboard?.insights || []).map((insight) => (
                <div key={insight} className="rounded-xl bg-white/10 p-3 text-sm leading-6 backdrop-blur-sm">
                  {insight}
                </div>
              ))}
              {bestCourse && (
                <div className="rounded-xl bg-white/10 p-3 text-sm leading-6 backdrop-blur-sm">
                  Your strongest attendance is in {bestCourse.class.course_name} at {bestCourse.summary.percentage}%.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-light-border bg-light-surface p-5 shadow-card dark:border-dark-border dark:bg-dark-surface">
            <h2 className="font-bold text-light-textPrimary dark:text-dark-textPrimary">Student tools</h2>
            <p className="mt-1 text-xs text-light-textMuted dark:text-dark-textMuted">Manage your identity and account details</p>
            <div className="mt-4 space-y-2">
              <Link
                to={`/app/students/${studentId}`}
                className="group flex items-center justify-between rounded-xl bg-light-surfaceMuted p-3 transition hover:bg-light-accentSoft dark:bg-dark-surfaceMuted dark:hover:bg-dark-accentSoft"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                  <span className="rounded-lg bg-cyan-100 p-2 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"><FaCamera /></span>
                  Update profile photo
                </span>
                <FaArrowRight className="text-xs text-light-textMuted transition group-hover:translate-x-1 dark:text-dark-textMuted" />
              </Link>
              <Link
                to={`/app/students/${studentId}`}
                className="group flex items-center justify-between rounded-xl bg-light-surfaceMuted p-3 transition hover:bg-light-accentSoft dark:bg-dark-surfaceMuted dark:hover:bg-dark-accentSoft"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                  <span className="rounded-lg bg-violet-100 p-2 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"><FaBrain /></span>
                  Manage Face ID
                </span>
                <FaArrowRight className="text-xs text-light-textMuted transition group-hover:translate-x-1 dark:text-dark-textMuted" />
              </Link>
              <Link
                to={`/app/students/edit/${studentId}`}
                className="group flex items-center justify-between rounded-xl bg-light-surfaceMuted p-3 transition hover:bg-light-accentSoft dark:bg-dark-surfaceMuted dark:hover:bg-dark-accentSoft"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                  <span className="rounded-lg bg-blue-100 p-2 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"><FaUserEdit /></span>
                  Edit profile details
                </span>
                <FaArrowRight className="text-xs text-light-textMuted transition group-hover:translate-x-1 dark:text-dark-textMuted" />
              </Link>
            </div>
          </section>
        </aside>
      </div>

      <section className="rounded-2xl border border-light-border bg-light-surface p-5 shadow-card dark:border-dark-border dark:bg-dark-surface sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">Today&apos;s schedule</h2>
            <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
              {summary?.classes_today || 0} classes scheduled today
            </p>
          </div>
          <FaCalendarAlt className="text-2xl text-light-primary dark:text-dark-primary" />
        </div>
        {dashboard?.today_schedule?.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dashboard.today_schedule.map((period) => (
              <article key={`${period.class_id}-${period.start_time}`} className="relative overflow-hidden rounded-2xl border border-light-border bg-light-background p-4 dark:border-dark-border dark:bg-dark-background">
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-light-primary dark:text-dark-primary">{period.subject_code}</p>
                    <h3 className="mt-1 font-bold text-light-textPrimary dark:text-dark-textPrimary">{period.course_name}</h3>
                  </div>
                  {period.attendance_recorded && (
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${period.attendance_status === "present" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>
                      {period.attendance_status}
                    </span>
                  )}
                </div>
                <div className="mt-4 space-y-2 text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  <p className="flex items-center gap-2"><FaClock className="text-light-primary dark:text-dark-primary" /> {formatTime(period.start_time)} – {formatTime(period.end_time)}</p>
                  <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-light-primary dark:text-dark-primary" /> {period.room || "Room TBA"}</p>
                  <p className="flex items-center gap-2"><FaUserTie className="text-light-primary dark:text-dark-primary" /> {period.teacher?.name || "Instructor TBA"}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-light-surfaceMuted py-12 text-center dark:bg-dark-surfaceMuted">
            <FaCalendarCheck className="mx-auto text-3xl text-light-textMuted dark:text-dark-textMuted" />
            <p className="mt-3 font-medium text-light-textPrimary dark:text-dark-textPrimary">No classes scheduled today</p>
            <p className="mt-1 text-sm text-light-textMuted dark:text-dark-textMuted">Enjoy the open space in your calendar.</p>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-light-border bg-light-surface p-5 shadow-card dark:border-dark-border dark:bg-dark-surface sm:p-6 xl:col-span-2">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">Course attendance</h2>
            <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">See where you are doing well and where you need to recover</p>
          </div>
          <div className="space-y-3">
            {(dashboard?.attendance_by_class || []).map((course) => (
              <article key={course.class._id} className="rounded-xl border border-light-border p-4 dark:border-dark-border">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-bold text-light-textPrimary dark:text-dark-textPrimary">{course.class.course_name}</h3>
                      <span className="rounded-md bg-light-accentSoft px-2 py-1 text-xs font-medium text-light-accent dark:bg-dark-accentSoft dark:text-dark-accent">{course.class.subject_code}</span>
                      {course.below_target && <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">Needs attention</span>}
                    </div>
                    <p className="mt-1 text-xs text-light-textMuted dark:text-dark-textMuted">{course.class.teacher?.name || "Instructor TBA"} · {course.summary.present} present · {course.summary.absent} absent</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-light-surfaceMuted dark:bg-dark-surfaceMuted">
                      <div className="h-full rounded-full bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent" style={{ width: `${Math.min(course.summary.percentage, 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-5 sm:block sm:min-w-24 sm:text-right">
                    <p className={`text-2xl font-extrabold ${getAttendanceTone(course.summary.percentage)}`}>{course.summary.percentage}%</p>
                    <p className="text-xs text-light-textMuted dark:text-dark-textMuted">{course.summary.total} records</p>
                  </div>
                </div>
              </article>
            ))}
            {!dashboard?.attendance_by_class?.length && (
              <div className="rounded-xl bg-light-surfaceMuted py-10 text-center text-sm text-light-textMuted dark:bg-dark-surfaceMuted dark:text-dark-textMuted">No enrolled courses found.</div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-light-border bg-light-surface p-5 shadow-card dark:border-dark-border dark:bg-dark-surface sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">Recent activity</h2>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Latest attendance records</p>
            </div>
            <FaHistory className="text-light-primary dark:text-dark-primary" />
          </div>
          <div className="space-y-4">
            {(dashboard?.recent_attendance || []).slice(0, 6).map((record) => (
              <div key={record.attendance_id} className="flex gap-3">
                <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${record.status === "present" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300"}`}>
                  {record.status === "present" ? <FaCheckCircle /> : <FaTimesCircle />}
                </div>
                <div className="min-w-0 flex-1 border-b border-light-border pb-4 dark:border-dark-border">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary">{record.class?.course_name || "Class attendance"}</p>
                    <span className="shrink-0 text-[11px] text-light-textMuted dark:text-dark-textMuted">{formatDate(record.date, { year: undefined })}</span>
                  </div>
                  <p className="mt-1 text-xs capitalize text-light-textSecondary dark:text-dark-textSecondary">Marked {record.status} · {record.marked_by || record.method}</p>
                </div>
              </div>
            ))}
            {!dashboard?.recent_attendance?.length && <p className="rounded-xl bg-light-surfaceMuted py-10 text-center text-sm text-light-textMuted dark:bg-dark-surfaceMuted dark:text-dark-textMuted">No recent attendance activity.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
