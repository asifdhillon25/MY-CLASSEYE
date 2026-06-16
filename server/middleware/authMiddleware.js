const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError"); // Your custom error class
const User = require("../models/User");        // Your User model

const protect = async (req, res, next) => {
  let token;

  // 1️⃣ Check Authorization header first (optional)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2️⃣ If no token in header, check cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError("Not authorized, no token provided", 401));
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = await User.findById(decoded.id).select("-password_hash");
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

module.exports = { protect };
