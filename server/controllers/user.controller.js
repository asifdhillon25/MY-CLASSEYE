// controllers/userController.js
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");


async function createUser(req, res, next) {
  try {
    const { username, email, password, role, linked_id } = req.body;

    if (!username || !email || !password || !role) {
      return next(new AppError("All fields are required", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new AppError("Email already exists", 400));

    const password_hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password_hash, role, linked_id });

    res.status(201).json({
      status: "success",
      data: { user: newUser },
    });
  } catch (err) {
    next(err);
  }
}



async function getAllUsers(req, res, next) {
  try {
    // Fetch users with role-based population
    const users = await User.find()
      .populate({
        path: 'linked_id',
        // Select only necessary fields based on role
        select: function() {
          // Since we can't access user.role in select, we'll use lean and process later
          return 'name email roll_no teacher_id department designation phone';
        },
      })
      .select('username email role status join_date linked_id')
      .lean();

    // Structure the response data
    const structuredUsers = users.map(user => {
      // Base user information
      const userData = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status || 'active',
        joinDate: user.join_date,
      };

      // Add linked document information based on role
      if (user.linked_id) {
        const linkedDoc = user.linked_id;
        
        switch (user.role) {
          case 'student':
            userData.profile = {
              name: linkedDoc.name || 'Unknown Student',
              rollNumber: linkedDoc.roll_no,
              department: linkedDoc.department,
              year: linkedDoc.year,
              profileId: linkedDoc._id,
            };
            break;

          case 'teacher':
            userData.profile = {
              name: linkedDoc.name || 'Unknown Teacher',
              teacherId: linkedDoc.teacher_id,
              department: linkedDoc.department,
              designation: linkedDoc.designation || 'Lecturer',
              phone: linkedDoc.phone,
              profileId: linkedDoc._id,
            };
            break;

          case 'admin':
          case 'super_admin':
            // For admins, linked_id might point to admin profile or be null
            userData.profile = {
              name: 'System Administrator',
              profileId: linkedDoc._id,
              adminLevel: user.role === 'super_admin' ? 'Super Admin' : 'Admin',
            };
            break;

          default:
            userData.profile = {
              name: 'Unknown Profile',
              profileId: linkedDoc._id,
            };
        }
      } else {
        // If no linked document, add placeholder info
        userData.profile = {
          name: 'Profile Not Linked',
          message: `No ${user.role} profile found`,
        };
      }

      return userData;
    });

    // Format the response for your table
    const tableData = structuredUsers.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      joinDate: user.joinDate,
      profileId: user.profile?.profileId,
      // Additional info based on role for table display
      ...(user.role === 'student' && {
        name: user.profile?.name,
        rollNumber: user.profile?.rollNumber,
        department: user.profile?.department,
      }),
      ...(user.role === 'teacher' && {
        name: user.profile?.name,
        teacherId: user.profile?.teacherId,
        designation: user.profile?.designation,
        department: user.profile?.department,
      }),
      ...((user.role === 'admin' || user.role === 'super_admin') && {
        name: user.profile?.name,
        adminLevel: user.profile?.adminLevel,
      }),
    }));

    res.status(200).json({
      status: "success",
      count: structuredUsers.length,
      data: tableData,
      summary: {
        total: structuredUsers.length,
        students: structuredUsers.filter(u => u.role === 'student').length,
        teachers: structuredUsers.filter(u => u.role === 'teacher').length,
        admins: structuredUsers.filter(u => ['admin', 'super_admin'].includes(u.role)).length,
        active: structuredUsers.filter(u => u.status === 'active').length,
        inactive: structuredUsers.filter(u => u.status === 'inactive').length,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    // Log the error for debugging
    console.error('Error in getAllUsers:', err);
    
    // Use AppError for consistent error handling
    return next(new AppError(
      `Failed to fetch users: ${err.message}`,
      500,
      'DATABASE_ERROR'
    ));
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User not found", 404));

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { username, email, password, role } = req.body;
    const updates = { username, email, role };

    if (password) {
      updates.password_hash = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) return next(new AppError("User not found", 404));

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError("User not found", 404));

    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    next(err);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError("Email and password required", 400));

    const user = await User.findOne({ email });
    if (!user) return next(new AppError("Invalid credentials", 401));

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return next(new AppError("Invalid credentials", 401));

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

async function getUsersByRole(req, res, next) {
  try {
    const { role } = req.params;
    const users = await User.find({ role });

    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getUsersByRole,
};
