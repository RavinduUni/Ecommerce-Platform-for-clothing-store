import React, { useContext, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import UserAuthModal from './UserAuthModal';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { token, role, authLoading } = useContext(AppContext);
    const [open, setOpen] = useState(true);

    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    // Show loading state while auth status is being determined
    if (authLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!token) {
        if (isAdminRoute) {
            return <Navigate to="/admin/login" replace />;
        }

        return (
            <>
                {children}
                <UserAuthModal isOpen={open} onClose={() => setOpen(false)} />
            </>
        )
    }

    //Token exists but role not yet ready -> WAIT
    if (!role) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {

        if (isAdminRoute) {
            return <Navigate to="/admin/login" replace />;
        }

        alert("You do not have permission to access this page.");
        return <Navigate to="/" replace />;
    }
    return children;
}
export default ProtectedRoute