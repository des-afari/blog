import { FC, useEffect } from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { EnvelopeClosedIcon, ExitIcon, HamburgerMenuIcon, InfoCircledIcon, LockClosedIcon, PersonIcon, TrashIcon } from '@radix-ui/react-icons'
import { useNavigate, Link } from 'react-router-dom'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useState } from 'react'
import axiosError from '@/utils/error'
import useAuth from '@/hooks/useAuth'
import axios from '@/utils/api'
import { Button, buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
import { CurrentUserInterface, CurrentUserResponse } from './Interfaces'
import Information from './Information'
import Email from './Email'
import Password from './Password'
import DeleteAccount from './DeleteAccount'


const initialUserState: CurrentUserInterface = {
  id: "",
  first_name: "",
  last_name: "",
  email: ""
}

const Header: FC = () => {
  const [user, setUser] = useState<CurrentUserInterface>(initialUserState)
  const [modal, setModal] = useState('')

  const SI = localStorage.getItem('SI')
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const get_user = async () => {
        const response: CurrentUserResponse = await axiosPrivate.get('/current_user')

        setUser(response?.data)
        sessionStorage.setItem('currentUser', JSON.stringify(response?.data))
      }

      const currentUser = sessionStorage.getItem('currentUser')
      currentUser ? setUser(JSON.parse(currentUser)) : get_user()

    } catch (error) {
      axiosError(error as Error)
    }
  }, [])

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
      sessionStorage.removeItem('currentUser')

      navigate('/')

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
                <DropdownMenuItem className='flex items-center gap-x-2 cursor-pointer'>
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
          {modal === 'information' && <Information user={user} setUser={setUser} />}
          {modal === 'email' && <Email user={user} setUser={setUser} />}
          {modal === 'password' && <Password />}
          {modal === 'delete' && <DeleteAccount />}
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