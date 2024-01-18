import axios from 'axios'
import { toast } from "sonner"


export const axiosError = (error: Error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast('Something went wrong', {
          description: error.response.data.detail,
          descriptionClassName: "sonner-desc",
          style: {
            backgroundColor: "#dc2626",
            borderColor: "#dc2626",
            color: "white"
          }
        })        
      } else if (error.request) {
        toast('Something went wrong', {
          description: 'No response received from the server',
          descriptionClassName: "sonner-desc",
          style: {
            backgroundColor: "#dc2626",
            borderColor: "#dc2626",
            color: "white"
          }
        })
      } 
    } else {
      toast('Something went wrong', {
        description: error.message,
        descriptionClassName: "sonner-desc",
        style: {
          backgroundColor: "#dc2626",
          borderColor: "#dc2626",
          color: "white"
        }
      })
    }
  }

export default axiosError