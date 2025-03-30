const express = require('express');
const cors = require('cors');
require('dotenv').config();

const studentRoutes = require('./routes/students');
const facultyRoutes = require('./routes/faculty');
const courseRoutes = require('./routes/courses');
const marksRoutes = require('./routes/marks');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const cors = require("cors");

// Allow both local development and deployed frontend on Vercel
const allowedOrigins = [
  "http://localhost:5173",
  "https://student-information-system-dun.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
app.use('/students', studentRoutes);
app.use('/faculty', facultyRoutes);
app.use('/courses', courseRoutes);
app.use('/marks', marksRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});