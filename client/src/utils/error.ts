import axios from 'axios'
import useToast from '@/hooks/useToast'

export const axiosError = (error: Error) => {
  const toast = useToast()

  if (axios.isAxiosError(error)) {
    if (error.response) {
      toast(error.response.data.detail)    

    } else if (error.request) {
      toast('No response received from the server')
      
    } 
  } else {
    toast(error.message)
  }
}

export default axiosError