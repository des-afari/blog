import { FC, FormEvent } from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
   DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EnvelopeClosedIcon, ExitIcon, InfoCircledIcon, LockClosedIcon, PersonIcon, TrashIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useState } from 'react'
import axiosError from '@/utils/error'
import useAuth from '@/hooks/useAuth'
import axios from '@/utils/api'
import { Label } from '@radix-ui/react-label'
import { Input } from './ui/input'
import { Button, buttonVariants } from './ui/button'
import { emailRegex, nameRegex, passwordRegex } from '@/utils/config'
import { toast } from 'sonner'


const Header: FC = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [oldPassword, setOldPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [modal, setModal] = useState('')
 

  const handleLogout = async () => {
    const data = {
      "access_token": auth?.accessToken
    }

    try {
      
      await axios.post('/logout', data, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })

      navigate('/')

    } catch (error) {
      axiosError(error as Error)

    }
  }

  const handleNameChange = async (e: FormEvent) => {
    e.preventDefault()

    if (!nameRegex.test(firstName)) {
      toast('Something went wrong', {
        description: "First name must have at least two characters",
      })
      return
    }

    if (!nameRegex.test(lastName)) {
      toast('Something went wrong', {
        description: "Last name must have at least two characters",
      })
      return
    }
    
    const data = {
      "first_name": firstName,
      "last_name": lastName
    }

    try {

      await axiosPrivate.put('/user/update', data)
      
    } catch (error) {
      axiosError(error as Error)

    }
  }

  const handleEmailChange = async (e: FormEvent) => {
    e.preventDefault()

    if (!emailRegex.test(email)) {
      toast('Something went wrong', {
        description: "Invalid email",
      })
      return
    }
    
    const data = {
      "email": email
    }

    try {
      await axiosPrivate.patch('/email/update', data)
    
    } catch (error) {
      axiosError(error as Error)
      
    }
  }

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault()

    if (!passwordRegex.test(newPassword)) {
      toast('Something went wrong', {
        description: "Password must have at least 10 characters, one special character, one capital letter and one number",
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

    }

  }

  const handleDelete = async () => {
    try {
      await axiosPrivate.delete('/user/delete')

    } catch (error) {
      axiosError(error as Error)

    }
  }

  return (
    <header className='h-16 px-6 border-b flex items-center justify-between'>
      <div>
          <a href="/">
            <p className='font-bold text-2xl'>
              craft
              <span className='text-red-600'>.</span>
            </p>
          </a>
        </div>
        <div>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className='cursor-pointer'>
                  <AvatarFallback> <PersonIcon /> </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>Update Profile</DropdownMenuLabel>
                <DropdownMenuSeparator />
                  <DialogTrigger asChild onClick={() => setModal('information')}>
                    <DropdownMenuItem className='flex items-center gap-x-2 cursor-pointer'>
                      <InfoCircledIcon />
                      Information
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogTrigger asChild onClick={() => setModal('email')}>
                    <DropdownMenuItem className='flex items-center gap-x-2 cursor-pointer'>
                      <EnvelopeClosedIcon />
                      Email
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogTrigger asChild onClick={() => setModal('password')}>
                    <DropdownMenuItem className='flex items-center gap-x-2 cursor-pointer'>
                      <LockClosedIcon />
                      Password
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuSeparator />
                  <DialogTrigger asChild onClick={() => setModal('delete')}>
                    <DropdownMenuItem className='flex items-center gap-x-2 cursor-pointer' onClick={handleDelete}>
                      <TrashIcon />
                      Delete Account
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className='flex items-center gap-x-2 cursor-pointer' onClick={handleLogout}>
                    <ExitIcon />
                    Logout
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {
              modal === 'information' && (
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Update name</DialogTitle>
                    <DialogDescription>
                      Make changes to your name here. Click save changes when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="grid gap-y-4 pt-4" onSubmit={handleNameChange}>
                    <div className="grid gap-1">
                      <Label htmlFor="first_name" className='text-sm font-medium'>First Name</Label>
                      <Input id="first_name" placeholder='John' value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="name" className='text-sm font-medium'>Last Name</Label>
                      <Input id="name" placeholder='King' value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                    <DialogFooter>
                      <DialogClose>
                        <Button type="submit">Save changes</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              )
            } {
              modal === 'email' && (
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Update email</DialogTitle>
                    <DialogDescription>
                      Make changes to your email here. Click save changes when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="grid gap-y-4 pt-4" onSubmit={handleEmailChange}>
                    <div className="grid gap-1">
                      <Label htmlFor="email" className='text-sm font-medium'>Email</Label>
                      <Input id="email" placeholder='user@example.com' value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <DialogFooter>
                      <DialogClose>
                        <Button type="submit">Save changes</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              )
            } {
              modal === 'password' && (
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Update password</DialogTitle>
                    <DialogDescription>
                      Make changes to your password here. Click save changes when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="grid gap-y-4 pt-4" onSubmit={handlePasswordChange}>
                    <div className="grid gap-1">
                      <Label htmlFor="old_password" className='text-sm font-medium'>Old Password</Label>
                      <Input id="old_password" type='password' value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="new_password" className='text-sm font-medium'>New Password</Label>
                      <Input id="new_password" type='password' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </div>
                    <DialogFooter>
                      <DialogClose>
                        <Button type="submit">Save changes</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              )
            } {
              modal === 'delete' && (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently remove the user.
                    </DialogDescription>
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
          </Dialog>
      </div>
    </header>
  )
}

export default Header