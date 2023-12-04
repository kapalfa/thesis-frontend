import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import useRefreshToken from "../hooks/useRefresh"
import useAuth from "../hooks/useAuth"

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true)
    const refresh = useRefreshToken()
    const { auth, persist } = useAuth()

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                console.log("gt eimai edw re gamw")
                await refresh()
            }
            catch (err){
                console.error(err)
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
                ? <Outlet/> 
                : isLoading ? <h1>Loading...</h1> : <Outlet />}
        </>
    )
}

export default PersistLogin