import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  useGetStudentByIdQuery,
  useUpdateStudentMutation,
} from "../redux/features/students/studentApi.js";
import LoadingSpinner from "./common/LoadingSpinner";
import ErrorMessage from "./common/ErrorMessage";

const EditStudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backPath = location.state?.from || `/app/students/${id}`;

  const { data, isLoading, isError, error } = useGetStudentByIdQuery(id);
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

  const student = data?.data?.student;

  const [formData, setFormData] = useState({
    name: "",
    roll_no: "",
    email: "",
    department: "",
    year: "",
    photo_url: "",
    status: "active",
  });

  // Populate form when student data is loaded
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        roll_no: student.roll_no || "",
        email: student.email || "",
        department: student.department || "",
        year: student.year || "",
        photo_url: student.photo_url || "",
        status: student.status || "active",
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { roll_no, email, ...safeData } = formData;

    await updateStudent({
      id,
      ...safeData,
    }).unwrap();

    navigate(backPath);
  };

  console.log("Update payload:", { id, ...formData });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage error={error} />;

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background p-4 md:p-6 transition-colors duration-200">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-light-textPrimary dark:text-dark-textPrimary">
          Edit Student Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/** Name */}
          <div>
            <label className="block text-sm text-light-textSecondary dark:text-dark-textSecondary mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg text-light-textPrimary dark:text-dark-textPrimary bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border focus:outline-none"
              required
            />
          </div>

          {/* Roll Number */}
          <div>
            <label className="block text-sm text-light-textSecondary dark:text-dark-textSecondary mb-1">
              Roll Number
            </label>
            <input
              type="text"
              name="roll_no"
              value={formData.roll_no}
              disabled
              className="w-full p-3 border rounded-lg text-light-textPrimary dark:text-dark-textPrimary bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-light-textSecondary dark:text-dark-textSecondary mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full p-3 border rounded-lg text-light-textPrimary dark:text-dark-textPrimary bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border focus:outline-none cursor-not-allowed"
            />
          </div>

          {/** Department */}
          <div>
            <label className="block text-sm text-light-textSecondary dark:text-dark-textSecondary mb-1">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg text-light-textPrimary dark:text-dark-textPrimary bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border focus:outline-none"
              required
            />
          </div>

          {/** Year */}
          <div>
            <label className="block text-sm text-light-textSecondary dark:text-dark-textSecondary mb-1">
              Year
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg text-light-textPrimary dark:text-dark-textPrimary bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border focus:outline-none"
              required
            />
          </div>

          {/** Status */}
          <div>
            <label className="block text-sm text-light-textSecondary dark:text-dark-textSecondary mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg text-light-textPrimary dark:text-dark-textPrimary bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/** Submit button */}
          <button
            type="submit"
            className={`px-6 py-3 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/80 transition-colors ${
              isUpdating ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditStudentProfile;
