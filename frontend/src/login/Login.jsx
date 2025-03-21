import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const handleAdminLogin = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      navigate('/admin');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleFacultyLogin = (username, password) => {
    if (username === 'faculty' && password === 'faculty') {
      navigate('/faculty');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleStudentLogin = (username, password) => {
    if (username === 'student' && password === 'student') {
      navigate('/student');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-page">
        <div className="login-container">
          <h2>Admin Login</h2>
          <LoginForm onLogin={handleAdminLogin} />
        </div>
        <div className="login-container">
          <h2>Faculty Login</h2>
          <LoginForm onLogin={handleFacultyLogin} />
        </div>
        <div className="login-container">
          <h2>Student Login</h2>
          <LoginForm onLogin={handleStudentLogin} />
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin(username, password);
  };

  return (
    <div className="login-form">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;