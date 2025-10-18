import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, setToken, setUser } from '../../lib/api';

function Login() {
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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#183e77' }}>
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">AcademIQ</h2>
          <p className="text-gray-600">Student Information System</p>
        </div>
        <LoginForm onLogin={handleLogin} loading={loading} error={error} />
      </div>
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

  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            required
          />
        </div>
        
        <div>
          <input
            type="password"
            placeholder="Password"
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
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-sm text-gray-600 mb-2"><strong>Demo Credentials:</strong></p>
        <p className="text-sm">Admin: admin@sis.com / admin123</p>
        <p className="text-xs text-gray-500 italic mt-1">Note: Only admin can register new users</p>
      </div>
    </div>
  );
}

export default Login;