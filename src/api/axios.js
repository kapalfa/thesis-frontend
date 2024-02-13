import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL
export const API_WS_URL = import.meta.env.WEBSOCKET_BACKEND_URL
export default axios.create({
    baseURL: API_BASE_URL,
})

export const axiosPrivate = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})