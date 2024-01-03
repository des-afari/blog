import axios from '@/utils/api'
import useAuth from './useAuth'

interface AuthState {
    accessToken: string | null
    role: string | null
}

const useRefreshToken = () => {
    const { setAuth } = useAuth()

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        })

        const accessToken =  response?.data?.access_token
        const role = response?.data?.role

        setAuth((prev: AuthState) => {
            return { ...prev, accessToken, role }
        })
        
        return accessToken
    }

    return refresh
}

export default useRefreshToken