import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBookOpen,
  FaChevronDown,
  FaExclamationTriangle,
  FaFilter,
  FaGraduationCap,
  FaIdBadge,
  FaRedo,
  FaSearch,
  FaUserCheck,
  FaUserGraduate,
} from "react-icons/fa";
import { useGetStudentsQuery } from "../redux/features/students/studentApi";

const StudentReports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetStudentsQuery();

  const students = useMemo(
    () => response?.data?.students || [],
    [response?.data?.students],
  );

  const departments = useMemo(
    () =>
      [...new Set(students.map((student) => student.department).filter(Boolean))]
        .sort((first, second) => first.localeCompare(second)),
    [students],
  );

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return students
      .filter((student) => {
        const matchesSearch =
          !normalizedSearch ||
          student.name?.toLowerCase().includes(normalizedSearch) ||
          student.roll_no?.toLowerCase().includes(normalizedSearch) ||
          student.email?.toLowerCase().includes(normalizedSearch) ||
          student.department?.toLowerCase().includes(normalizedSearch);
        const matchesDepartment =
          departmentFilter === "all" ||
          student.department === departmentFilter;
        const matchesStatus =
          statusFilter === "all" || student.status === statusFilter;

        return matchesSearch && matchesDepartment && matchesStatus;
      })
      .sort((first, second) => first.name.localeCompare(second.name));
  }, [departmentFilter, searchTerm, statusFilter, students]);

  const activeStudents = students.filter(
    (student) => student.status === "active",
  ).length;
  const studentsWithFaceId = students.filter(
    (student) => student.has_embeddings,
  ).length;

  const clearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("all");
    setStatusFilter("active");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-light-border border-t-light-primary dark:border-dark-border dark:border-t-dark-primary" />
          <p className="mt-4 text-sm text-light-textSecondary dark:text-dark-textSecondary">
            Loading the student directory...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
        <FaExclamationTriangle className="mx-auto mb-4 text-3xl text-red-500" />
        <h1 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
          Student reports could not be loaded
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
      label: "Total students",
      value: students.length,
      note: "Profiles in the system",
      icon: FaUserGraduate,
      gradient: "from-brand-navy to-blue-500",
    },
    {
      label: "Active students",
      value: activeStudents,
      note: "Available for reporting",
      icon: FaUserCheck,
      gradient: "from-emerald-600 to-green-400",
    },
    {
      label: "Departments",
      value: departments.length,
      note: "Academic departments",
      icon: FaBookOpen,
      gradient: "from-brand-teal to-cyan-400",
    },
    {
      label: "Face ID ready",
      value: studentsWithFaceId,
      note: "Students with embeddings",
      icon: FaIdBadge,
      gradient: "from-violet-600 to-purple-400",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy via-blue-700 to-brand-teal p-5 text-white shadow-elevated sm:p-7 lg:p-8">
        <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-28 left-1/3 h-60 w-60 rounded-full bg-brand-aqua/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            <FaGraduationCap /> Academic reporting
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
            Student attendance reports
          </h1>
          <p className="mt-2 text-sm text-blue-50/90 sm:text-base">
            Find a student and open their complete attendance record, including
            course performance and attendance history.
          </p>
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
              <div
                className={`rounded-xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg transition group-hover:scale-105`}
              >
                <Icon className="text-xl" />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-light-border bg-light-surface p-4 shadow-card dark:border-dark-border dark:bg-dark-surface sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-light-textMuted dark:text-dark-textMuted" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, roll number, email, or department..."
              className="w-full rounded-xl border border-light-border bg-light-background py-3 pl-11 pr-4 text-sm text-light-textPrimary outline-none transition placeholder:text-light-textMuted focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary dark:placeholder:text-dark-textMuted"
            />
          </label>

          <label className="relative">
            <FaFilter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-light-textMuted dark:text-dark-textMuted" />
            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className="w-full appearance-none rounded-xl border border-light-border bg-light-background py-3 pl-9 pr-9 text-sm font-medium text-light-textPrimary outline-none focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary lg:w-56"
            >
              <option value="all">All departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
            <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-light-textMuted dark:text-dark-textMuted" />
          </label>

          <label className="relative">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full appearance-none rounded-xl border border-light-border bg-light-background py-3 pl-4 pr-9 text-sm font-medium text-light-textPrimary outline-none focus:border-light-primary focus:ring-2 focus:ring-light-primary/20 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary lg:w-40"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-light-textMuted dark:text-dark-textMuted" />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-light-border pt-4 text-sm dark:border-dark-border">
          <p className="text-light-textSecondary dark:text-dark-textSecondary">
            Showing <span className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">{filteredStudents.length}</span> of {students.length} students
          </p>
          {(searchTerm || departmentFilter !== "all" || statusFilter !== "active") && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-semibold text-light-primary hover:underline dark:text-dark-primary"
            >
              Reset filters
            </button>
          )}
        </div>
      </section>

      {filteredStudents.length ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredStudents.map((student) => (
            <Link
              key={student._id}
              to={`/app/reports/${student._id}`}
              state={{ from: "/app/reports" }}
              className="group rounded-2xl border border-light-border bg-light-surface p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-teal/50 hover:shadow-card-hover dark:border-dark-border dark:bg-dark-surface"
            >
              <div className="flex items-start gap-4">
                {student.photo_url ? (
                  <img
                    src={student.photo_url}
                    alt={student.name}
                    className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-navy to-brand-teal text-xl font-bold text-white">
                    {student.name?.charAt(0)?.toUpperCase() || "S"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="truncate font-bold text-light-textPrimary dark:text-dark-textPrimary">
                        {student.name}
                      </h2>
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-light-accent dark:text-dark-accent">
                        <FaIdBadge /> {student.roll_no}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${
                      student.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}>
                      {student.status || "active"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-light-surfaceMuted p-3 dark:bg-dark-surfaceMuted">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-light-textMuted dark:text-dark-textMuted">Department</p>
                  <p className="mt-1 truncate text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary">{student.department || "Not provided"}</p>
                </div>
                <div className="rounded-xl bg-light-surfaceMuted p-3 dark:bg-dark-surfaceMuted">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-light-textMuted dark:text-dark-textMuted">Year / semester</p>
                  <p className="mt-1 truncate text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary">{student.semester || `Year ${student.year || "N/A"}`}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-light-border pt-4 dark:border-dark-border">
                <span className="text-xs text-light-textMuted dark:text-dark-textMuted">{student.email}</span>
                <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-light-primary dark:text-dark-primary">
                  View report <FaArrowRight className="text-xs transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-light-border bg-light-surface py-16 text-center shadow-card dark:border-dark-border dark:bg-dark-surface">
          <FaSearch className="mx-auto text-4xl text-light-textMuted dark:text-dark-textMuted" />
          <h2 className="mt-4 text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">
            No students match these filters
          </h2>
          <p className="mt-1 text-sm text-light-textSecondary dark:text-dark-textSecondary">
            Try another search term or reset the filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-xl bg-light-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-light-primaryHover dark:bg-dark-primary dark:hover:bg-dark-primaryHover"
          >
            Reset filters
          </button>
        </section>
      )}
    </div>
  );
};

export default StudentReports;
