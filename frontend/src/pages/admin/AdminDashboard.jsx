import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { dataAPI, getUser } from '../../lib/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dataAPI.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardCards = [
    {
      title: 'User Management',
      description: 'Manage students, faculty, and admin accounts',
      icon: '👥',
      color: 'blue',
      onClick: () => navigate('/admin/users'),
      stats: stats ? `${stats.totalStudents + stats.totalFaculty + stats.totalAdmins} Total Users` : 'Loading...'
    },
    {
      title: 'Student Info Management',
      description: 'View and manage detailed student information',
      icon: '👨‍🎓',
      color: 'cyan',
      onClick: () => navigate('/admin/student-management'),
      stats: stats ? `${stats.totalStudents} Students` : 'Loading...'
    },
    {
      title: 'Department Management',
      description: 'Create and manage academic departments',
      icon: '🏢',
      color: 'green',
      onClick: () => navigate('/admin/departments'),
      stats: stats ? `${stats.departmentStats?.length || 0} Departments` : 'Loading...'
    },
    {
      title: 'Subject Management',
      description: 'Manage subjects and course assignments',
      icon: '📚',
      color: 'purple',
      onClick: () => navigate('/admin/subjects'),
      stats: 'Manage Subjects'
    },
    {
      title: 'Attendance Management',
      description: 'Track and manage student attendance',
      icon: '📋',
      color: 'orange',
      onClick: () => navigate('/admin/attendance'),
      stats: 'Attendance Records'
    },
    {
      title: 'Score Management',
      description: 'Manage test scores and academic performance',
      icon: '📊',
      color: 'red',
      onClick: () => navigate('/admin/scores'),
      stats: 'Academic Scores'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 group-hover:bg-blue-200 text-blue-600',
      cyan: 'bg-cyan-100 group-hover:bg-cyan-200 text-cyan-600',
      green: 'bg-green-100 group-hover:bg-green-200 text-green-600',
      purple: 'bg-purple-100 group-hover:bg-purple-200 text-purple-600',
      orange: 'bg-orange-100 group-hover:bg-orange-200 text-orange-600',
      red: 'bg-red-100 group-hover:bg-red-200 text-red-600',
      indigo: 'bg-indigo-100 group-hover:bg-indigo-200 text-indigo-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user?.name}</h1>
            <p className="text-gray-600 text-lg">Administrator Dashboard - Manage your AcademIQ Student Information System</p>
          </div>

          {/* Quick Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <span className="text-2xl">👨‍🎓</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <span className="text-2xl">👨‍🏫</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Faculty</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalFaculty}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Departments</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.departmentStats?.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">System Health</p>
                    <p className="text-2xl font-bold text-green-600">Active</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Main Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group hover:-translate-y-1 border border-gray-100"
                onClick={card.onClick}
              >
                <div className={`flex items-center justify-center w-16 h-16 rounded-lg mb-4 transition-colors ${getColorClasses(card.color)}`}>
                  <span className="text-3xl">{card.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{card.description}</p>
                <p className="text-sm font-medium text-gray-500">{card.stats}</p>
              </div>
            ))}
          </div>

    
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;