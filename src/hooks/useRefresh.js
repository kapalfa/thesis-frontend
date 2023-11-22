import useAuth from "./useAuth";
import { axiosPrivate } from "../api/axios";

const useRefreshToken = () => {
    const { setAuth } = useAuth()
    const refresh = async () => {
        const response = await axiosPrivate.get('/refresh')
        const data = await response.data;
        const accessToken = data.token;
        setAuth(accessToken)
        return response.data.token
    }
    return refresh
}

export default useRefreshToken;