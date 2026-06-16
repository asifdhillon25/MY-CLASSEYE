import React, { useState } from "react";
import { 
  FaCalendarAlt, 
  FaChalkboardTeacher, 
  FaBuilding, 
  FaBook, 
  FaClock,
  FaPlus,
  FaTimes
} from "react-icons/fa";
import { useAddClassMutation } from "../redux/features/classes/classesApi";
import { useGetTeachersQuery } from "../redux/features/teachers/teacherApi";

const AddClass = () => {
  const [addClass, { isLoading, isError, error, isSuccess }] = useAddClassMutation();
  const { data: teachersData = [], isLoading: teachersLoading } = useGetTeachersQuery();
  const teachers = teachersData.data?.teachers || teachersData.data || teachersData || [];

  const [formData, setFormData] = useState({
    class_code: "",
    course_name: "",
    subject_code: "",
    teacher: "",
    semester: "",
    room: "",
   
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  // Days of the week for schedule
  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", 
    "Friday", "Saturday", "Sunday"
  ];

 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validate required fields
    if (!formData.class_code || !formData.course_name || !formData.subject_code || !formData.teacher) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

  
    try {
      const classData = {
        ...formData,
        teacher: formData.teacher // This should be the teacher's ObjectId
      };

      await addClass(classData).unwrap();
      
      setMessage({ 
        type: "success", 
        text: "Class added successfully!" 
      });
      
      // Reset form
      setFormData({
        class_code: "",
        course_name: "",
        subject_code: "",
        teacher: "",
        semester: "",
        room: "",
       
      });

    } catch (error) {
      console.error("Error adding class:", error);
      setMessage({ 
        type: "error", 
        text: error?.data?.message || "Failed to add class. Please try again." 
      });
    }
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary flex items-center gap-3 mb-2">
            <FaChalkboardTeacher className="text-brand-teal" />
            Add New Class
          </h1>
          <p className="text-light-textSecondary dark:text-dark-textSecondary">
            Create a new class by filling in the details below
          </p>
        </div>

        {/* Success/Error Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === "success" 
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
          }`}>
            <div className="flex items-center gap-2">
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg border border-light-border dark:border-dark-border overflow-hidden">
          <div className="p-6 border-b border-light-border dark:border-dark-border">
            <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
              Class Information
            </h2>
            <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">
              Please provide all required information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="space-y-8">
              {/* Basic Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Class Code */}
                <div>
                  <label className="block text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary mb-2">
                    Class Code *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBook className="w-5 h-5 text-light-textMuted dark:text-dark-textMuted" />
                    </div>
                    <input
                      type="text"
                      name="class_code"
                      value={formData.class_code}
                      onChange={handleChange}
                      placeholder="e.g., CS501-A"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors"
                      required
                    />
                  </div>
                  <p className="mt-2 text-xs text-light-textMuted dark:text-dark-textMuted">
                    Unique identifier for the class
                  </p>
                </div>

                {/* Course Name */}
                <div>
                  <label className="block text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary mb-2">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    name="course_name"
                    value={formData.course_name}
                    onChange={handleChange}
                    placeholder="e.g., Data Structures & Algorithms"
                    className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors"
                    required
                  />
                </div>

                {/* Subject Code */}
                <div>
                  <label className="block text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary mb-2">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    name="subject_code"
                    value={formData.subject_code}
                    onChange={handleChange}
                    placeholder="e.g., CS501"
                    className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors"
                    required
                  />
                </div>

                {/* Teacher Selection */}
                <div>
                  <label className="block text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary mb-2">
                    Teacher *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaChalkboardTeacher className="w-5 h-5 text-light-textMuted dark:text-dark-textMuted" />
                    </div>
                    <select
                      name="teacher"
                      value={formData.teacher}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 appearance-none"
                      required
                      disabled={teachersLoading}
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.name} ({teacher.teacher_id})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-light-textMuted dark:text-dark-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {teachersLoading && (
                    <p className="mt-2 text-xs text-light-textMuted dark:text-dark-textMuted">
                      Loading teachers...
                    </p>
                  )}
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary mb-2">
                    Semester
                  </label>
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    placeholder="e.g., Fall 2024"
                    className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors"
                  />
                </div>

                {/* Room */}
                <div>
                  <label className="block text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary mb-2">
                    Room Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="w-5 h-5 text-light-textMuted dark:text-dark-textMuted" />
                    </div>
                    <input
                      type="text"
                      name="room"
                      value={formData.room}
                      onChange={handleChange}
                      placeholder="e.g., Room 204"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors"
                    />
                  </div>
                </div>
              </div>

              

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-8 mt-8 border-t border-light-border dark:border-dark-border">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      class_code: "",
                      course_name: "",
                      subject_code: "",
                      teacher: "",
                      semester: "",
                      room: "",
                     
                    });
                    setMessage({ type: "", text: "" });
                  }}
                  className="px-6 py-3 rounded-lg border border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition-colors focus:outline-none focus:ring-2 focus:ring-light-border dark:focus:ring-dark-border"
                  disabled={isLoading}
                >
                  Clear All
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 rounded-lg bg-brand-teal hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-teal/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Class...
                    </>
                  ) : (
                    <>
                      <FaPlus className="w-5 h-5" />
                      Create Class
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

       
      </div>
    </div>
  );
};

export default AddClass;