import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getUser } from '../../lib/api';

function Faculty() {
  const navigate = useNavigate();
  const user = getUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user?.name}</h1>
            <p className="text-gray-600 text-lg">Faculty Dashboard - {user?.department}</p>
            <p className="text-gray-500 text-sm mt-1">Manage attendance and scores for your department students</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group hover:-translate-y-1 border border-gray-100"
              onClick={() => navigate('/faculty/attendance')}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-4 group-hover:bg-green-200 transition-colors">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Attendance Management</h3>
              <p className="text-gray-600 text-sm">Mark and manage student attendance for your department</p>
            </div>

            <div 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group hover:-translate-y-1 border border-gray-100"
              onClick={() => navigate('/faculty/scores')}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-lg mb-4 group-hover:bg-red-200 transition-colors">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Score Management</h3>
              <p className="text-gray-600 text-sm">Enter and manage test scores for your department students</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faculty;