import { FC, FormEvent } from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter,
   DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EnvelopeClosedIcon, ExitIcon, LockClosedIcon, PersonIcon } from '@radix-ui/react-icons'
import { Outlet, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useEffect, useState } from 'react'
import axiosError from '@/utils/error'
import useAuth from '@/hooks/useAuth'
import axios from '@/utils/api'
import { Label } from '@radix-ui/react-label'
import { Input } from './ui/input'
import { Button } from './ui/button'


interface UserResponse {
  data: {
    id: string
    first_name: string
    last_name: string
  }
}

const Header: FC = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')

  useEffect(() => {    
    const get_user = async () => {
      try {
        const response: UserResponse = await axiosPrivate.get('/user/current')
        const initials: string = response?.data?.first_name.charAt(0) + response?.data?.last_name.charAt(0)
        setAvatar(initials.toUpperCase())
  
      } catch (error) {
        axiosError(error as Error)
  
      }
    }

    get_user()

  }, [])

  const handleLogout = async () => {
    try {
      const data = {
        "access_token": auth?.accessToken
      }
      
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

    try {
      const data = {
        "first_name": firstName,
        "last_name": lastName
      }
      
      
      
    } catch (error) {
      
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
                          <AvatarFallback> {avatar} </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className='w-56'>
                        <DropdownMenuLabel>Update Profile</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                          <DialogTrigger asChild>
                            <DropdownMenuItem className='flex items-center gap-x-2'>
                              <PersonIcon />
                              Information
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem className='flex items-center gap-x-2'>
                            <EnvelopeClosedIcon />
                            Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className='flex items-center gap-x-2'>
                            <LockClosedIcon />
                            Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className='flex items-center gap-x-2 cursor-pointer' onClick={handleLogout}>
                            <ExitIcon />
                            Logout
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                                <Button type="submit">Save changes</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                  </Dialog>
                </div>
            </header>
  )
}

export default Header