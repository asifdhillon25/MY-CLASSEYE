// index.js (or server.js)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const globalErrorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");

const app = express();

// =======================
// Increase Payload Size Limit FIRST (BEFORE other middleware)
// =======================
app.use(express.json({ limit: "50mb" })); // Increased from default ~1mb
app.use(express.urlencoded({ 
  extended: true, 
  limit: "50mb", 
  parameterLimit: 100000 // Increase parameter limit
}));

// =======================
// CORS Setup
// =======================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://192.168.1.6:5173/",
      "http://192.168.1.6:5173" ,// Added without trailing slash
      "https://my-classeye.vercel.app" 
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type", 
      "Authorization", 
      "X-Requested-With",
      "Accept",
      "Origin"
    ],
    exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],
    maxAge: 86400, // 24 hours
  })
);

// Handle preflight requests
// app.options("*", cors()); // Enable pre-flight for all routes

// =======================
// Cookie Parser
// =======================
app.use(cookieParser());

// =======================
// Logging Middleware (for debugging)
// =======================
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// =======================
// Test route
// =======================
app.get("/", (req, res) => {
  res.send("🚀 Server is up and running!");
});




const migrateStudents = require("./migration/migrateStudents");

 








// ======================= 
// API Routes
// =======================
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/users", require("./routes/user.route"));
app.use("/api/teachers", require("./routes/teacher.route"));
app.use("/api/students", require("./routes/student.route"));
app.use("/api/classes", require("./routes/class.route"));
app.use("/api/upload", require("./routes/upload.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));



// In your Express app setup
app.use("/api/attendance", require("./routes/attendance.routes"));

// =======================
// Handle unknown routes (404)
// =======================
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// =======================
// Global error handler
// =======================
app.use(globalErrorHandler);

// =======================
// Start server
// =======================
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
     
    app.listen(PORT,"0.0.0.0", () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ CORS enabled for: ${[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://192.168.1.6:5173",
        "http://192.168.1.6:5173/"
      ].join(", ")}`);
      console.log(`✅ Payload limit increased to 50MB`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  });


  