const Class = require("../models/class.model");
const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

const createClass = async (req, res, next) => {
  try {
    /**
     * 1️⃣ Allow-list schema fields
     */
    const allowedFields = [
      "class_code",
      "course_name",
      "subject_code",
      "schedule",
      "semester",
      "room",
      "teacher",
    ];

    const filteredBody = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        filteredBody[field] = req.body[field];
      }
    });

    /**
     * 2️⃣ Required fields
     */
    const requiredFields = [
      "class_code",
      "course_name",
      "subject_code",
      "teacher",
    ];

    for (const field of requiredFields) {
      if (!filteredBody[field]) {
        return next(new AppError(`${field} is required`, 400));
      }
    }

    /**
     * 3️⃣ ObjectId validation
     */
    if (!mongoose.Types.ObjectId.isValid(filteredBody.teacher)) {
      return next(new AppError("Invalid teacher ID", 400));
    }

    /**
     * 4️⃣ Schedule validation
     */
    if (filteredBody.schedule) {
      const validDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      if (!Array.isArray(filteredBody.schedule)) {
        return next(new AppError("Schedule must be an array", 400));
      }

      for (const slot of filteredBody.schedule) {
        if (!validDays.includes(slot.day)) {
          return next(
            new AppError(`Invalid day in schedule: ${slot.day}`, 400),
          );
        }
      }
    }

    /**
     * 5️⃣ Create class
     */
    const newClass = new Class(filteredBody);
    const savedClass = await newClass.save();

    res.status(201).json({
      success: true,
      data: savedClass,
    });
  } catch (error) {
    // Mongo duplicate key (unique class_code)
    if (error.code === 11000) {
      return next(
        new AppError("Class with this class_code already exists", 409),
      );
    }

    next(new AppError(error.message, 500));
  }
};

const getAllClasses = async (req, res, next) => {
  try {
    const classes = await Class.find()
      .populate("teacher", "name email")
      .populate("students", "name roll_no");

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    next(new AppError(error.message, 500));
  }
};

const getClassById = async (req, res, next) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError("Invalid class ID", 400));
    }

    const classData = await Class.findById(req.params.id)
      .populate("teacher", "name email")
      .populate("students", "name roll_no");

    if (!classData) {
      return next(new AppError("Class not found", 404));
    }

    res.status(200).json({
      success: true,
      data: classData,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

const updateClass = async (req, res, next) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError("Invalid class ID", 400));
    }

    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedClass) {
      return next(new AppError("Class not found", 404));
    }

    res.status(200).json({
      success: true,
      data: updatedClass,
    });
  } catch (error) {
    // Mongo duplicate key (unique class_code)
    if (error.code === 11000) {
      return next(
        new AppError("Class with this class_code already exists", 409),
      );
    }

    // Validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return next(new AppError(`Validation error: ${messages.join(', ')}`, 400));
    }

    next(new AppError(error.message, 500));
  }
};

const deleteClass = async (req, res, next) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError("Invalid class ID", 400));
    }

    const deletedClass = await Class.findByIdAndDelete(req.params.id);

    if (!deletedClass) {
      return next(new AppError("Class not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
};