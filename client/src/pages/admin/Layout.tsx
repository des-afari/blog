import { Outlet, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useEffect, useState } from 'react'
import axiosError from '@/utils/error'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,
   DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ExitIcon, GearIcon, PersonIcon } from '@radix-ui/react-icons'
import useAuth from '@/hooks/useAuth'
import axios from '@/utils/api'
import Loader from '@/components/Loader'


interface UserResponse {
  data: {
    id: string
    first_name: string
    last_name: string
  }
}

const Layout = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
    setIsLoading(true)

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

    } finally {
      setIsLoading(false)

    }
  }

  return (
	  <>
        {
          isLoading ? <Loader /> :
          <main>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className='cursor-pointer'>
                        <AvatarFallback> {avatar} </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-56'>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                        <DropdownMenuItem className='flex items-center gap-x-2'>
                          <PersonIcon />
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className='flex items-center gap-x-2'>
                          <GearIcon />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='flex items-center gap-x-2 cursor-pointer' onClick={handleLogout}>
                          <ExitIcon />
                          Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            </header>
	  	      <Outlet />
          </main>
        }
	  </>
  )
}

export default Layout