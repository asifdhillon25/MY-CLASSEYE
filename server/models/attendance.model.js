const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },

  date: {
    type: Date,
    required: true,
    index: true // For faster queries by date
  },

  // Track who created/updated this attendance
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },

  records: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Students",
        required: true
      },
      status: {
        type: String,
        enum: ["present", "absent"],
        required: true
      },
      marked_by: {
        type: String,
        enum: ["manual", "image"],
        default: "manual"
      },
      confidence: {
        type: Number, // For face recognition (0-1)
        min: 0,
        max: 1,
        default: null
      },
      marked_at: {
        type: Date,
        default: Date.now
      }
    }
  ],

  method: {
    type: String,
    enum: ["manual", "image", "mixed"],
    default: "manual"
  },

  // Track images used for AI attendance
  images_used: [String], // Base64 or URLs

  // Status to prevent multiple teachers editing
  is_finalized: {
    type: Boolean,
    default: false
  },

  created_at: {
    type: Date,
    default: Date.now
  },
  
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Compound index for unique attendance per class per day
attendanceSchema.index({ class: 1, date: 1 }, { unique: true });

// Update timestamp on save
attendanceSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Virtual for stats
attendanceSchema.virtual('present_count').get(function() {
  return this.records.filter(r => r.status === 'present').length;
});

attendanceSchema.virtual('absent_count').get(function() {
  return this.records.filter(r => r.status === 'absent').length;
});

attendanceSchema.virtual('total_students').get(function() {
  return this.records.length;
});

// Ensure virtuals are included in JSON
attendanceSchema.set('toJSON', { virtuals: true });
attendanceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Attendance", attendanceSchema);