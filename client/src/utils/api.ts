import axios from 'axios'

// CHANGE IN PRODUCTION
const BASE_URL: string = 'http://localhost:8000/api/v1'

export default axios.create({
    baseURL: BASE_URL
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})
