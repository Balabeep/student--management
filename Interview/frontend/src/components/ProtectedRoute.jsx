import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, role }) {
  const { token, user } = useSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/" />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" />;
  }
  return children;
}
