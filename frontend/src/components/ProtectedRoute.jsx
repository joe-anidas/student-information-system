import { Navigate, useLocation } from 'react-router-dom';
import { getUser } from '../lib/api';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const user = getUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
