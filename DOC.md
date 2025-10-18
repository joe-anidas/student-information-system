
## 🧾 Project Documentation: AcademIQ Student Information System (SIS)

### **1. Project Overview**

**AcademIQ SIS** is a web-based **Student Information System** designed to manage the complete academic data and administrative workflow of an educational institution.

The platform provides a **unified login system** for **Students, Faculty, and Admins** with **JWT-based authentication and role-based access control**.

Each user role has specific responsibilities and permissions:

* **Admin** → Manages users, departments, subjects, attendance, academic records, and analytics.
* **Faculty** → Handles attendance, internal marks, and academic reports for their assigned subjects.
* **Student** → Views academic profile, attendance records, internal scores, and semester history.

---

### **2. Technology Stack**

| Layer          | Technology                                                        |
| -------------- | ----------------------------------------------------------------- |
| Frontend       | React.js, Tailwind CSS (with Context API or Redux for auth state) |
| Backend        | Node.js + Express.js                                              |
| Database       | MongoDB (NoSQL)                                                   |
| Authentication | JWT (JSON Web Token)                                              |
| Hosting        | Vercel / Render                                                   |
| Analytics      | Chart.js / Recharts                                               |

---

### **3. Authentication & Authorization**

#### **3.1 Unified Login System**

* A **single login page** for all user roles (Admin, Faculty, Student).
* On successful login, a **JWT token** is generated containing user role and ID.
* Token is stored in frontend local storage and validated by middleware for every protected route.

#### **3.2 Roles and Permissions**

| Role        | Access Level | Key Permissions                                          |
| ----------- | ------------ | -------------------------------------------------------- |
| **Admin**   | Full Access  | Manage users, subjects, attendance, test data, analytics |
| **Faculty** | Moderate     | Manage attendance and marks for assigned subjects        |
| **Student** | Limited      | View profile, attendance, and performance reports        |

---

### **4. Admin Module**

#### **4.1 Dashboard Overview**

* Displays institutional statistics such as:

  * Total Students / Faculty
  * Department & Year-wise distribution
  * Attendance percentage trends
  * Average performance metrics

#### **4.2 User Management**

* Add / Edit / Remove **Students** and **Faculty** accounts

  * Fields: Name, Email, Password, Department, Year, Role
* Generate system credentials and manage password reset.
* Auto email notifications for new user creation (optional).

#### **4.3 Department & Subject Management**

* Create and manage **Departments** and **Semester structures**.
* Assign subjects to specific faculty members.
* Map subjects to department-year-semester (e.g., CSE → III Year → Sem 5).

#### **4.4 Academic Records Management**

* Access and modify:

  * Attendance data
  * Test/Assignment scores
  * Semester-wise performance

#### **4.5 Analytics and Reports**

* View analytics by:

  * Department performance
  * Subject-wise averages
  * Attendance shortages and trends
* Graphical visualization using **Chart.js / Recharts**.

#### **4.6 User Deactivation / Removal**

* Permanently remove a user (student/faculty).
* Ensure cascading deletion of related records (attendance, scores, etc.).

---

### **5. Faculty Module**

#### **5.1 Faculty Dashboard**

* Overview of assigned subjects and classes.
* Key metrics: student count, attendance averages, performance charts.

#### **5.2 Attendance Management**

* Mark and update attendance for assigned subjects.
* Record attendance per subject per date.
* Generate subject-wise and date-wise attendance reports.

#### **5.3 Internal Marks & Assessment Management**

* Enter and edit marks for:

  * Internal tests (Test 1, Test 2, Model Exam)
  * Assignments
* Download or upload marks through CSV (optional).

#### **5.4 Academic Reports Access**

* View students’ academic records within assigned subjects.
* Export data for reporting and analysis.

---

### **6. Student Module**

#### **6.1 Student Dashboard**

* Displays:

  * Personal details and academic profile
  * Current semester subjects
  * Attendance summary per subject
  * Internal marks overview

#### **6.2 Academic History**

* View previous semester records, subject-wise marks, and attendance logs.
* Filter results by semester or subject.

#### **6.3 Profile Management**

* Manage profile details: name, register number, department, email.
* Option to change password.

---

### **7. Database Design (Simplified)**

#### **Collections / Tables**

1. **Users**

   * `_id`
   * `name`
   * `email`
   * `password`
   * `role` (admin/faculty/student)
   * `department`
   * `year`
   * `subjectsAssigned` (for faculty)
   * `rollNumber` (for students)

2. **Departments**

   * `_id`
   * `name`
   * `semesters`: [ { semNo, subjects: [subjectIds] } ]

3. **Subjects**

   * `_id`
   * `name`
   * `code`
   * `facultyId`
   * `department`
   * `semester`

4. **Attendance**

   * `_id`
   * `studentId`
   * `subjectId`
   * `date`
   * `status` (Present/Absent)

5. **Scores**

   * `_id`
   * `studentId`
   * `subjectId`
   * `testType` (Test1, Test2, Assignment)
   * `marks`

---

### **8. JWT Authentication Flow**

1. User logs in with email and password.
2. Backend validates credentials and issues a JWT:

   ```json
   {
     "token": "abc.def.ghi",
     "user": {
       "role": "faculty",
       "name": "Shobana"
     }
   }
   ```
3. The frontend stores the token securely.
4. Backend middleware verifies tokens using `jwt.verify(token, process.env.JWT_SECRET)`.
5. Role-based route guards enforce access permissions.

---

### **9. Future Enhancements**

* Integration with ERP systems for financial or HR modules.
* Email and SMS notifications for attendance shortages.
* Student progress prediction using analytics/AI.
* Bulk import/export of student data via CSV/Excel.
* Integration with biometric or RFID attendance systems.

---

✅ **Summary**
Your new version — **AcademIQ SIS** — focuses on **data-driven academic management** (enrollment, attendance, marks, and performance reports).
It provides institutional control and transparency, bridging admin workflows, faculty data entry, and student access through a secure, role-based architecture.

