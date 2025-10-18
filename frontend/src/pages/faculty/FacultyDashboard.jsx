import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function Faculty() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Faculty Dashboard</h1>
            <p className="text-gray-600 text-lg">Manage your courses, attendance, and student information</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group hover:-translate-y-1 border border-gray-100"
              onClick={() => navigate('/student-info-view')}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-200 transition-colors">
                <span className="text-3xl">👨‍🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Student Information</h3>
              <p className="text-gray-600 text-sm">View and manage student information for your classes</p>
            </div>

            <div 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group hover:-translate-y-1 border border-gray-100"
              onClick={() => navigate('/course-details')}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4 group-hover:bg-purple-200 transition-colors">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Management</h3>
              <p className="text-gray-600 text-sm">Manage your assigned courses and subjects</p>
            </div>

            <div 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group hover:-translate-y-1 border border-gray-100"
              onClick={() => navigate('/report-info')}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-lg mb-4 group-hover:bg-orange-200 transition-colors">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reports & Analytics</h3>
              <p className="text-gray-600 text-sm">View attendance reports and student performance analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faculty;