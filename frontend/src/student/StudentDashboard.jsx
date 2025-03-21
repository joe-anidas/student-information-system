import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './css/StudentDashboard.css';

function Student() {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
           <Navbar />
      <h2>Welcome Student</h2>
      <div className="admin-folders">
        <div className="folder student-info" onClick={() => navigate('/student-view')}>
          <span>Student Information</span>
        </div>
        <div className="folder course-details" onClick={() => navigate('/course-view')}>
          <span>Course Details</span>
        </div>
        <div className="folder report" onClick={() => navigate('/report')}>
          <span>Report</span>
        </div>
      </div>
    </div>
  );
}

export default Student;