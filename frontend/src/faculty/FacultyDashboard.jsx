import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './css/FacultyDashboard.css';

function Faculty() {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <Navbar />
      <h2>Welcome Faculty</h2>
      <div className="admin-folders">
        <div className="folder student-info" onClick={() => navigate('/student-info-view')}>
          <span>Student Information</span>
        </div>
        <div className="folder course-details" onClick={() => navigate('/course-details')}>
          <span>Course Details</span>
        </div>
        <div className="folder report" onClick={() => navigate('/report-info')}>
          <span>Report</span>
        </div>
      </div>
    </div>
  );
}

export default Faculty;