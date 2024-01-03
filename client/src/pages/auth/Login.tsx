import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { FC, FormEvent, useState } from 'react'
import axios from '@/utils/api'
import useAuth from '@/hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosError from '@/utils/error'
import { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'


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

      role === 'admin' ? navigate('/dashboard') : navigate('/')

    } catch (error) {
      axiosError(error as AxiosError)

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
                  <Loader2 className='animate-spin' />
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