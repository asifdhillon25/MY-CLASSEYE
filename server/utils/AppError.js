class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent constructor (Error)

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // helps distinguish expected vs programming errors

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
