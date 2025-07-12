// components/PublicRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function PublicRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  return user ? <Navigate to="/dashboard" /> : children;
}

export default PublicRoute;
