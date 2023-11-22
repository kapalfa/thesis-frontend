import axios from 'axios'
const BASE_URL = 'https://localhost:8443/api'

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})