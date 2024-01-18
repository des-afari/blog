import { FC, useEffect } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { EnvelopeClosedIcon, ExitIcon, IdCardIcon, InfoCircledIcon, LockClosedIcon, MagnifyingGlassIcon, PersonIcon, TrashIcon } from '@radix-ui/react-icons'
import { useNavigate, Link } from 'react-router-dom'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useState } from 'react'
import axiosError from '@/utils/error'
import useAuth from '@/hooks/useAuth'
import axios from '@/utils/api'
import { buttonVariants } from './ui/button'
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
    if (SI) {
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
            blog
            <span className='text-red-600'>.</span>
          </p>
        </a>
      </div>
      {
        SI ?
        <div>
        <Dialog>
          <DropdownMenu>
            <div className='flex items-center gap-x-3'>
              <Link to='/search' className={cn(
                buttonVariants({"variant": "ghost", "size": "icon"}), "rounded-full hover:bg-gray-200 h-10 w-10")}>
                <MagnifyingGlassIcon width={24} height={24} />
              </Link>
              <DropdownMenuTrigger title='account' asChild>
                <span className={cn(
                  buttonVariants({"variant": "ghost", "size": "icon"}), "rounded-full hover:bg-gray-200 h-10 w-10")}>
                  <PersonIcon width={24} height={24} />
                </span>
              </DropdownMenuTrigger>
            </div>
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
         <div className='md:hidden flex items-center gap-x-3'>
            <Link to='/search' className={cn(
              buttonVariants({"variant": "ghost", "size": "icon"}), "rounded-full hover:bg-gray-200 h-10 w-10")}>
              <MagnifyingGlassIcon width={24} height={24} />
            </Link>
            <Link to='/register' title="register" className={cn(
              buttonVariants({"variant": "ghost", "size": "icon"}), "rounded-full hover:bg-gray-200 h-10 w-10")}>
              <PersonIcon width={24} height={24} />
            </Link>
            <Link to='/login' title='login' className={cn(
              buttonVariants({"variant": "ghost", "size": "icon"}), "rounded-full hover:bg-gray-200 h-10 w-10")}>
              <IdCardIcon width={24} height={24} />
            </Link>
          </div>
          <div className='hidden md:flex md:items-center md:gap-x-3'>
            <Link to='/search' className={cn(
              buttonVariants({"variant": "ghost", "size": "icon"}), "rounded-full hover:bg-gray-200 h-10 w-10")}>
              <MagnifyingGlassIcon width={24} height={24} />
            </Link>
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