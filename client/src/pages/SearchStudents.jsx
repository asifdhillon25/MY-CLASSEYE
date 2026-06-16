import React, { useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";

const dummyStudents = [
  {
    student_id: "S001",
    name: "Ali Khan",
    roll_no: "101",
    email: "ali.khan@example.com",
    department: "Computer Science",
    year: "2",
    photo_url: "",
  },
  {
    student_id: "S002",
    name: "Sara Ahmed",
    roll_no: "102",
    email: "sara.ahmed@example.com",
    department: "Software Engineering",
    year: "3",
    photo_url: "",
  },
  // Add more dummy students if needed
];

function SearchStudents() {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API search
    setTimeout(() => {
      const results = dummyStudents.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.student_id.toLowerCase().includes(query.toLowerCase()) ||
        s.roll_no.includes(query)
      );
      setStudents(results);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen p-6 bg-light-background dark:bg-dark-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-light-textPrimary dark:text-dark-textPrimary">
          Search Students
        </h1>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center mb-6 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg shadow-sm px-4 py-2"
        >
          <FaSearch className="text-light-textSecondary dark:text-dark-textSecondary mr-3" />
          <input
            type="text"
            placeholder="Search by name, ID or roll no..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-light-textPrimary dark:text-dark-textPrimary placeholder-light-textMuted dark:placeholder-dark-textMuted"
          />
          <button
            type="submit"
            className="ml-4 bg-light-primary dark:bg-dark-primary text-white px-4 py-1 rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition"
          >
            Search
          </button>
        </form>

        {/* Loading state */}
        {loading && (
          <p className="text-center text-light-textSecondary dark:text-dark-textSecondary">
            Searching...
          </p>
        )}

        {/* No results state */}
        {!loading && students.length === 0 && query && (
          <p className="text-center text-light-textSecondary dark:text-dark-textSecondary">
            No students found for "{query}"
          </p>
        )}

        {/* Results */}
        <div className="grid gap-4">
          {students.map((s) => (
            <div
              key={s.student_id}
              className="flex items-center bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="w-16 h-16 rounded-full bg-light-accentSoft dark:bg-dark-accentSoft flex items-center justify-center overflow-hidden mr-4">
                {s.photo_url ? (
                  <img
                    src={s.photo_url}
                    alt={s.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-3xl text-light-accent dark:text-dark-accent" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                  {s.name} <span className="text-sm font-normal text-light-textSecondary dark:text-dark-textSecondary">({s.student_id})</span>
                </h2>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  Roll No: {s.roll_no} | Department: {s.department} | Year: {s.year}
                </p>
                <p className="text-sm text-light-textMuted dark:text-dark-textMuted">
                  {s.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchStudents;
