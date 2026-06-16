import React, { useState } from "react";
import { User, Building, Briefcase, Phone, Plus, X } from "lucide-react";
import { useAddTeacherMutation } from "../redux/features/teachers/teacherApi";

const AddTeacher = () => {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    designation: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [addTeacher, { isLoading }] = useAddTeacherMutation();

  const departments = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Business Administration",
    "Humanities",
  ];

  const designations = [
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "Lecturer",
    "Senior Lecturer",
    "Adjunct Professor",
    "Visiting Professor",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.designation) newErrors.designation = "Designation is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await addTeacher(formData).unwrap();

      setSuccessMessage("Teacher added successfully!");
      setFormData({
        name: "",
        department: "",
        designation: "",
        phone: "",
      });

      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setErrors({
        api: err?.data?.message || "Failed to add teacher",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      department: "",
      designation: "",
      phone: "",
    });
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="w-8 h-8 text-brand-teal" />
            Add New Teacher
          </h1>
          <p className="text-light-textSecondary dark:text-dark-textSecondary">
            Fill in the details below to add a new teacher
          </p>
        </div>

        {/* Success */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex justify-between">
            <span className="text-green-800">{successMessage}</span>
            <button onClick={() => setSuccessMessage("")}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* API Error */}
        {errors.api && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {errors.api}
          </div>
        )}

        {/* Form */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow border">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* Name */}
            <div>
              <label className="block mb-2">Full Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border"
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block mb-2">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.department && <p className="text-red-500">{errors.department}</p>}
            </div>

            {/* Designation */}
            <div>
              <label className="block mb-2">Designation *</label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border"
              >
                <option value="">Select Designation</option>
                {designations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.designation && <p className="text-red-500">{errors.designation}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2">Phone *</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border"
              />
              {errors.phone && <p className="text-red-500">{errors.phone}</p>}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border rounded-lg"
                disabled={isLoading}
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-brand-teal text-white rounded-lg flex items-center gap-2"
              >
                {isLoading ? "Adding..." : <><Plus size={18} /> Add Teacher</>}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default AddTeacher;
