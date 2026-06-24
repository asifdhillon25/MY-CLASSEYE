import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaArrowRight,
  FaBookOpen,
  FaBrain,
  FaCalendarAlt,
  FaCalendarCheck,
  FaChartBar,
  FaChartLine,
  FaCheckCircle,
  FaChalkboardTeacher,
  FaClock,
  FaExclamationTriangle,
  FaHistory,
  FaIdBadge,
  FaImage,
  FaMapMarkerAlt,
  FaRedo,
  FaSpinner,
  FaTimesCircle,
  FaUserCheck,
  FaUserGraduate,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";
import { useGetTeacherDashboardQuery } from "../redux/features/teachers/teacherApi";

const timeframes = ["day", "week", "month", "year"];

const formatDate = (value, includeYear = true) => {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...(includeYear && { year: "numeric" }),
  }).format(new Date(value));
};

const formatTime = (value) => {
  if (!value) return "TBA";
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const attendanceTone = (percentage) => {
  if (percentage >= 85) return "text-green-600 dark:text-green-400";
  if (percentage >= 75) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
};

const riskStyles = {
  good: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  watch:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  at_risk: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  critical: "bg-red-600 text-white dark:bg-red-500",
  no_data:
    "bg-light-surfaceMuted text-light-textSecondary dark:bg-dark-surfaceMuted dark:text-dark-textSecondary",
};

const priorityStyles = {
  high: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300",
  medium:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300",
  low: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
};

const TeacherDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [selectedClass, setSelectedClass] = useState("");
  const user = useSelector((state) => state.auth.user);
  const teacherId = user?.linked_id?._id || user?.linked_id;

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetTeacherDashboardQuery(
    {
      id: teacherId,
      timeframe: selectedTimeframe,
      classId: selectedClass || undefined,
    },
    { skip: !teacherId },
  );

  const dashboard = response?.data;
  const teacher = dashboard?.teacher;
  const summary = dashboard?.summary;
  const attendance = dashboard?.attendance_overview;
  const selectedAttendance = attendance?.selected_period;
  const faceId = dashboard?.face_id_readiness;

  if (!teacherId) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-800 dark:bg-amber-900/20">
        <FaExclamationTriangle className="mx-auto mb-4 text-3xl text-amber-500" />
        <h1 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
          Teacher profile is not linked
        </h1>
        <p className="mt-2 text-sm text-light-textSecondary dark:text-dark-textSecondary">
          This account has no linked teacher record. Ask an administrator to
          connect it before opening the dashboard.
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
            Preparing your teaching workspace...
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
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-light-primary px-5 py-2.5 font-semibold text-white transition hover:bg-light-primaryHover dark:bg-dark-primary dark:hover:bg-dark-primaryHover"
        >
          <FaRedo /> Try again
        </button>
      </div>
    );
  }

  const stats = [
    {
      label: "Students taught",
      value: summary?.total_students || 0,
      note: `${summary?.at_risk_students || 0} need attention`,
      icon: FaUserGraduate,
      gradient: "from-blue-600 to-indigo-500",
    },
    {
      label: "Assigned classes",
      value: summary?.assigned_classes || 0,
      note: `${summary?.classes_today || 0} scheduled today`,
      icon: FaChalkboardTeacher,
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      label: "Average attendance",
      value: `${selectedAttendance?.percentage || 0}%`,
      note: `${selectedAttendance?.sessions || 0} sessions this ${selectedTimeframe}`,
      icon: FaCalendarCheck,
      gradient: "from-violet-500 to-fuchsia-500",
    },
    {
      label: "Face ID coverage",
      value: `${faceId?.coverage_percentage || 0}%`,
      note: `${faceId?.students_without_embeddings || 0} students not ready`,
      icon: FaBrain,
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy via-blue-700 to-brand-teal p-5 text-white shadow-elevated sm:p-7 lg:p-8">
        <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-brand-aqua/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10 shadow-xl">
              {teacher?.photo_url ? (
                <img
                  src={teacher.photo_url}
                  alt={teacher.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-bold">
                  {teacher?.name?.charAt(0)?.toUpperCase() || "T"}
                </div>
              )}
            </div>
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  Teaching workspace
                </span>
                <span className="rounded-full bg-green-400/20 px-3 py-1 text-xs font-medium text-green-100">
                  {teacher?.status || "active"}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Welcome back, {teacher?.name || "Teacher"}
              </h1>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-blue-50/90">
                <span className="flex items-center gap-2">
                  <FaIdBadge /> {teacher?.teacher_id || "No teacher ID"}
                </span>
                <span className="flex items-center gap-2">
                  <FaChalkboardTeacher /> {teacher?.designation || "Teacher"}
                </span>
                <span className="flex items-center gap-2">
                  <FaBookOpen /> {teacher?.department || "Department"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {dashboard?.today_schedule?.[0] ? (
              <Link
                to={`/app/attendance/${dashboard.today_schedule[0].class_id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-brand-navy shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                <FaUserCheck /> Take attendance
              </Link>
            ) : (
              <a
                href="#my-classes"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-brand-navy shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                <FaBookOpen /> View classes
              </a>
            )}
            <a
              href="#today-schedule"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              <FaCalendarAlt /> Today&apos;s schedule
            </a>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-light-border bg-light-surface p-4 shadow-card dark:border-dark-border dark:bg-dark-surface lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">
              Dashboard scope
            </p>
            <p className="text-xs text-light-textMuted dark:text-dark-textMuted">
              Filter analytics by class and period
            </p>
          </div>
          <select
            value={selectedClass}
            onChange={(event) => setSelectedClass(event.target.value)}
            className="min-w-56 rounded-xl border border-light-border bg-light-background px-4 py-2.5 text-sm font-medium text-light-textPrimary outline-none transition focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary dark:focus:border-dark-primary"
          >
            <option value="">All assigned classes</option>
            {(dashboard?.available_classes || []).map((classItem) => (
              <option key={classItem._id} value={classItem._id}>
                {classItem.class_code} — {classItem.course_name}
              </option>
            ))}
          </select>
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

      <section
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 ${isFetching ? "opacity-70" : ""}`}
      >
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
              <div
                className={`rounded-xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg transition group-hover:scale-105`}
              >
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
                Weighted across every recorded student attendance
              </p>
            </div>
            <div
              className={`text-3xl font-extrabold ${attendanceTone(selectedAttendance?.percentage || 0)}`}
            >
              {selectedAttendance?.percentage || 0}%
            </div>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-light-surfaceMuted dark:bg-dark-surfaceMuted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-light-primary to-light-accent transition-all duration-700 dark:from-dark-primary dark:to-dark-accent"
              style={{
                width: `${Math.min(selectedAttendance?.percentage || 0, 100)}%`,
              }}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
              <FaCheckCircle className="mb-2 text-green-500" />
              <p className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                {selectedAttendance?.present || 0}
              </p>
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                Present records
              </p>
            </div>
            <div className="rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
              <FaTimesCircle className="mb-2 text-red-500" />
              <p className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                {selectedAttendance?.absent || 0}
              </p>
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                Absent records
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
              <FaHistory className="mb-2 text-blue-500" />
              <p className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                {selectedAttendance?.sessions || 0}
              </p>
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                Sessions
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
              <FaChartLine className="mb-2 text-amber-500" />
              <p className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                {(attendance?.percentage_change || 0) > 0 ? "+" : ""}
                {attendance?.percentage_change || 0}%
              </p>
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                Period change
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-light-border pt-5 dark:border-dark-border">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                Attendance trend
              </h3>
              <span className="text-xs text-light-textMuted dark:text-dark-textMuted">
                {formatDate(dashboard?.timeframe?.start)} – {formatDate(dashboard?.timeframe?.end)}
              </span>
            </div>
            {dashboard?.attendance_trend?.length ? (
              <div className="flex min-h-44 items-end gap-2 overflow-x-auto pb-2">
                {dashboard.attendance_trend.map((point) => (
                  <div
                    key={point.date}
                    className="flex min-w-14 flex-1 flex-col items-center gap-2"
                  >
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
                      {formatDate(point.date, false)}
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
          <section className="rounded-2xl border border-light-border bg-light-surface p-5 shadow-card dark:border-dark-border dark:bg-dark-surface">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-light-textPrimary dark:text-dark-textPrimary">
                  Action center
                </h2>
                <p className="text-xs text-light-textMuted dark:text-dark-textMuted">
                  Items requiring your attention
                </p>
              </div>
              <FaExclamationTriangle className="text-amber-500" />
            </div>
            <div className="space-y-3">
              {(dashboard?.action_items || []).map((item) => (
                <div
                  key={item.type}
                  className={`rounded-xl border p-3 ${priorityStyles[item.priority] || priorityStyles.low}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium leading-5">{item.message}</p>
                    <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs font-bold dark:bg-black/20">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
              {!dashboard?.action_items?.length && (
                <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <FaCheckCircle className="mb-2" /> Everything looks up to date.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl bg-gradient-to-br from-brand-navy to-brand-teal p-5 text-white shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold">Face ID readiness</h2>
                <p className="mt-1 text-xs text-white/70">
                  Image-attendance preparation
                </p>
              </div>
              <div className="rounded-xl bg-white/15 p-3">
                <FaBrain />
              </div>
            </div>
            <p className="mt-5 text-4xl font-extrabold">
              {faceId?.coverage_percentage || 0}%
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${Math.min(faceId?.coverage_percentage || 0, 100)}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-xl font-bold">
                  {faceId?.students_with_embeddings || 0}
                </p>
                <p className="text-xs text-white/70">Ready</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-xl font-bold">
                  {faceId?.students_without_embeddings || 0}
                </p>
                <p className="text-xs text-white/70">Not ready</p>
              </div>
            </div>
            {faceId?.low_confidence_records > 0 && (
              <p className="mt-3 rounded-lg bg-amber-400/20 p-2 text-xs text-amber-100">
                {faceId.low_confidence_records} low-confidence records need review.
              </p>
            )}
          </section>
        </aside>
      </div>

      <section
        id="today-schedule"
        className="scroll-mt-36 rounded-2xl border border-light-border bg-light-surface p-5 shadow-card dark:border-dark-border dark:bg-dark-surface sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
              Today&apos;s schedule
            </h2>
            <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
              {summary?.classes_today || 0} classes on your calendar
            </p>
          </div>
          <FaCalendarAlt className="text-2xl text-light-primary dark:text-dark-primary" />
        </div>

        {dashboard?.today_schedule?.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dashboard.today_schedule.map((period) => (
              <article
                key={`${period.class_id}-${period.start_time}`}
                className="relative overflow-hidden rounded-2xl border border-light-border bg-light-background p-4 dark:border-dark-border dark:bg-dark-background"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-light-primary dark:text-dark-primary">
                      {period.class_code}
                    </p>
                    <h3 className="mt-1 font-bold text-light-textPrimary dark:text-dark-textPrimary">
                      {period.course_name}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      period.is_finalized
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : period.attendance_recorded
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-light-surfaceMuted text-light-textSecondary dark:bg-dark-surfaceMuted dark:text-dark-textSecondary"
                    }`}
                  >
                    {period.is_finalized
                      ? "Finalized"
                      : period.attendance_recorded
                        ? "Draft"
                        : "Not started"}
                  </span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  <p className="flex items-center gap-2">
                    <FaClock className="text-light-primary dark:text-dark-primary" />
                    {formatTime(period.start_time)} – {formatTime(period.end_time)}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-light-primary dark:text-dark-primary" />
                    {period.room || "Room TBA"}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaUsers className="text-light-primary dark:text-dark-primary" />
                    {period.student_count} students
                  </p>
                </div>
                <Link
                  to={`/app/attendance/${period.class_id}`}
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-light-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-light-primaryHover dark:bg-dark-primary dark:hover:bg-dark-primaryHover"
                >
                  {period.attendance_recorded ? "View attendance" : "Take attendance"}
                  <FaArrowRight className="text-xs" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-light-surfaceMuted py-12 text-center dark:bg-dark-surfaceMuted">
            <FaCalendarCheck className="mx-auto text-3xl text-light-textMuted dark:text-dark-textMuted" />
            <p className="mt-3 font-medium text-light-textPrimary dark:text-dark-textPrimary">
              No classes scheduled today
            </p>
            <p className="mt-1 text-sm text-light-textMuted dark:text-dark-textMuted">
              Your assigned classes will appear here on teaching days.
            </p>
          </div>
        )}
      </section>

      <section
        id="my-classes"
        className="scroll-mt-36 rounded-2xl border border-light-border bg-light-surface p-5 shadow-card dark:border-dark-border dark:bg-dark-surface sm:p-6"
      >
        <div className="mb-5">
          <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
            My classes
          </h2>
          <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
            Attendance health and readiness for the current view
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {(dashboard?.classes || []).map((classItem) => (
            <article
              key={classItem._id}
              className="rounded-2xl border border-light-border bg-light-background p-5 transition hover:-translate-y-0.5 hover:shadow-card dark:border-dark-border dark:bg-dark-background"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-light-accentSoft px-2.5 py-1 text-xs font-bold text-light-accent dark:bg-dark-accentSoft dark:text-dark-accent">
                      {classItem.class_code}
                    </span>
                    {classItem.at_risk_students > 0 && (
                      <span className="rounded-lg bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                        {classItem.at_risk_students} at risk
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">
                    {classItem.course_name}
                  </h3>
                  <p className="mt-1 text-sm text-light-textSecondary dark:text-dark-textSecondary">
                    {classItem.subject_code} · {classItem.semester || "Semester TBA"}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-2xl font-extrabold ${attendanceTone(classItem.selected_period_attendance.percentage)}`}
                  >
                    {classItem.selected_period_attendance.percentage}%
                  </p>
                  <p className="text-xs text-light-textMuted dark:text-dark-textMuted">
                    attendance
                  </p>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-light-surfaceMuted dark:bg-dark-surfaceMuted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent"
                  style={{
                    width: `${Math.min(classItem.selected_period_attendance.percentage, 100)}%`,
                  }}
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-light-surface p-3 text-center dark:bg-dark-surface">
                  <p className="font-bold text-light-textPrimary dark:text-dark-textPrimary">
                    {classItem.student_count}
                  </p>
                  <p className="text-[11px] text-light-textMuted dark:text-dark-textMuted">
                    Students
                  </p>
                </div>
                <div className="rounded-xl bg-light-surface p-3 text-center dark:bg-dark-surface">
                  <p className="font-bold text-light-textPrimary dark:text-dark-textPrimary">
                    {classItem.selected_period_attendance.sessions}
                  </p>
                  <p className="text-[11px] text-light-textMuted dark:text-dark-textMuted">
                    Sessions
                  </p>
                </div>
                <div className="rounded-xl bg-light-surface p-3 text-center dark:bg-dark-surface">
                  <p className="font-bold text-light-textPrimary dark:text-dark-textPrimary">
                    {classItem.students_without_embeddings}
                  </p>
                  <p className="text-[11px] text-light-textMuted dark:text-dark-textMuted">
                    Need Face ID
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/app/attendance/${classItem._id}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-light-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-light-primaryHover dark:bg-dark-primary dark:hover:bg-dark-primaryHover"
                >
                  <FaUserCheck /> Attendance
                </Link>
                <Link
                  to={`/app/addstudentstoclass/${classItem._id}`}
                  state={{ from: "/app/teacher" }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-light-border bg-light-surface px-4 py-2.5 text-sm font-semibold text-light-textPrimary transition hover:bg-light-surfaceMuted dark:border-dark-border dark:bg-dark-surface dark:text-dark-textPrimary dark:hover:bg-dark-surfaceMuted"
                >
                  <FaUserPlus /> Students
                </Link>
              </div>
            </article>
          ))}
        </div>

        {!dashboard?.classes?.length && (
          <div className="rounded-xl bg-light-surfaceMuted py-10 text-center text-sm text-light-textMuted dark:bg-dark-surfaceMuted dark:text-dark-textMuted">
            No assigned classes found for this view.
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-light-border bg-light-surface shadow-card dark:border-dark-border dark:bg-dark-surface xl:col-span-2">
          <div className="flex flex-col gap-2 border-b border-light-border p-5 dark:border-dark-border sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                Student attendance
              </h2>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                Lowest attendance appears first for quick intervention
              </p>
            </div>
            <span className="rounded-full bg-light-surfaceMuted px-3 py-1 text-xs font-semibold text-light-textSecondary dark:bg-dark-surfaceMuted dark:text-dark-textSecondary">
              {dashboard?.student_attendance?.length || 0} students
            </span>
          </div>

          {dashboard?.student_attendance?.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-light-surfaceMuted dark:bg-dark-surfaceMuted">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-light-textMuted dark:text-dark-textMuted">
                    <th className="px-5 py-3">Student</th>
                    <th className="px-4 py-3">Attendance</th>
                    <th className="px-4 py-3">Present / Absent</th>
                    <th className="px-4 py-3">Risk</th>
                    <th className="px-4 py-3">Face ID</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border">
                  {dashboard.student_attendance.map((item) => (
                    <tr
                      key={item.student._id}
                      className="transition hover:bg-light-surfaceMuted/60 dark:hover:bg-dark-surfaceMuted/60"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {item.student.photo_url ? (
                            <img
                              src={item.student.photo_url}
                              alt={item.student.name}
                              className="h-10 w-10 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-light-primary to-light-accent font-bold text-white dark:from-dark-primary dark:to-dark-accent">
                              {item.student.name?.charAt(0) || "S"}
                            </div>
                          )}
                          <div>
                            <p className="whitespace-nowrap text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                              {item.student.name}
                            </p>
                            <p className="text-xs text-light-textMuted dark:text-dark-textMuted">
                              {item.student.roll_no}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`font-bold ${attendanceTone(item.summary.percentage)}`}>
                          {item.summary.percentage}%
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-light-textSecondary dark:text-dark-textSecondary">
                        <span className="text-green-600 dark:text-green-400">{item.summary.present}</span>
                        <span className="mx-1.5 text-light-textMuted dark:text-dark-textMuted">/</span>
                        <span className="text-red-600 dark:text-red-400">{item.summary.absent}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${riskStyles[item.risk_level] || riskStyles.no_data}`}>
                          {item.risk_level.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {item.student.has_embeddings ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                            <FaCheckCircle /> Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                            <FaImage /> Needed
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/app/students/${item.student._id}`}
                          state={{ from: "/app/teacher" }}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-light-primary hover:underline dark:text-dark-primary"
                        >
                          View <FaArrowRight className="text-xs" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-light-textMuted dark:text-dark-textMuted">
              No students found for this view.
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-light-border bg-light-surface p-5 shadow-card dark:border-dark-border dark:bg-dark-surface sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                Recent activity
              </h2>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                Latest attendance sessions
              </p>
            </div>
            <FaHistory className="text-light-primary dark:text-dark-primary" />
          </div>
          <div className="space-y-4">
            {(dashboard?.recent_activity || []).slice(0, 6).map((activity) => (
              <div key={activity.attendance_id} className="flex gap-3">
                <div
                  className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    activity.is_finalized
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
                  }`}
                >
                  {activity.is_finalized ? <FaCheckCircle /> : <FaSpinner />}
                </div>
                <div className="min-w-0 flex-1 border-b border-light-border pb-4 dark:border-dark-border">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                      {activity.class?.course_name || "Class attendance"}
                    </p>
                    <span className="shrink-0 text-[11px] text-light-textMuted dark:text-dark-textMuted">
                      {formatDate(activity.date, false)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs capitalize text-light-textSecondary dark:text-dark-textSecondary">
                    {activity.method} · {activity.summary.percentage}% present · {activity.is_finalized ? "finalized" : "draft"}
                  </p>
                </div>
              </div>
            ))}
            {!dashboard?.recent_activity?.length && (
              <p className="rounded-xl bg-light-surfaceMuted py-10 text-center text-sm text-light-textMuted dark:bg-dark-surfaceMuted dark:text-dark-textMuted">
                No recent attendance activity.
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-light-border bg-light-surface p-5 shadow-card dark:border-dark-border dark:bg-dark-surface sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
              Attendance methods
            </h2>
            <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
              How attendance has been captured in the current view
            </p>
          </div>
          <FaChartBar className="text-xl text-light-primary dark:text-dark-primary" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["Manual", attendance?.method_usage?.manual || 0, FaUserCheck, "bg-blue-500"],
            ["Image", attendance?.method_usage?.image || 0, FaImage, "bg-violet-500"],
            ["Mixed", attendance?.method_usage?.mixed || 0, FaUsers, "bg-teal-500"],
          ].map(([label, value, Icon, color]) => (
            <div key={label} className="flex items-center gap-4 rounded-2xl bg-light-surfaceMuted p-4 dark:bg-dark-surfaceMuted">
              <div className={`rounded-xl p-3 text-white ${color}`}><Icon /></div>
              <div>
                <p className="text-2xl font-extrabold text-light-textPrimary dark:text-dark-textPrimary">{value}</p>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">{label} sessions</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TeacherDashboard;
