import axios from 'axios'

const BASE_URL: string = import.meta.env.PROD ? 'https://api.blog.desmondafari.com/api/v1' : 'http://localhost:8000/api/v1'

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
