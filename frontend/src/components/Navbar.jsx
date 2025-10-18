import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, removeToken, removeUser } from '../lib/api';

function Navbar() {
  const navigate = useNavigate();
  const user = getUser();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleLogout = () => {
    setShowLogoutPopup(true);
    setTimeout(() => {
      removeToken();
      removeUser();
      navigate('/');
    }, 1500);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 py-1 fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img 
                  className="h-10 w-10" 
                  src="/head_logo.png" 
                  alt="AcademIQ Logo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden text-2xl font-bold" style={{ color: '#183e77' }}>AcademIQ
                </div>
              </div>
              <div className="ml-3">
                <button 
                  onClick={() => navigate(`/${user?.role}`)}
                  className="hover:opacity-80 transition-opacity"
                >
                  <h1 className="text-2xl font-bold" style={{ color: '#183e77' }}>
                    AcademIQ
                  </h1>
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLogout}
                className="text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#183e77' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-lg font-medium text-gray-900">Logging out...</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;