import useAuth from "./useAuth";
import axios from "../api/axios";

const useRefreshToken = () => {
    const { setAuth } = useAuth()
    const refresh = async () => {
        const response = await axios.get('/refresh')
        const data = await response.data;
        const accessToken = data.token;
        setAuth(accessToken)
        return response.data.token
    }
    return refresh
}

export default useRefreshToken;