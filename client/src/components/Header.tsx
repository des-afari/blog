import { FC } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { ExitIcon, IdCardIcon, MagnifyingGlassIcon, PersonIcon, TrashIcon } from '@radix-ui/react-icons'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import axiosError from '@/utils/error'
import useAuth from '@/hooks/useAuth'
import axios from '@/utils/api'
import { buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
import DeleteAccount from './DeleteAccount'


const Header: FC = () => {
  const [modal, setModal] = useState<boolean>(false)

  const SI = localStorage.getItem('SI')
  const { auth } = useAuth()
  const navigate = useNavigate()


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
              <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DialogTrigger asChild onClick={() => setModal(true)}>
                <DropdownMenuItem className='flex items-center gap-x-2 cursor-pointer'>
                  <TrashIcon />
                  Delete Account
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem className='flex items-center gap-x-2 cursor-pointer' onClick={handleLogout}>
                <ExitIcon />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {modal && <DeleteAccount />}
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