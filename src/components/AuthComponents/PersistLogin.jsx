import { Outlet, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import useRefreshToken from "../../hooks/useRefresh"
import useAuth from "../../hooks/useAuth"
import React from "react"
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
            }
            finally {
                setIsLoading(false)
            }
        }
        if(!auth && !persist) navigate('/auth/login')
        !auth && persist ? verifyRefreshToken() : setIsLoading(false)     
    })
    useEffect(() => {
        console.log('auth', auth)
        console.log('persist', persist)
        }, [auth, persist])

    return (
        <>
            {!persist 
                ? <Outlet/> 
                : isLoading ? <h1>Loading...</h1> : <Outlet />}
        </>
    )
}

export default PersistLogin