import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./router/userRouter.js";
import hostelRoutes from "./router/hostelRouter.js";
import cookieParser from "cookie-parser";
import roomRoutes from "./router/roomRouter.js";
import authRoutes from "./router/auth.js";
import reviewRouter from "./router/reviewRouter.js";
import meesRouter from "./router/meesRouter.js";
import tenantRouter from "./router/tenantRouter.js";
import paymentsRoutes from "./router/paymentRoutes.js";
import maintenanceRouter from "./router/maintenanceRouter.js";


const app = express();

// IMPORTANT: Set payload size limits BEFORE other middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://hms-frontend-ecru.vercel.app",  // deployed frontend https://hms-frontend-ecru.vercel.app/
      "http://localhost:3000",                 // local dev frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);


const PORT = process.env.PORT || 5001;

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/hostel", hostelRoutes);
app.use("/api/hostel/room", roomRoutes);
app.use("/api/review", reviewRouter);
app.use("/api", meesRouter);
app.use("/api/tenants", tenantRouter);
app.use("/api/payments", paymentsRoutes);
app.use("/api/", maintenanceRouter);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


const initializeDBAndServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connection: Success");
    app.listen(PORT, () =>
      console.log(`Server running on port http://localhost:${PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

initializeDBAndServer();

// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// // Route imports
// import authRoutes from "./router/auth.js";
// import userRoutes from "./router/userRouter.js";
// import hostelRoutes from "./router/hostelRouter.js";
// import roomRoutes from "./router/roomRouter.js";
// import reviewRouter from "./router/reviewRouter.js";
// import meesRouter from "./router/meesRouter.js";
// import tenantRouter from "./router/tenantRouter.js";
// import paymentsRoutes from "./router/paymentRoutes.js";
// import maintenanceRouter from "./router/maintenanceRouter.js";

// // Initialize app and environment
// dotenv.config();
// const app = express();

// // Middleware
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(cookieParser());

// // CORS Configuration - Fixed and Enhanced
// const allowedOrigins = [
//   "https://hms-frontend-ecru.vercel.app",
//   "http://localhost:3000",
//   "http://localhost:3001",
//   "http://127.0.0.1:3000"
// ];

// // Log environment for debugging
// console.log("🔍 NODE_ENV:", process.env.NODE_ENV);
// console.log("🔍 Allowed Origins:", allowedOrigins);

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like mobile apps or curl requests)
//       if (!origin) return callback(null, true);
      
//       if (allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         console.log("❌ CORS Error - Origin not allowed:", origin);
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: [
//       "Origin",
//       "X-Requested-With",
//       "Content-Type",
//       "Accept",
//       "Authorization",
//       "Cache-Control"
//     ],
//     credentials: true,
//     optionsSuccessStatus: 200 // For legacy browser support
//   })
// );

// // Additional CORS debugging middleware
// app.use((req, res, next) => {
//   console.log("🔍 Request Origin:", req.headers.origin);
//   console.log("🔍 Request Method:", req.method);
  
//   // Set additional CORS headers manually as fallback
//   res.header("Access-Control-Allow-Origin", req.headers.origin);
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control"
//   );
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );

//   // Handle preflight requests
//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   next();
// });

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/hostel", hostelRoutes);
// app.use("/api/hostel/room", roomRoutes);
// app.use("/api/review", reviewRouter);
// app.use("/api/mees", meesRouter);
// app.use("/api/tenants", tenantRouter);
// app.use("/api/payments", paymentsRoutes);
// app.use("/api/maintenance", maintenanceRouter);

// // Health Check Route
// app.get("/", (req, res) => {
//   res.json({
//     message: "✅ Backend is running 🚀",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV,
//     allowedOrigins: allowedOrigins
//   });
// });

// // CORS Test Route
// app.get("/api/test-cors", (req, res) => {
//   res.json({
//     message: "CORS is working!",
//     origin: req.headers.origin,
//     timestamp: new Date().toISOString()
//   });
// });

// // 404 Handler
// app.use((req, res) => {
//   console.log("❌ Route not found:", req.method, req.path);
//   res.status(404).json({ 
//     message: "❌ Route not found",
//     path: req.path,
//     method: req.method
//   });
// });

// // Global Error Handler
// app.use((err, req, res, next) => {
//   console.error("🔥 Server Error:", err);
  
//   // CORS Error
//   if (err.message === 'Not allowed by CORS') {
//     return res.status(403).json({
//       message: "CORS Error: Origin not allowed",
//       origin: req.headers.origin
//     });
//   }
  
//   res.status(500).json({ 
//     message: "Something went wrong on the server.",
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // Server & Database Initialization
// const PORT = process.env.PORT || 5001;

// const startServer = async () => {
//   try {
//     // MongoDB Connection
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ MongoDB connected");
    
//     // Start Server
//     app.listen(PORT, '0.0.0.0', () => {
//       console.log(`🚀 Server running at http://localhost:${PORT}`);
//       console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
//       console.log(`🔗 Allowed Origins:`, allowedOrigins);
//     });
//   } catch (err) {
//     console.error("❌ Failed to start server:", err);
//     process.exit(1);
//   }
// };

// startServer();

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('👋 SIGTERM received. Shutting down gracefully...');
//   mongoose.connection.close(() => {
//     console.log('📦 MongoDB connection closed.');
//     process.exit(0);
//   });
// });

// process.on('SIGINT', () => {
//   console.log('👋 SIGINT received. Shutting down gracefully...');
//   mongoose.connection.close(() => {
//     console.log('📦 MongoDB connection closed.');
//     process.exit(0);
//   });
// });