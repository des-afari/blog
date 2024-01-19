import { CrossCircledIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"

const useToast = () => {
  const get_toast = (message: string) => {
    return toast('Something went wrong', {
      description: message,
      icon: <CrossCircledIcon color='#dc2626' />,
      })
  }
  
  return get_toast
}

export default useToast