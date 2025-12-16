// src/ProtectedRoutes/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './authcontext';

const PrivateRoute = () => {
    const { isAuthenticated } = useAuth(); 
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;