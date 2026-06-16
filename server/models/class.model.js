const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  class_code: {
    type: String,
    required: true,
    unique: true  // e.g. "CS501-A"
  },
  course_name: {
    type: String,
    required: true
  },
  subject_code: {
    type: String,  // e.g. "CS501"
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students"
    }
  ],
  schedule: [
    {
      day: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      },
      start_time: String,   // "10:00"
      end_time: String      // "11:30"
    }
  ],
  semester: {
    type: String,  // e.g. "Fall 2025"
  },
  room: {
    type: String,  // e.g. "Room 204"
  },
 
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Class", classSchema);
