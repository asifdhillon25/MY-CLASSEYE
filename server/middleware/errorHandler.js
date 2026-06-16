const AppError = require("../utils/AppError");

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  // Handle common Mongo errors
  if (err.name === "CastError") {
    err = new AppError("Invalid ID format", 400);
  }
  if (err.code === 11000) {
    err = new AppError("Duplicate field value", 400);
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map(el => el.message)
      .join(", ");
    err = new AppError(message, 400);
  }

  res.status(statusCode).json({
    status,
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// 🔥 THIS LINE IS CRUCIAL 🔥
module.exports = globalErrorHandler;
