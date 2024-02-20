import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL
export const API_WS_URL = import.meta.env.VITE_WEBSOCKET_URL
export default axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

export const axiosPrivate = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})