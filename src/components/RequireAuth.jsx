import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const RequireAuth = () => {
   
    const location = useLocation();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
 
    useEffect(()=>{
        const checkAuth = async () => {
            try {
                await axiosPrivate.get('/verify')
            } catch (error) {
                navigate('/login', {state: {from: location}, replace: true})
            }
        }
        checkAuth();        
    })
    return (
       <Outlet/>
    )   
}

export default RequireAuth