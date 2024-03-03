import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import React from "react"
const RequireAuth = () => {
  
    const { auth } = useAuth()
    const location = useLocation();

    //     const checkAuth = async () => {
    //         try {

    //             //await axiosPrivate.get('/verify')
    //         } catch (error) {
    //             navigate('/login', {state: {from: location}, replace: true})
    //         }
    return (
        auth
        ? < Outlet />
        : <Navigate to="/auth/login" state={{ from: location }} replace />
    )   
}

export default RequireAuth