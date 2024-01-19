import { FC } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { buttonVariants } from './ui/button'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import axiosError from '@/utils/error'
import { useNavigate } from 'react-router-dom'


const DeleteAccount: FC = () => {
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      await axiosPrivate.delete('/user/delete')

      localStorage.removeItem('SI')
      localStorage.removeItem('id')
      sessionStorage.removeItem('currentUser')

      navigate(0)

    } catch (error) {
      axiosError(error as Error)
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Delete User</DialogTitle>
        <DialogDescription>This action cannot be undone. This will permanently remove the user.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose className={buttonVariants({"variant": "outline"})}>
          Cancel
        </DialogClose>
        <DialogClose onClick={handleDelete} className={buttonVariants({"variant": "default"})}>
          Continue
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

export default DeleteAccount