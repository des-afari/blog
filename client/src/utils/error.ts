import axios from 'axios'
import { toast } from "sonner"


export const axiosError = (error: Error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast('Something went wrong', {
          description: error.response.data.detail,
        })
  
      } else if (error.request) {
        toast('Something went wrong', {
        description: 'No response received from the server'
        })
      } 
    } else {
      toast('Something went wrong', {
        description: error.message
      })
    }
  }

export default axiosError