import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login/Login';

import Admin from './admin/AdminDashboard';
import FacultyInfo from './admin/FacultyInfo';
import StudentInfo from './admin/StudentInfo';
import CourseInfo from './admin/CourseInfo';
import ReportView from './admin/ReportView';

import Faculty from './faculty/FacultyDashboard';
import ReportInfo from './faculty/ReportInfo';
import CourseDetails from './faculty/CourseDetails';
import StudentInfoView from './faculty/StudentInfoView';


import Student from './student/StudentDashboard';
import StudentView from './student/StudentView';
import CourseView from './student/CourseView';
import Report from './student/ReportView';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/student" element={<Student />} />
        <Route path="/student-info-view" element={<StudentInfoView />} />
        <Route path="/student-info" element={<StudentInfo />} />
        <Route path="/faculty-info" element={<FacultyInfo />} />
        <Route path="/course-info" element={<CourseInfo />} />
        <Route path="/report-info" element={<ReportInfo />} />
        <Route path="/course-details" element={<CourseDetails />} />
        <Route path="/student-view" element={<StudentView />} />
      
        <Route path="/course-view" element={<CourseView />} />
        <Route path="/report-view" element={<ReportView />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;