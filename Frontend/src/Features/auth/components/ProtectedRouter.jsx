import React from 'react'
import { useAuth } from '../Hooks/useAuth'
import { Navigate } from "react-router-dom"
import { PageLoader } from '../../Interview/Components/Loading';

const ProtectedRouter = ({ children }) => {
    const { user, loading } = useAuth();


    if (loading) {
        return <PageLoader label="Getting your account ready..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRouter
