# AcademIQ - Student Information System (MERN Stack) with JWT Authentication

## Overview
AcademIQ is a **full-stack** Student Information System built using **MongoDB, Express.js, React (Vite), and Node.js (MERN stack)** with **JWT authentication** and **role-based access control**. It allows **admin, faculty, and students** to manage and view student-related information with secure authentication.

---

## Features

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based authentication system
- **Role-based Access Control**: Different permissions for admin, faculty, and students
- **Protected Routes**: All routes require authentication
- **Password Hashing**: Secure password storage with bcrypt
- **Admin Only Registration**: Only admin users can register new users

### 👨💼 Admin Features
- **User Management**: Complete CRUD operations for students, faculty, and admin accounts
- **Department Management**: Create and manage academic departments with semester structure
- **Subject Management**: Create subjects and assign them to faculty members
- **Attendance Oversight**: View and manage all attendance records across the system
- **Score Management**: Access and manage all test scores and academic performance data
- **Analytics Dashboard**: Comprehensive system analytics with charts and statistics
- **Reports Generation**: Generate detailed reports on attendance, performance, and system usage

### 👨🏫 Faculty Features
- **Attendance Management**: Mark daily attendance for assigned subjects with real-time statistics
- **Score Entry**: Enter and manage test scores, assignments, and grades with automatic grade calculation
- **Student Monitoring**: View student information and academic progress for assigned classes
- **Course Management**: Manage assigned courses and subject details
- **Performance Reports**: Generate and view reports for student performance in their subjects

### 👨🎓 Student Features
- **Profile Management**: View and edit personal information and academic details
- **Course Information**: Access information about enrolled courses and subjects
- **Attendance Tracking**: View personal attendance records and statistics
- **Grade Monitoring**: Access personal test scores, grades, and academic performance
- **Progress Reports**: View comprehensive academic progress and performance reports

### 📊 Analytics & Reporting
- **Dashboard Statistics**: Real-time system statistics and key performance indicators
- **Attendance Analytics**: Department-wise and subject-wise attendance analysis
- **Performance Metrics**: Grade distribution, average scores, and academic performance trends
- **Visual Charts**: Interactive charts and graphs for data visualization
- **Export Capabilities**: Generate and export reports in various formats

---

## Installation and Setup
### 1. Clone the Repository
```bash
git clone https://github.com/joe-anidas/student-information-system.git
cd student-information-system
```

### 2. Backend Setup (Express + MongoDB + JWT)
```bash
cd backend
npm install
```

#### Backend Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=3000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/sis

# JWT Configuration
JWT_SECRET=jwt-secret-change-me-in-production

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**Environment Variables Explanation:**
- `PORT`: Port number for the backend server (default: 5000)
- `MONGO_URI`: MongoDB connection string (Atlas or local)
- `JWT_SECRET`: Secret key for JWT token signing (change in production)
- `CORS_ORIGIN`: Allowed frontend origin for CORS

#### Create Admin User
```bash
node createAdmin.js
```
This creates an admin user with:
- Email: `admin@sis.com`
- Password: `admin123`
- Role: `admin`

#### Create Sample Data (Optional)
```bash
npm run create-sample-data
```
This creates comprehensive sample data including:
- 3 departments (CSE, ECE, MECH)
- 4 faculty members
- 6 students
- 6 subjects with faculty assignments
- Sample attendance records
- Sample test scores and grades

#### Start Backend Server
```bash
npm start
```

### 3. Frontend Setup (React + Vite)
```bash
cd ../frontend
npm install
```

#### Frontend Environment Variables
Create a `.env` file in the `frontend` directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
```

**Environment Variables Explanation:**
- `VITE_API_BASE_URL`: Backend API base URL for frontend requests

#### Start Frontend Development Server
```bash
npm run dev
```

---

## Environment Variables Reference

### Backend Environment Variables (`.env` in `/backend`)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Port number for the backend server | `3000` | No |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/sis` | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | `jwt-secret-change-me` | Yes |
| `CORS_ORIGIN` | Allowed frontend origin for CORS | `http://localhost:5173` | No |

### Frontend Environment Variables (`.env` in `/frontend`)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` | No |

### Production Environment Variables

For production deployment, make sure to:

1. **Change JWT_SECRET**: Use a strong, random secret key
2. **Update CORS_ORIGIN**: Set to your production frontend URL
3. **Use Production MongoDB**: Use MongoDB Atlas or production database
4. **Set Secure PORT**: Use environment-specific port numbers

**Example Production Backend `.env`:**
```env
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sis?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key-here
CORS_ORIGIN=https://your-frontend-domain.com
```

**Example Production Frontend `.env`:**
```env
VITE_API_BASE_URL=https://your-backend-api.com
```

---

## Running the Full Stack Application

### **Start Backend**
```bash
cd backend
npm start
```

### **Start Frontend**
```bash
cd frontend
npm run dev
```

### **Create Sample Data (Optional)**
```bash
cd backend
npm run create-sample-data
```

### **Access the Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

### **Test Credentials**
After running the sample data script:
- **Admin**: `admin@sis.com` / `admin123`
- **Faculty**: `faculty@sis.com` / `faculty123`
- **Student**: `student@sis.com` / `student123`

---

## User Roles and Permissions

### Admin
- **Login**: `admin@sis.com` / `admin123`
- **Permissions**: 
  - **User Management**: Create, edit, delete students, faculty, and admin accounts
  - **Department Management**: Create and manage academic departments with semester structure
  - **Subject Management**: Create subjects and assign them to faculty members
  - **Attendance Management**: View and manage all attendance records
  - **Score Management**: View and manage all test scores and grades
  - **Analytics & Reports**: Access comprehensive system analytics and performance reports
  - **System Administration**: Full access to all system features

