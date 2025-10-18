import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { PORT, MONGO_URI, CORS_ORIGIN } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/users.js';
import departmentRoutes from './routes/departments.js';
import subjectRoutes from './routes/subjects.js';
import attendanceRoutes from './routes/attendance.js';
import scoreRoutes from './routes/scores.js';
import { authenticateToken, requireRole } from './middleware/auth.js';

const app = express();

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || CORS_ORIGIN.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: "ok", 
    service: "AcademIQ Student Information System Backend",
    version: "1.0.0",
    endpoints: {
      auth: "/auth",
      users: "/users",
      departments: "/departments", 
      subjects: "/subjects",
      attendance: "/attendance",
      scores: "/scores"
    }
  });
});

// Auth routes (public)
app.use('/auth', authRoutes);

// Protected routes
app.use('/users', userRoutes);
app.use('/departments', departmentRoutes);
app.use('/subjects', subjectRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/scores', scoreRoutes);

app.listen(PORT, () => {
  console.log(`🚀 AcademIQ Backend Server is running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints available at http://localhost:${PORT}`);
});