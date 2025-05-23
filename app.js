// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();
// import mongoose from "mongoose";
// import cors from "cors";
// import userRoutes from "./router/userRouter.js";
// import hostelRoutes from "./router/hostelRouter.js";
// import cookieParser from "cookie-parser";
// import roomRoutes from "./router/roomRouter.js";
// import authRoutes from "./router/auth.js";
// import reviewRouter from "./router/reviewRouter.js";
// import meesRouter from "./router/meesRouter.js";
// import tenantRouter from "./router/tenantRouter.js";
// import paymentsRoutes from "./router/paymentRoutes.js";
// import maintenanceRouter from "./router/maintenanceRouter.js";


// const app = express();

// // IMPORTANT: Set payload size limits BEFORE other middleware
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));

// app.use(cookieParser());
// // app.use(
// //   cors({
// //     origin: ["https://hms-frontend-ecru.vercel.app"],// http://localhost:3000
// //     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
// //     credentials: true,
// //   })
// // );

// app.use(
//   cors({
//     origin: [
//       "https://hms-frontend-ecru.vercel.app",  // deployed frontend https://hms-frontend-ecru.vercel.app/
//       "http://localhost:3000",                 // local dev frontend
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     credentials: true,
//   })
// );


// const PORT = process.env.PORT || 5001;

// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/hostel", hostelRoutes);
// app.use("/api/hostel/room", roomRoutes);
// app.use("/api/review", reviewRouter);
// app.use("/api", meesRouter);
// app.use("/api/tenants", tenantRouter);
// app.use("/api/payments", paymentsRoutes);
// app.use("/api/", maintenanceRouter);

// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });


// const initializeDBAndServer = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("DB Connection: Success");
//     app.listen(PORT, () =>
//       console.log(`Server running on port http://localhost:${PORT}`)
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

// initializeDBAndServer();


import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// Route imports
import authRoutes from "./router/auth.js";
import userRoutes from "./router/userRouter.js";
import hostelRoutes from "./router/hostelRouter.js";
import roomRoutes from "./router/roomRouter.js";
import reviewRouter from "./router/reviewRouter.js";
import meesRouter from "./router/meesRouter.js";
import tenantRouter from "./router/tenantRouter.js";
import paymentsRoutes from "./router/paymentRoutes.js";
import maintenanceRouter from "./router/maintenanceRouter.js";

// Initialize app and environment
dotenv.config();
const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// CORS Configuration
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://hms-frontend-ecru.vercel.app"]
    : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/hostel", hostelRoutes);
app.use("/api/hostel/room", roomRoutes);
app.use("/api/review", reviewRouter);
app.use("/api/mees", meesRouter);
app.use("/api/tenants", tenantRouter);
app.use("/api/payments", paymentsRoutes);
app.use("/api/maintenance", maintenanceRouter);

// Health Check Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running 🚀");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

// Server & Database Initialization
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

startServer();
