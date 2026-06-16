import { useState } from "react";
import { useAddStudentMutation } from "../redux/features/students/studentApi";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    year: "",
  });

  const [message, setMessage] = useState("");

  // RTK Query mutation
  const [addStudent, { isLoading }] = useAddStudentMutation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // Send only the required fields
      await addStudent(formData).unwrap();

      setMessage("Student added successfully ✅");

      // Reset form
      setFormData({
        name: "",
        department: "",
        year: "",
      });
    } catch (err) {
      console.error("Add student error:", err);
      setMessage(err?.data?.message || "Error adding student ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background px-4 transition-colors">
      <div className="w-full max-w-lg bg-light-surface dark:bg-dark-surface p-8 rounded-xl shadow-lg border border-light-border dark:border-dark-border">
        <h2 className="text-2xl font-bold mb-6 text-center text-light-textPrimary dark:text-dark-textPrimary">
          Add Student
        </h2>

        {message && (
          <p className="mb-4 text-center text-sm text-light-accent dark:text-dark-accent">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "name", placeholder: "Name", type: "text" },
            { name: "department", placeholder: "Department", type: "text" },
            { name: "year", placeholder: "Year", type: "number" },
          ].map(({ name, placeholder, type }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg border
                bg-light-surface dark:bg-dark-surface
                text-light-textPrimary dark:text-dark-textPrimary
                border-light-border dark:border-dark-border
                placeholder-light-textMuted dark:placeholder-dark-textMuted
                focus:outline-none focus:ring-2
                focus:ring-light-primary dark:focus:ring-dark-primary"
            />
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-lg font-semibold text-white
              bg-light-primary dark:bg-dark-primary
              hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover
              transition disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Add Student"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
