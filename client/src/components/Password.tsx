import { FC, FormEvent, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { buttonVariants } from './ui/button'
import { passwordRegex } from '@/utils/config'
import { toast } from 'sonner'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import axiosError from '@/utils/error'


const Password: FC = () => {
  const [oldPassword, setOldPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')

  const axiosPrivate = useAxiosPrivate()

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault()

    if (!passwordRegex.test(newPassword)) {
      toast('Something went wrong', {
        description: "Password must have at least 10 characters, one special character, one capital letter and one number",
        descriptionClassName: "sonner-desc",
          style: {
            backgroundColor: "#dc2626",
            borderColor: "#dc2626",
            color: "white"
          }
      })
      return
    }

    const data = {
      "old_password": oldPassword,
      "new_password": newPassword
    }

    try {
      await axiosPrivate.patch('/password/update', data)

    } catch (error) {
      axiosError(error as Error)
      
    } finally {
      setOldPassword('')
      setNewPassword('')
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Update password</DialogTitle>
        <DialogDescription>Make changes to your password here. Click save changes when you're done.</DialogDescription>
      </DialogHeader>
      <form className="grid gap-y-4" onSubmit={handlePasswordChange}>
        <div className="grid gap-1">
          <Label htmlFor="old_password" className='text-sm font-medium'>Old Password</Label>
          <Input id="old_password" type='password' value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="new_password" className='text-sm font-medium'>New Password</Label>
          <Input id="new_password" type='password' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        </div>
        <DialogFooter>
          <DialogClose className={buttonVariants({})}>Save changes</DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

export default Password