### Faculty
- **Login**: `faculty@sis.com` / `faculty123`
- **Permissions**:
  - **Attendance Management**: Mark and manage attendance for assigned subjects
  - **Score Management**: Enter and manage test scores for assigned subjects
  - **Student Information**: View student details for their classes
  - **Course Management**: Manage assigned courses and subjects
  - **Reports**: View attendance and performance reports for their subjects

### Student
- **Login**: `student@sis.com` / `student123`
- **Permissions**:
  - **Profile Management**: View and edit personal information
  - **Course Information**: View enrolled courses and subjects
  - **Attendance Records**: View personal attendance records
  - **Academic Performance**: View personal test scores and grades
  - **Reports**: View personal academic reports and progress

---

## Project Structure
```
/student-information-system
│── /backend (Backend - Express, MongoDB, JWT)
│   ├── config/           # Configuration files
│   │   ├── env.js        # Environment variables
│   │   └── db.js         # Database connection
│   ├── controllers/      # Business logic controllers
│   │   └── authController.js # Authentication logic
│   ├── middleware/       # JWT authentication & validation
│   │   └── auth.js       # JWT middleware
│   ├── models/           # MongoDB schemas
│   │   ├── User.js       # User model with roles
│   │   ├── Department.js # Department model
│   │   ├── Subject.js    # Subject model
│   │   ├── Attendance.js # Attendance model
│   │   └── Score.js      # Score/Grade model
│   ├── routes/           # API route definitions
│   │   ├── authRoutes.js # Authentication routes
│   │   ├── users.js      # User management routes
│   │   ├── departments.js # Department routes
│   │   ├── subjects.js   # Subject routes
│   │   ├── attendance.js # Attendance routes
│   │   └── scores.js     # Score routes
│   ├── .env              # Environment variables
│   ├── createAdmin.js    # Admin user creation script
│   ├── createSampleData.js # Sample data generation
│   └── server.js         # Entry point
│
│── /frontend (Frontend - React, Vite, Tailwind CSS)
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   │   ├── Navbar.jsx # Navigation component
│   │   │   ├── ProtectedRoute.jsx # Route protection
│   │   │   ├── DataTable.jsx # Data display component
│   │   │   └── Form.jsx  # Form components
│   │   ├── lib/          # Utility libraries
│   │   │   └── api.js    # API client and utilities
│   │   ├── pages/        # Page components
│   │   │   ├── admin/    # Admin pages
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── UserManagement.jsx
│   │   │   │   ├── DepartmentManagement.jsx
│   │   │   │   ├── SubjectManagement.jsx
│   │   │   │   └── AnalyticsReports.jsx
│   │   │   ├── faculty/  # Faculty pages
│   │   │   │   ├── FacultyDashboard.jsx
│   │   │   │   ├── AttendanceManagement.jsx
│   │   │   │   └── ScoreManagement.jsx
│   │   │   ├── student/  # Student pages
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   ├── StudentView.jsx
│   │   │   │   ├── CourseView.jsx
│   │   │   │   └── ReportView.jsx
│   │   │   └── auth/     # Authentication pages
│   │   │       └── LogoutLayout.jsx
│   │   ├── App.jsx       # Main app component with routing
│   │   └── main.jsx      # App entry point
│   ├── .env              # Environment variables
│   └── package.json
│
│── DOC.md                # Detailed project documentation
│── README.md             # This file
```

---

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - Register new user (admin only)
- `GET /auth/profile` - Get user profile

### Users (Protected)
- `GET /users` - Get all users with filtering (admin only)
- `GET /users/:id` - Get specific user
- `PUT /users/:id` - Update user (admin or own profile)
- `DELETE /users/:id` - Delete user (admin only)
- `GET /users/stats/dashboard` - Get dashboard statistics (admin only)

### Departments (Protected)
- `GET /departments` - Get all departments
- `GET /departments/:id` - Get specific department
- `POST /departments` - Create department (admin only)
- `PUT /departments/:id` - Update department (admin only)
- `DELETE /departments/:id` - Delete department (admin only)

### Subjects (Protected)
- `GET /subjects` - Get all subjects with filtering
- `GET /subjects/:id` - Get specific subject
- `POST /subjects` - Create subject (admin only)
- `PUT /subjects/:id` - Update subject (admin only)
- `DELETE /subjects/:id` - Delete subject (admin only)

### Attendance (Protected)
- `GET /attendance` - Get attendance records (role-based filtering)
- `GET /attendance/:id` - Get specific attendance record
- `POST /attendance` - Mark attendance (admin, faculty)
- `PUT /attendance/:id` - Update attendance (admin, faculty)
- `DELETE /attendance/:id` - Delete attendance (admin, faculty)
- `GET /attendance/stats/summary` - Get attendance statistics

### Scores (Protected)
- `GET /scores` - Get score records (role-based filtering)
- `GET /scores/:id` - Get specific score record
- `POST /scores` - Add score (admin, faculty)
- `PUT /scores/:id` - Update score (admin, faculty)
- `DELETE /scores/:id` - Delete score (admin, faculty)
- `GET /scores/stats/summary` - Get score statistics
- `GET /scores/student/:studentId/performance` - Get student performance

---

## Technologies Used
- **Frontend:** React (Vite), React Router, JWT Authentication
- **Backend:** Express.js, MongoDB, Node.js, JWT, bcryptjs
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcrypt password hashing, CORS protection

---

## Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API endpoints
- CORS configuration
- Token expiration handling
- Input validation

---

## License
This project is open-source and available under the **MIT License**.

