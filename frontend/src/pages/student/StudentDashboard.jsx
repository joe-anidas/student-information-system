import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getUser } from '../../lib/api';

function Student() {
  const navigate = useNavigate();
  const user = getUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user?.name}</h1>
            <p className="text-gray-600 text-lg">Student Dashboard - View your academic progress, courses, and reports</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group hover:-translate-y-1 border border-gray-100"
              onClick={() => navigate('/student-view')}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-200 transition-colors">
                <span className="text-3xl">👤</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">My Profile</h3>
              <p className="text-gray-600 text-sm">View and update your personal information and academic details</p>
            </div>

            <div 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group hover:-translate-y-1 border border-gray-100"
              onClick={() => navigate('/course-view')}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4 group-hover:bg-purple-200 transition-colors">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">My Courses</h3>
              <p className="text-gray-600 text-sm">View your enrolled courses, subjects, and academic schedule</p>
            </div>

            <div 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group hover:-translate-y-1 border border-gray-100"
              onClick={() => navigate('/report')}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-lg mb-4 group-hover:bg-orange-200 transition-colors">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">My Reports</h3>
              <p className="text-gray-600 text-sm">View your attendance, grades, and academic performance reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Student;