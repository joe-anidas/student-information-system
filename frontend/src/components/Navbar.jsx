import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../lib/api';

const navigationConfig = {
  admin: [
    { to: "/student-info", label: "Students" },
    { to: "/faculty-info", label: "Faculty" },
    { to: "/course-info", label: "Courses" },
    { to: "/report-view", label: "Reports" }
  ],
  faculty: [
    { to: "/student-info-view", label: "Students" },
    { to: "/course-details", label: "Courses" },
    { to: "/report-info", label: "Reports" }
  ],
  student: [
    { to: "/student-view", label: "Profile" },
    { to: "/course-view", label: "Courses" },
    { to: "/report", label: "Reports" }
  ]
};

function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    navigate('/logout');
  };

  const navigationItems = navigationConfig[user?.role] || [];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(`/${user?.role}`)}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <h1 className="text-2xl font-bold" style={{ color: '#183e77' }}>
                AcademIQ
              </h1>
            </button>
            <span className="ml-4 text-sm text-gray-500 hidden md:block">
              Welcome, {user?.name} ({user?.role})
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {navigationItems.map((item, index) => (
              <button 
                key={index}
                onClick={() => navigate(item.to)}
                className="text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#183e77' }}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={handleLogout}
              className="text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;