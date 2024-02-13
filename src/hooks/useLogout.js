import useAxiosPrivate from './useAxiosPrivate'
import useAuth from './useAuth'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../constant'

const useLogout = () => {
    const axiosPrivate = useAxiosPrivate()
    const { setAuth } = useAuth()
    const navigate = useNavigate()
    
    const logout = async () => {
        try {
            console.log('logging out')
            const response = await axiosPrivate.get(`${API_BASE_URL}/logout`)
            if (response.status=='200') {
                setAuth(null)
                navigate('/login', {replace: true})
            } else {
                console.log('Logout failed: ', response)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return logout
}

export default useLogout