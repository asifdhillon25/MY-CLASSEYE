import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBookOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronDown,
  FaClock,
  FaExclamationTriangle,
  FaFilter,
  FaGraduationCap,
  FaHistory,
  FaIdBadge,
  FaRedo,
  FaTimesCircle,
  FaUserTie,
} from "react-icons/fa";
import { useGetStudentAttendanceQuery } from "../redux/features/students/studentApi";

const formatDate = (value, includeTime = false) => {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(includeTime && { hour: "numeric", minute: "2-digit" }),
  }).format(new Date(value));
};

const percentageTone = (percentage) => {
  if (percentage >= 85) return "text-green-600 dark:text-green-400";
  if (percentage >= 75) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
};

const StudentAttendance = () => {
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const user = useSelector((state) => state.auth.user);
  const { studentId: routeStudentId } = useParams();
  const location = useLocation();
  const linkedStudentId = user?.linked_id?._id || user?.linked_id;
  const studentId = routeStudentId || linkedStudentId;
  const isSelectedReport = Boolean(routeStudentId);
  const backPath = location.state?.from || "/app/reports";

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetStudentAttendanceQuery(studentId, { skip: !studentId });

  const attendanceData = response?.data;
  const student = attendanceData?.student;
  const summary = attendanceData?.summary;
  const attendanceByClass = attendanceData?.attendance_by_class || [];
  const attendance = useMemo(
    () => attendanceData?.attendance || [],
    [attendanceData?.attendance],
  );

  const filteredAttendance = useMemo(
    () =>
      attendance.filter((record) => {
        const matchesClass =
          classFilter === "all" || record.class?._id === classFilter;
        const matchesStatus =
          statusFilter === "all" || record.status === statusFilter;
        return matchesClass && matchesStatus;
      }),
    [attendance, classFilter, statusFilter],
  );

  const recentActivity = attendance.slice(0, 7).reverse();

  if (!studentId) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-800 dark:bg-amber-900/20">
        <FaExclamationTriangle className="mx-auto mb-4 text-3xl text-amber-500" />
        <h1 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
          Student profile is not linked
        </h1>
        <p className="mt-2 text-sm text-light-textSecondary dark:text-dark-textSecondary">
          Ask an administrator to connect this account to a student profile.
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
            Loading your attendance record...
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
          Attendance could not be loaded
        </h1>
        <p className="mt-2 text-sm text-light-textSecondary dark:text-dark-textSecondary">
          {error?.data?.message || "Please check your connection and try again."}
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
      label: "Overall attendance",
      value: `${summary?.percentage || 0}%`,
      note: `${summary?.present || 0} of ${summary?.total || 0} classes attended`,
      icon: FaGraduationCap,
      gradient: "from-brand-navy to-blue-500",
    },
    {
      label: "Present",
      value: summary?.present || 0,
      note: "Recorded present",
      icon: FaCheckCircle,
      gradient: "from-emerald-600 to-green-400",
    },
    {
      label: "Absent",
      value: summary?.absent || 0,
      note: "Recorded absent",
      icon: FaTimesCircle,
      gradient: "from-red-600 to-rose-400",
    },
    {
      label: "Enrolled courses",
      value: summary?.enrolled_classes || 0,
      note: `${summary?.finalized_records || 0} finalized records`,
      icon: FaBookOpen,
      gradient: "from-brand-teal to-cyan-400",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy via-blue-700 to-brand-teal p-5 text-white shadow-elevated sm:p-7 lg:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-brand-aqua/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            {isSelectedReport && (
              <Link
                to={backPath}
                className="mb-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20"
              >
                <FaArrowLeft /> Back to reports
              </Link>
            )}
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              <FaCalendarAlt /> Attendance workspace
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              {isSelectedReport ? `${student?.name || "Student"}'s attendance` : "My attendance"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-blue-50/90 sm:text-base">
              Review your complete attendance history and performance in every
              enrolled course.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-1">
            <span className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
              <FaIdBadge /> {student?.roll_no || "No roll number"}
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
              <FaGraduationCap /> {student?.department || "Department"}
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
              <FaBookOpen /> {student?.semester || `Year ${student?.year || "N/A"}`}
            </span>
          </div>
        </div>
      </section>

      <section
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 ${isFetching ? "opacity-70" : ""}`}
      >
        {stats.map(({ label, value, note, icon: Icon, gradient }) => (
          <article
            key={label}
            className="group rounded-2xl border border-light-border bg-light-surface p-5 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover dark:border-dark-border dark:bg-dark-surface"
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
              <div className={`rounded-xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg`}>
                <Icon className="text-xl" />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-light-border bg-light-surface p-5 shadow-card dark:border-dark-border dark:bg-dark-surface sm:p-6 xl:col-span-2">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                Attendance health
              </h2>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                Your attendance across all recorded classes
              </p>
            </div>
            <p className={`text-4xl font-extrabold ${percentageTone(summary?.percentage || 0)}`}>
              {summary?.percentage || 0}%
            </p>
          </div>
          <div className="mt-6 h-4 overflow-hidden rounded-full bg-light-surfaceMuted dark:bg-dark-surfaceMuted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-navy transition-all duration-700"
              style={{ width: `${Math.min(summary?.percentage || 0, 100)}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-light-textMuted dark:text-dark-textMuted">
            <span>0%</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">75% target</span>
            <span>100%</span>
          </div>

          <div className="mt-7">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                Recent pattern
              </h3>
              <span className="text-xs text-light-textMuted dark:text-dark-textMuted">
                Last {recentActivity.length} records
              </span>
            </div>
            {recentActivity.length ? (
              <div className="flex min-h-28 items-end gap-2">
                {recentActivity.map((record) => (
                  <div key={record.attendance_id} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className={`w-full max-w-12 rounded-lg ${
                        record.status === "present"
                          ? "h-20 bg-green-500"
                          : "h-10 bg-red-400"
                      }`}
                      title={`${record.class?.course_name || "Class"}: ${record.status}`}
                    />
                    <span className="text-[10px] text-light-textMuted dark:text-dark-textMuted">
                      {new Date(record.date).toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-light-surfaceMuted py-8 text-center text-sm text-light-textMuted dark:bg-dark-surfaceMuted dark:text-dark-textMuted">
                No attendance has been recorded yet.
              </p>
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-light-border bg-light-surface p-5 shadow-card dark:border-dark-border dark:bg-dark-surface sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                Student details
              </h2>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                Attendance belongs to this profile
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-light-accentSoft text-light-accent dark:bg-dark-accentSoft dark:text-dark-accent">
              <FaIdBadge className="text-xl" />
            </div>
          </div>
          <div className="space-y-4">
            {[
              ["Student", student?.name],
              ["Roll number", student?.roll_no],
              ["Email", student?.email],
              ["Department", student?.department],
              ["Academic year", student?.year],
              ["Semester", student?.semester],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-light-border pb-3 last:border-0 dark:border-dark-border">
                <p className="text-xs font-medium uppercase tracking-wide text-light-textMuted dark:text-dark-textMuted">
                  {label}
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                  {value || "Not provided"}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-light-border bg-light-surface p-5 shadow-card dark:border-dark-border dark:bg-dark-surface sm:p-6">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
            Course breakdown
          </h2>
          <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
            Attendance performance for each enrolled course
          </p>
        </div>
        {attendanceByClass.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {attendanceByClass.map((item) => (
              <article
                key={item.class._id}
                className="rounded-2xl border border-light-border bg-light-background p-5 transition hover:-translate-y-0.5 hover:shadow-card dark:border-dark-border dark:bg-dark-background"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-lg bg-light-accentSoft px-2.5 py-1 text-xs font-bold text-light-accent dark:bg-dark-accentSoft dark:text-dark-accent">
                      {item.class.class_code}
                    </span>
                    <h3 className="mt-3 font-bold text-light-textPrimary dark:text-dark-textPrimary">
                      {item.class.course_name}
                    </h3>
                    <p className="mt-1 text-xs text-light-textMuted dark:text-dark-textMuted">
                      {item.class.subject_code} · {item.class.semester || "Semester TBA"}
                    </p>
                  </div>
                  <span className={`text-2xl font-extrabold ${percentageTone(item.summary.percentage)}`}>
                    {item.summary.percentage}%
                  </span>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-light-surfaceMuted dark:bg-dark-surfaceMuted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-navy"
                    style={{ width: `${Math.min(item.summary.percentage, 100)}%` }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-light-surface p-2.5 dark:bg-dark-surface">
                    <p className="font-bold text-light-textPrimary dark:text-dark-textPrimary">{item.summary.total}</p>
                    <p className="text-[10px] text-light-textMuted dark:text-dark-textMuted">Classes</p>
                  </div>
                  <div className="rounded-xl bg-green-50 p-2.5 dark:bg-green-900/20">
                    <p className="font-bold text-green-600 dark:text-green-400">{item.summary.present}</p>
                    <p className="text-[10px] text-light-textMuted dark:text-dark-textMuted">Present</p>
                  </div>
                  <div className="rounded-xl bg-red-50 p-2.5 dark:bg-red-900/20">
                    <p className="font-bold text-red-600 dark:text-red-400">{item.summary.absent}</p>
                    <p className="text-[10px] text-light-textMuted dark:text-dark-textMuted">Absent</p>
                  </div>
                </div>
                {item.class.teacher && (
                  <p className="mt-4 flex items-center gap-2 text-xs text-light-textSecondary dark:text-dark-textSecondary">
                    <FaUserTie className="text-brand-teal" /> {item.class.teacher.name}
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-light-surfaceMuted py-10 text-center dark:bg-dark-surfaceMuted">
            <FaBookOpen className="mx-auto text-3xl text-light-textMuted dark:text-dark-textMuted" />
            <p className="mt-3 text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
              No enrolled courses found.
            </p>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-light-border bg-light-surface shadow-card dark:border-dark-border dark:bg-dark-surface">
        <div className="flex flex-col gap-4 border-b border-light-border p-5 dark:border-dark-border sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
              <FaHistory className="text-brand-teal" /> Attendance history
            </h2>
            <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
              {filteredAttendance.length} of {attendance.length} records shown
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative">
              <FaFilter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-light-textMuted dark:text-dark-textMuted" />
              <select
                value={classFilter}
                onChange={(event) => setClassFilter(event.target.value)}
                className="w-full appearance-none rounded-xl border border-light-border bg-light-background py-2.5 pl-9 pr-9 text-sm font-medium text-light-textPrimary outline-none focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary sm:w-56"
              >
                <option value="all">All courses</option>
                {attendanceByClass.map((item) => (
                  <option key={item.class._id} value={item.class._id}>
                    {item.class.class_code} — {item.class.course_name}
                  </option>
                ))}
              </select>
              <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-light-textMuted dark:text-dark-textMuted" />
            </label>
            <label className="relative">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full appearance-none rounded-xl border border-light-border bg-light-background py-2.5 pl-4 pr-9 text-sm font-medium text-light-textPrimary outline-none focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary sm:w-40"
              >
                <option value="all">All statuses</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
              <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-light-textMuted dark:text-dark-textMuted" />
            </label>
          </div>
        </div>

        {filteredAttendance.length ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full">
                <thead className="bg-light-surfaceMuted dark:bg-dark-surfaceMuted">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-light-textMuted dark:text-dark-textMuted">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Teacher</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-6 py-3 text-right">Record</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border">
                  {filteredAttendance.map((record) => (
                    <tr key={record.attendance_id} className="transition hover:bg-light-surfaceMuted/60 dark:hover:bg-dark-surfaceMuted/60">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary">{record.class?.course_name || "Deleted class"}</p>
                        <p className="text-xs text-light-textMuted dark:text-dark-textMuted">{record.class?.class_code || "No code"}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-light-textSecondary dark:text-dark-textSecondary">
                        {record.teacher?.name || "Not available"}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          record.status === "present"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}>
                          {record.status === "present" ? <FaCheckCircle /> : <FaTimesCircle />}
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm capitalize text-light-textSecondary dark:text-dark-textSecondary">
                        {record.marked_by || record.method}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-xs font-medium ${record.is_finalized ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                          {record.is_finalized ? "Finalized" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-light-border dark:divide-dark-border md:hidden">
              {filteredAttendance.map((record) => (
                <article key={record.attendance_id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">{record.class?.course_name || "Deleted class"}</p>
                      <p className="mt-1 text-xs text-light-textMuted dark:text-dark-textMuted">{record.class?.class_code || "No code"}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      record.status === "present"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }`}>
                      {record.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <p className="flex items-center gap-2 text-light-textSecondary dark:text-dark-textSecondary"><FaCalendarAlt className="text-brand-teal" /> {formatDate(record.date)}</p>
                    <p className="flex items-center gap-2 text-light-textSecondary dark:text-dark-textSecondary"><FaUserTie className="text-brand-teal" /> {record.teacher?.name || "N/A"}</p>
                    <p className="flex items-center gap-2 capitalize text-light-textSecondary dark:text-dark-textSecondary"><FaClock className="text-brand-teal" /> {record.marked_by || record.method}</p>
                    <p className="text-right font-medium text-light-textSecondary dark:text-dark-textSecondary">{record.is_finalized ? "Finalized" : "Pending"}</p>
                  </div>
                  {record.marked_at && (
                    <p className="mt-3 text-[11px] text-light-textMuted dark:text-dark-textMuted">Marked {formatDate(record.marked_at, true)}</p>
                  )}
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="py-14 text-center">
            <FaCalendarAlt className="mx-auto text-4xl text-light-textMuted dark:text-dark-textMuted" />
            <h3 className="mt-4 font-semibold text-light-textPrimary dark:text-dark-textPrimary">No matching records</h3>
            <p className="mt-1 text-sm text-light-textSecondary dark:text-dark-textSecondary">Try changing the course or status filter.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentAttendance;
