import "./App.css";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import pages
import ProtectedRoute from "./pages/components/ProtectedRoute";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import SystemSettings from "./pages/SystemSettings";
import AddStudent from "./pages/AddStudent";
import SearchStudents from "./pages/SearchStudents";
import AddClass from "./pages/AddClass";
import StudentReports from "./pages/StudentReports";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import AddTeacher from "./pages/AddTeacher";
import StudentList from "./pages/StudentList";
import StudentProfile from "./pages/StudentProfile";
import TeacherList from "./pages/TeacherList";
import ClassManagement from "./pages/ClassManagement";
import AddStudentsToClass from "./pages/AddStudentsToClass";
import EditStudentProfile from "./pages/EditStudentProfile";
import Attendance from "./pages/Attendance";

export default function App() {
  const router = createBrowserRouter([
    // Public routes
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },

    // Protected routes (requires authentication)
    {
      path: "/app",
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        // Role-specific dashboards
        { path: "student", element: <StudentDashboard /> },
        { path: "teacher", element: <TeacherDashboard /> },
        { path: "parent", element: <ParentDashboard /> },
        { path: "admin", element: <AdminDashboard /> },
        { path: "dashboard", element: <Dashboard /> },

        // Admin-specific pages
        { path: "manage-users", element: <UserManagement /> },
        { path: "settings", element: <SystemSettings /> },
        { path: "addteacher", element: <AddTeacher /> },
        { path: "teachers", element: <TeacherList /> },
        { path: "students", element: <StudentList /> },
        { path: "students/:id", element: <StudentProfile /> },
        { path: "students/edit/:id", element: <EditStudentProfile /> },
        { path: "classes", element: <ClassManagement /> },

        // Shared features
        { path: "addstudent", element: <AddStudent /> },
        { path: "searchstudents", element: <SearchStudents /> },
        { path: "addclass", element: <AddClass /> },
        { path: "attendance/:id", element: <Attendance /> },
        { path: "reports", element: <StudentReports /> },
        { path: "addstudentstoclass/:id", element: <AddStudentsToClass /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
