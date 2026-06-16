const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  teacher_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  designation: {
    type: String, // e.g. "Assistant Professor", "Lecturer"
    default: "Lecturer",
  },
  phone: {
    type: String,
  },
  photo_url: {
    type: String,
  },
  classes_assigned: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
  join_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);
