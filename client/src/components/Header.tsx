import { FC, FormEvent } from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
   DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EnvelopeClosedIcon, ExitIcon, HamburgerMenuIcon, InfoCircledIcon, LockClosedIcon, PersonIcon, TrashIcon } from '@radix-ui/react-icons'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useState } from 'react'
import axiosError from '@/utils/error'
import useAuth from '@/hooks/useAuth'
import axios from '@/utils/api'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button, buttonVariants } from './ui/button'
import { emailRegex, nameRegex, passwordRegex } from '@/utils/config'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Component, Trigger } from './DialogComponents'


const Header: FC = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [oldPassword, setOldPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [modal, setModal] = useState('')

  const SI = localStorage.getItem('SI')


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

      localStorage.removeItem('SI')
      localStorage.removeItem('id')

      navigate(0)

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
      {
        SI ?
        <div>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar title='account' className='h-9 w-9 cursor-pointer'>
                <AvatarFallback className='bg-white border border-black'>
                  <PersonIcon width={16} height={16} /> 
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              <DropdownMenuLabel>Update Profile</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Trigger 
                setModal={setModal} 
                modal='information'
                title='Information'
                icon={<InfoCircledIcon />}
              />
              <Trigger 
                setModal={setModal} 
                modal='email'
                title='Email'
                icon={<EnvelopeClosedIcon />}
              />
              <Trigger 
                setModal={setModal} 
                modal='password'
                title='Password'
                icon={<LockClosedIcon />}
              />
              <DropdownMenuSeparator />
              <Trigger 
                setModal={setModal} 
                modal='delete'
                title='Delete Account'
                icon={<TrashIcon />}
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem className='flex items-center gap-x-2 cursor-pointer' onClick={handleLogout}>
                <ExitIcon />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {
            modal === 'information' && 
            <Component
              title='Update name'
              description="Make changes to your name here. Click save changes when you're done."
            >
              <form className="grid gap-y-4" onSubmit={handleNameChange}>
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
            </Component>
          } {
            modal === 'email' &&
            <Component
              title='Update email'
              description="Make changes to your email here. Click save changes when you're done."
            >
              <form className="grid gap-y-4" onSubmit={handleEmailChange}>
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
            </Component>
          } {
            modal === 'password' &&
            <Component
              title='Update password'
              description="Make changes to your password here. Click save changes when you're done."
              >
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
                  <DialogClose>
                    <Button type="submit">Save changes</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </Component>
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
      </div> :
       <div>
       <Button variant={'ghost'} className='lg:hidden'>
         <HamburgerMenuIcon />
       </Button>
       <div className='hidden lg:flex lg:gap-x-2'>
         <Link to='/login' className={cn(
           buttonVariants({"variant": "secondary", "size": "md"}), "font-semibold")}>Log in</Link>
         <Link to='/register' className={cn(
           buttonVariants({"variant": "default", "size": "md"}), "font-semibold")}>Register</Link>
       </div>
     </div>
      }
    </header>
  )
}

export default Header