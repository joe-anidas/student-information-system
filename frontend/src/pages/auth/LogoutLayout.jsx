import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken, removeUser } from '../../lib/api';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user data
    removeToken();
    removeUser();
    
    // Redirect to landing page after a short delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 to-cyan-400 text-white font-sans">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Logging out...</h2>
        <p className="text-lg opacity-90">You will be redirected to the login page.</p>
      </div>
    </div>
  );
}

export default Logout;
