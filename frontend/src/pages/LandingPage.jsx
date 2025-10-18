import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, setToken, setUser } from '../lib/api';

function LandingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.login(email, password);
      
      // Store token and user info
      setToken(response.token);
      setUser(response.user);
      
      // Navigate based on user role
      switch (response.user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'faculty':
          navigate('/faculty');
          break;
        case 'student':
          navigate('/student');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo and Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200 py-1">
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
                <div className="hidden text-2xl font-bold" style={{ color: '#183e77' }}>
                  AcademIQ
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold" style={{ color: '#183e77' }}>
                  AcademIQ
                </h1>
              </div>
            </div>

            {/* Login Button */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => document.getElementById('login-section').scrollIntoView({ behavior: 'smooth' })}
                className="text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#183e77' }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image and Content */}
            <div className="space-y-8">
              <div className="relative">
                <img 
                  src="/cover.png" 
                  alt="AcademIQ Student Information System"
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                  onError={(e) => {
                    e.target.src = '/cover2.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-2xl"></div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Welcome to <span style={{ color: '#183e77' }}>AcademIQ</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  A comprehensive Student Information System designed for modern educational institutions. 
                  Manage students, faculty, courses, attendance, and academic records with ease and security.
                </p>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div id="login-section" className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign In to Your Account</h3>
                <p className="text-gray-600">Access your personalized dashboard</p>
              </div>
              
              <LoginForm onLogin={handleLogin} loading={loading} error={error} />
              
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features for Every Role</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AcademIQ provides comprehensive tools and features tailored for administrators, faculty, and students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100">
              <div className="text-5xl mb-6 text-center">👨‍💼</div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">Admin Dashboard</h3>
              <p className="text-gray-700 text-center leading-relaxed mb-6">
                Complete control over the system. Manage users, courses, departments, attendance, and view comprehensive analytics.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• User management and registration</li>
                <li>• Department and course management</li>
                <li>• Comprehensive analytics and reports</li>
                <li>• System-wide attendance tracking</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-green-100">
              <div className="text-5xl mb-6 text-center">👨‍🏫</div>
              <h3 className="text-2xl font-bold text-green-900 mb-4 text-center">Faculty Portal</h3>
              <p className="text-gray-700 text-center leading-relaxed mb-6">
                Manage attendance and test/assignment scores for assigned courses. View department and year-wise student data.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Attendance management</li>
                <li>• Grade and score tracking</li>
                <li>• Student progress monitoring</li>
                <li>• Course material management</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-purple-100">
              <div className="text-5xl mb-6 text-center">👨‍🎓</div>
              <h3 className="text-2xl font-bold text-purple-900 mb-4 text-center">Student Portal</h3>
              <p className="text-gray-700 text-center leading-relaxed mb-6">
                View profile, attendance, test scores, and previous semester data. Track your academic progress.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Personal academic dashboard</li>
                <li>• Attendance and grade tracking</li>
                <li>• Course enrollment history</li>
                <li>• Progress analytics</li>
              </ul>
            </div>
          </div>

          {/* Security Features */}
         
    
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">


   
    
          
          <div className="border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 AcademIQ Student Information System. All rights reserved.</p>
          </div>

      </footer>
    </div>
  );
}

function LoginForm({ onLogin, loading, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  const handleTestLogin = (testEmail, testPassword) => {
    setEmail(testEmail);
    setPassword(testPassword);
    onLogin(testEmail, testPassword);
  };

  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-white py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ backgroundColor: '#183e77' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Test Credential Buttons */}
      <div className="mt-6 space-y-3">
        <p className="text-sm font-medium text-gray-700 text-center">Quick Test Login:</p>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => handleTestLogin('admin@sis.com', 'admin123')}
            disabled={loading}
            className="w-full bg-red-100 hover:bg-red-200 text-red-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            🔑 Admin Login (admin@sis.com)
          </button>
          <button
            onClick={() => handleTestLogin('ramesh11.cse@sis.com', 'faculty123')}
            disabled={loading}
            className="w-full bg-green-100 hover:bg-green-200 text-green-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            👨‍🏫 Faculty Login (ramesh11.cse@sis.com)
          </button>
          <button
            onClick={() => handleTestLogin('student1y1s1.24cse@sis.com', 'student123')}
            disabled={loading}
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            👨‍🎓 Student Login (student1y1s1.24cse@sis.com)
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center italic">
          Note: These are demo credentials for testing
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
