import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

const AdminProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { adminToken, adminRole, adminLoading } = useContext(AdminContext);

  if (adminLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(adminRole)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
