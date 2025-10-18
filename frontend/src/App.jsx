import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Logout from './pages/auth/LogoutLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Components
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import SubjectManagement from './pages/admin/SubjectManagement';
import AnalyticsReports from './pages/admin/AnalyticsReports';
import FacultyInfo from './pages/admin/FacultyInfo';
import StudentInfo from './pages/admin/StudentInfo';
import CourseInfo from './pages/admin/CourseInfo';
import ReportView from './pages/admin/ReportView';

// Faculty Components
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import AttendanceManagement from './pages/faculty/AttendanceManagement';
import ScoreManagement from './pages/faculty/ScoreManagement';
import ReportInfo from './pages/faculty/ReportInfo';
import CourseDetails from './pages/faculty/CourseDetails';
import StudentInfoView from './pages/faculty/StudentInfoView';

// Student Components
import StudentDashboard from './pages/student/StudentDashboard';
import StudentView from './pages/student/StudentView';
import CourseView from './pages/student/CourseView';
import Report from './pages/student/ReportView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/logout" element={<Logout />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="admin">
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/departments" element={
          <ProtectedRoute requiredRole="admin">
            <DepartmentManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/subjects" element={
          <ProtectedRoute requiredRole="admin">
            <SubjectManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/attendance" element={
          <ProtectedRoute requiredRole="admin">
            <AttendanceManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/scores" element={
          <ProtectedRoute requiredRole="admin">
            <ScoreManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute requiredRole="admin">
            <AnalyticsReports />
          </ProtectedRoute>
        } />
        <Route path="/student-info" element={
          <ProtectedRoute requiredRole="admin">
            <StudentInfo />
          </ProtectedRoute>
        } />
        <Route path="/faculty-info" element={
          <ProtectedRoute requiredRole="admin">
            <FacultyInfo />
          </ProtectedRoute>
        } />
        <Route path="/course-info" element={
          <ProtectedRoute requiredRole="admin">
            <CourseInfo />
          </ProtectedRoute>
        } />
        <Route path="/report-view" element={
          <ProtectedRoute requiredRole="admin">
            <ReportView />
          </ProtectedRoute>
        } />

        {/* Faculty Routes */}
        <Route path="/faculty" element={
          <ProtectedRoute requiredRole="faculty">
            <FacultyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student-info-view" element={
          <ProtectedRoute requiredRole="faculty">
            <StudentInfoView />
          </ProtectedRoute>
        } />
        <Route path="/report-info" element={
          <ProtectedRoute requiredRole="faculty">
            <ReportInfo />
          </ProtectedRoute>
        } />
        <Route path="/course-details" element={
          <ProtectedRoute requiredRole="faculty">
            <CourseDetails />
          </ProtectedRoute>
        } />
        <Route path="/faculty/attendance" element={
          <ProtectedRoute requiredRole="faculty">
            <AttendanceManagement />
          </ProtectedRoute>
        } />
        <Route path="/faculty/scores" element={
          <ProtectedRoute requiredRole="faculty">
            <ScoreManagement />
          </ProtectedRoute>
        } />

        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student-view" element={
          <ProtectedRoute requiredRole="student">
            <StudentView />
          </ProtectedRoute>
        } />
        <Route path="/course-view" element={
          <ProtectedRoute requiredRole="student">
            <CourseView />
          </ProtectedRoute>
        } />
        <Route path="/report" element={
          <ProtectedRoute requiredRole="student">
            <Report />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;