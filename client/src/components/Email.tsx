import { FC, FormEvent, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { buttonVariants } from './ui/button'
import { emailRegex } from '@/utils/config'
import { toast } from 'sonner'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import axiosError from '@/utils/error'
import { CurrentUserResponse, UserComponentInterface } from './Interfaces'


const Email: FC<UserComponentInterface> = ({ user, setUser }) => {
  const [email, setEmail] = useState<string>(user.email)

  const axiosPrivate = useAxiosPrivate()

  const handleEmailChange = async (e: FormEvent) => {
    e.preventDefault()

    if (!emailRegex.test(email)) {
      toast('Something went wrong', {
        description: "Invalid email",
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
      "email": email
    }

    try {
      const response: CurrentUserResponse = await axiosPrivate.patch('/email/update', data)

      setUser(response?.data)
      sessionStorage.setItem('currentUser', JSON.stringify(response?.data))

    } catch (error) {
      axiosError(error as Error)
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Update email</DialogTitle>
        <DialogDescription>Make changes to your email here. Click save changes when you're done.</DialogDescription>
      </DialogHeader>
      <form className="grid gap-y-4" onSubmit={handleEmailChange}>
        <div className="grid gap-1">
          <Label htmlFor="email" className='text-sm font-medium'>Email</Label>
          <Input id="email" placeholder='user@example.com' value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <DialogFooter>
          <DialogClose className={buttonVariants({})}>Save changes</DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

export default Email