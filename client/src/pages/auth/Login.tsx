import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { FC, FormEvent, useState } from 'react'
import axios from '@/utils/api'
import useAuth from '@/hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosError from '@/utils/error'
import { emailRegex, nameRegex } from '@/utils/config'
import { toast } from 'sonner'


interface LoginResponse {
  data: {
    access_token: string
    role: string
    auth_type: string
  }
}

const Login: FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location?.state?.from?.pathname

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!emailRegex.test(email)) {
      toast('Something went wrong', {
        description: "Invalid email",
      })
      setIsLoading(false)
      return
    }

    if (!nameRegex.test(password)) {
      toast('Something went wrong', {
        description: "Password must be longer than two characters",
      })
      setIsLoading(false)
      return
    }

    const data = new URLSearchParams({
      username: email,
      password: password
    })

    try {
      const response: LoginResponse = await axios.post('/login', data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        withCredentials: true
      })

      const accessToken: string = response?.data?.access_token
      const role: string = response?.data?.role

      setAuth({ accessToken, role })
      localStorage.setItem('SI', '1')

      const timeoutId = setTimeout(() => {
        localStorage.removeItem('SI')
      }, 2147483647)

      role === 'user' ?
      navigate(from || '/', {replace: true}) :
      navigate(from || '/dashboard', {replace: true})
      
      return () => clearTimeout(timeoutId)
      
    } catch (error) {
      axiosError(error as Error)

    } finally {
      setIsLoading(false)

    }
  }

  return (
    <div className='px-6 bg-white'>
      <form className='mt-40 pb-10 space-y-1 sm:mx-auto sm:w-full sm:max-w-sm' onSubmit={handleSubmit}>
        <h1 className='text-3xl font-extrabold text-center'>Sign in</h1>
        <p className='text-center text-sm text-muted-foreground'>Enter your email below to access your account</p>
        <div className='space-y-4 pt-6'>
          <div className="grid gap-1">
            <Label htmlFor="email" className='text-sm font-medium'>Email</Label>
            <Input id="email" type="text" placeholder="user@example.com" 
              value={email} onChange={e => setEmail(e.target.value)}  />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password" className='text-sm font-medium'>Password</Label>
            <Input id="password" type="password" 
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>
         
          <div className='pt-2'>
            <Button className='w-full' disabled={isLoading}>
              {
                isLoading ? <div className='flex items-center gap-x-2'>
                  <svg className='animate-spin' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  <p>Loading...</p>
                </div> :
                <p>Log in</p>
              }
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login