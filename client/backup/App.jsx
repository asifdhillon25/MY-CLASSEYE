import "./App.css";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddStudent from "./pages/AddStudent";
import SearchStudents from "./pages/SearchStudents";
import AddClass from "./pages/AddClass";
import Attendance from "./pages/Attendance";
import StudentReports from "./pages/StudentReports";
import MainLayout from "./layout/MainLayout";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { path: "/", element: <Dashboard /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "addstudent", element: <AddStudent /> },
        { path: "searchstudents", element: <SearchStudents /> },
        { path: "addclass", element: <AddClass /> },
        { path: "attendance", element: <Attendance /> },
        { path: "reports", element: <StudentReports /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}