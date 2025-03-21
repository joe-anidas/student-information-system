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
app.use(cors());
app.use(express.json());

// Routes
app.use('/students', studentRoutes);
app.use('/faculty', facultyRoutes);
app.use('/courses', courseRoutes);
app.use('/marks', marksRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});