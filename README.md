# AcademIQ - Student Information System (MERN Stack) with JWT Authentication

## Overview
AcademIQ is a **full-stack** Student Information System built using **MongoDB, Express.js, React (Vite), and Node.js (MERN stack)** with **JWT authentication** and **role-based access control**. It allows **admin, faculty, and students** to manage and view student-related information with secure authentication.

---

## Features
- **JWT Authentication**: Secure token-based authentication system
- **Role-based Access Control**: Different permissions for admin, faculty, and students
- **Admin Only Registration**: Only admin users can register new users
- **Protected Routes**: All routes require authentication
- **Admin:** View reports, add/delete students, faculty, and courses, register new users
- **Faculty:** Add/delete reports and courses, view student information
- **Student:** View their own information, courses, and reports

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
MONGO_URI=mongodb+srv://joe:joe@joe.wv0k6.mongodb.net/?retryWrites=true&w=majority&appName=JOE

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

### **Access the Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

---

## User Roles and Permissions

### Admin
- **Login**: `admin@sis.com` / `admin123`
- **Permissions**: 
  - Register new users (students, faculty, other admins)
  - View, add, edit, delete all students
  - View, add, edit, delete all faculty
  - View, add, edit, delete all courses
  - View, add, edit, delete all marks
  - View all reports

### Faculty
- **Permissions**:
  - View all students
  - View own faculty profile
  - View, add, edit, delete courses
  - View, add, edit, delete marks
  - View reports

### Student
- **Permissions**:
  - View own student profile
  - View all courses
  - View own marks only
  - View own reports

---

## Project Structure
```
/student-information-system
│── /backend (Backend - Express, MongoDB, JWT)
│   ├── config/       # Configuration files
│   │   ├── env.js    # Environment variables
│   │   └── db.js     # Database connection
│   ├── controllers/  # Authentication controllers
│   ├── middleware/   # JWT authentication & validation
│   ├── models/       # User model with roles
│   ├── routes/       # Protected API routes
│   ├── .env          # Environment variables
│   ├── createAdmin.js # Admin user creation script
│   └── server.js     # Entry point
│
│── /frontend (Frontend - React, Vite, JWT)
│   ├── src/
│   │   ├── components/ # ProtectedRoute component
│   │   ├── lib/        # API utilities
│   │   ├── admin/      # Admin dashboard & components
│   │   ├── faculty/    # Faculty dashboard & components
│   │   ├── student/    # Student dashboard & components
│   │   ├── login/      # JWT login component
│   │   └── App.jsx     # Protected route structure
│   ├── .env            # Environment variables
│   └── package.json
│
│── JWT_SETUP.md        # Detailed JWT setup guide
│── README.md           # This file
```

---

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - Register new user (admin only)
- `GET /auth/profile` - Get user profile

### Students (Protected)
- `GET /students` - Get all students (admin, faculty)
- `GET /students/:id` - Get specific student
- `POST /students` - Create student (admin only)
- `PUT /students/:id` - Update student (admin only)
- `DELETE /students/:id` - Delete student (admin only)

### Faculty (Protected)
- `GET /faculty` - Get all faculty (admin only)
- `GET /faculty/:id` - Get specific faculty
- `POST /faculty` - Create faculty (admin only)
- `PUT /faculty/:id` - Update faculty (admin only)
- `DELETE /faculty/:id` - Delete faculty (admin only)

### Courses (Protected)
- `GET /courses` - Get all courses (all authenticated users)
- `GET /courses/:id` - Get specific course
- `POST /courses` - Create course (admin, faculty)
- `PUT /courses/:id` - Update course (admin, faculty)
- `DELETE /courses/:id` - Delete course (admin, faculty)

### Marks (Protected)
- `GET /marks` - Get marks (students see only their own)
- `GET /marks/:id` - Get specific marks
- `POST /marks` - Create marks (admin, faculty)
- `PUT /marks/:id` - Update marks (admin, faculty)
- `DELETE /marks/:id` - Delete marks (admin, faculty)

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

