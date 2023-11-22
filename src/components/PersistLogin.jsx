import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import useRefreshToken from "../hooks/useRefresh"
import useAuth from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import SignIn from "./Login"
const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true)
    const refresh = useRefreshToken()
    const { auth, persist } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh()
            }
            catch (err){
                console.error(err)
                navigate('/login')
                return 
            }
            finally {
                setIsLoading(false)
            }
        }
        !auth && persist ? verifyRefreshToken() : setIsLoading(false)
    })

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`)
        console.log(`auth: ${auth}`)
    }, [isLoading, auth])

    return (
        <>
            {!persist 
                ? <SignIn/> 
                : isLoading ? <h1>Loading...</h1> : <Outlet />}
        </>
    )
}

export default PersistLogin