import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);

    const [adminRole, setAdminRole] = useState(null);
    const [adminLoading, setAdminLoading] = useState(true);

    const adminLogout = () => {
        setAdminToken(null);
        setAdminRole(null);
        localStorage.removeItem('adminToken');
        delete axios.defaults.headers.common['Authorization'];
    }

    const adminLogin = async (email, password) => {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
        localStorage.setItem('adminToken', data.token);
        setAdminToken(data.token);
    }

    const adminRegister = async (name, email, password, confirmPassword, adminCode) => {
        const { data } = await axios.post(`${backendUrl}/api/admin/register`, {
            name,
            email,
            password,
            confirmPassword,
            adminCode
        });
        localStorage.setItem('adminToken', data.token);
        setAdminToken(data.token);
    }

    useEffect(() => {
        if (!adminToken) {
            adminLogout();
            setAdminLoading(false);
            return;
        }

        let logoutTimer;

        try {
            const decoded = jwtDecode(adminToken);

            const expiry = decoded.exp * 1000;
            const now = Date.now();

            if (now >= expiry) {
                adminLogout();
                setAdminLoading(false);
                return;
            }

            setAdminRole(decoded.role);
            axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;

            const remainingTime = expiry - now;

            logoutTimer = setTimeout(() => {
                adminLogout();
            }, remainingTime);


        } catch (error) {
            adminLogout();
        } finally {
            setAdminLoading(false);
        }

        return () => {
            if (logoutTimer) clearTimeout(logoutTimer);
        }
    }, [adminToken]);

    const value = {
        adminToken,
        setAdminToken,
        adminRole,
        setAdminRole,
        adminLoading,
        setAdminLoading,
        adminLogout,
        adminLogin,
        adminRegister,
        backendUrl
    }

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;