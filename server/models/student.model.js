// studentSchema.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  roll_no: {
    type: String,
    required: true,
    unique: true,
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
  year: {
    type: Number,
    required: true,
  },
  photo_url: {
    type: String,
  },
  phone: {
    type: String,
  },
  date_of_birth: {
    type: Date,
  },
  semester: {
    type: String,
  },
  
  // Face Recognition Fields
   face_embedding: {
    type: [Number], // This expects a 1D array of numbers
    default: [],
    // validate: {
    //   validator: function(v) {
    //     // Validate that it's a 1D array of numbers
    //     return Array.isArray(v) && 
    //            v.every(item => typeof item === 'number') &&
    //            v.length === 512; // Ensure it's exactly 512 dimensions
    //   },
    //   message: 'Face embedding must be a 512-dimensional array of numbers'
    // }
  },
  has_embeddings: {
    type: Boolean,
    default: false,
  },
  embeddings_updated_at: {
    type: Date,
  },
  embeddings_image_count: {
    type: Number,
    default: 0,
  },
  
  classes_enrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
studentSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model("Students", studentSchema);