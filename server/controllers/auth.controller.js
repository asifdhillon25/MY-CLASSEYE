const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/AppError");

// Login controller
async function login(req, res, next) {
  try {
console.log("req",req.body);
    const { email, password } = req.body;
    
    
    if (!email || !password)
      return next(new AppError("Email and password are required", 400));

    const user = await User.findOne({ email });
    if (!user)
      return next(new AppError("Invalid credentials", 401));

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return next(new AppError("Invalid credentials", 401));

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const { password_hash, ...userData } = user._doc;

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: { user: userData ,token:token },
    });
  } catch (err) {
    next(err);
  }
}

// Logout controller
function logout(req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    expires: new Date(0), // 👈 kill the cookie
  });


  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
}

module.exports = { login, logout };
