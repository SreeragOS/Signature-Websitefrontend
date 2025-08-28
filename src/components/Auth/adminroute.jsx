import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('is_superuser') === 'true';

  if (!token || !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
