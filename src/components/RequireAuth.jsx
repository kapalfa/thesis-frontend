import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
const RequireAuth = () => {
    const { auth } = useAuth()
    const location = useLocation();
  //  const navigate = useNavigate();
    //const axiosPrivate = useAxiosPrivate();
 
    // useEffect(()=>{
    //     const checkAuth = async () => {
    //         try {

    //             //await axiosPrivate.get('/verify')
    //         } catch (error) {
    //             navigate('/login', {state: {from: location}, replace: true})
    //         }
    //     }
    //     checkAuth();        
    // })
    return (
    
        auth
        ? < Outlet />
        : <Navigate to="/login" state={{ from: location }} replace />
    )
    // return (
    //    <Outlet/>
    // )   
}

export default RequireAuth