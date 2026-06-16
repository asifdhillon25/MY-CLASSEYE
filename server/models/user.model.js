const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password_hash: String,
  role: {
    type: String,
    enum: ["student", "teacher", "admin", "super_admin"],
    required: true
  },
  join_date: {
    type: Date,
    default: Date.now,  },
  status: {
    type: String,
   
    default: "active"
  },
  linked_id: mongoose.Schema.Types.ObjectId, // points to Student/Teacher/Admin
});

module.exports = mongoose.model("User", userSchema);