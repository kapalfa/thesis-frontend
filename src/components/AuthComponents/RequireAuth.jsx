import { useLocation, useNavigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import React from "react"
const RequireAuth = () => {
    const { auth } = useAuth()
    const location = useLocation();
    const navigate = useNavigate();

    return (
        auth
        ? <Outlet />
        : navigate("/auth/login", {state:{ from: location }}, { replace: true })
    )   
}

export default RequireAuth