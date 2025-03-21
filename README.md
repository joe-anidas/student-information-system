# Student Information System (MERN Stack)

## Overview
This is a **full-stack** Student Information System built using **MongoDB, Express.js, React (Vite), and Node.js (MERN stack)**. It allows **admin, faculty, and students** to manage and view student-related information.

---

## Features
- **Admin:** View reports, add/delete students, faculty, and courses.
- **Faculty:** Add/delete reports and courses, view student information.
- **Student:** View information, courses, register for courses, and check reports.

---

## Installation and Setup
### 1. Clone the Repository
```bash
git clone https://github.com/joe-anidas/student-information-system.git
cd student-information-system
```

### 2. Backend Setup (Express + MongoDB)
```bash
cd backend
npm install
```
- Configure MongoDB connection in `.env` file:
  ```env
  PORT=5000
  MONGODB_URI=mongodb://localhost:27017/sis
  ```
- Start the backend server:
  ```bash
  npm run dev
  ```

### 3. Frontend Setup (React + Vite)
```bash
cd ../frontend
npm install
```
- Start the frontend development server:
  ```bash
  npm run dev
  ```

---

## Running the Full Stack Application
### **Start Backend**
```bash
cd backend && npm run dev
```
### **Start Frontend**
```bash
cd frontend && npm run dev
```

---

## Project Structure
```
/student-information-system
│── /backend (Backend - Express, MongoDB)
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── controllers/  # Logic for handling requests
│   ├── middleware/   # Authentication & validation
│   ├── .env          # Environment variables
│   ├── server.js     # Entry point
│
│── /frontend (Frontend - React, Vite)
│   ├── src/          # React components & pages
│   ├── public/       # Static assets
│   ├── main.jsx      # React entry file
│   ├── App.jsx       # App structure
│
│── .gitignore        # Ignore node_modules & sensitive files
│── package.json      # Project dependencies
│── README.md         # Project documentation
```

---

## Technologies Used
- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Express.js, MongoDB, Node.js, CORS
- **Database:** MongoDB Atlas (or local MongoDB)

---

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Added feature X"`).
4. Push to your branch (`git push origin feature-name`).
5. Open a pull request.

---

## License
This project is open-source and available under the **MIT License**.

