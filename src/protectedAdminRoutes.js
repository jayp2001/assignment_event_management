import React from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedAdminRoutes = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'))
    let location = useLocation();
    if (!user) {
        return (<Navigate to="/login" state={{ from: location }} replace />)
    }
    else {
        try {
            const decoded = jwtDecode(user.token);
            const expirationTime = (decoded.exp * 1000) - 60000
            const auth = new Date(expirationTime) > new Date() ? true : false
            return (
                auth ?
                    <Outlet /> :
                    <Navigate to="/login" state={{ from: location }} replace />
            )
        }
        catch (error) {
            return (
                <Navigate to="/login" state={{ from: location }} replace />
            )
        }
    }


    // if(!user) {
    //     return <Navigate to="/" state={{ from: location}} replace />
    // }


};

export default ProtectedAdminRoutes;