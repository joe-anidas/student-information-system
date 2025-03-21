import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './css/AdminDashboard.css';

function Admin() {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <Navbar />
      <h2>Welcome Admin</h2>
      <div className="admin-folders">
        <div className="folder student-info" onClick={() => navigate('/student-info')}>
          <span>Student Info. Management</span>
        </div>
        <div className="folder faculty-info" onClick={() => navigate('/faculty-info')}>
          <span>Faculty Info. Management</span>
        </div>
        <div className="folder course-details" onClick={() => navigate('/course-info')}>
          <span>Course Details</span>
        </div>
        <div className="folder report" onClick={() => navigate('/report-view')}>
          <span>Report Details</span>
        </div>
      </div>
    </div>
  );
}

export default Admin;