import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { FC, FormEvent, useState } from 'react'
import { emailRegex, passwordRegex, nameRegex } from '@/utils/config'
import { toast } from 'sonner'
import axios from '@/utils/api'
import useAuth from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import axiosError from '@/utils/error'
import { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'


interface RegistrationResponse {
  data: {
    access_token: string
    role: string
    auth_type: string
  }
}

const Register: FC = () => {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [verification, setVerification] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!nameRegex.test(firstName)) {
      toast('Something went wrong', {
        description: "First name must have at least two characters",
      })
      setIsLoading(false)
      return
    }

    if (!nameRegex.test(lastName)) {
      toast('Something went wrong', {
        description: "Last name must have at least two characters",
      })
      setIsLoading(false)
      return
    }

    if (!emailRegex.test(email)) {
      toast('Something went wrong', {
        description: "Invalid email",
      })
      setIsLoading(false)
      return
    }

    if (!passwordRegex.test(password)) {
      toast('Something went wrong', {
        description: "Password must have at least 10 characters, one special character, one capital letter and one number",
      })
      setIsLoading(false)
      return
    }

    if (password !== verification) {
      toast('Something went wrong', {
        description: "Passwords do not match",
      })
      setIsLoading(false)
      return
    }

    const data = {
      "first_name": firstName,
      "last_name": lastName,
      "email": email,
      "password": password
    }

    try {
      const response: RegistrationResponse = await axios.post('/register', data, {
        headers: {
          "Content-Type": "application/json"
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
      <form className='mt-20 pb-10 space-y-1 sm:mx-auto sm:w-full sm:max-w-sm' onSubmit={handleSubmit}>
        <h1 className='text-3xl font-extrabold text-center'>Create an account</h1>
        <p className='text-center text-sm text-muted-foreground'>Enter your email below to create your account</p>
        <div className='space-y-4 pt-6'>
          <div className='grid grid-cols-2 gap-x-2'>
            <div className="grid gap-1 col-span-1">
              <Label htmlFor="first_name" className='text-sm font-medium'>First Name</Label>
              <Input id="first_name" type="text" placeholder="John"
                value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div className="grid gap-1 col-span-1">
              <Label htmlFor="last_name" className='text-sm font-medium'>Last Name</Label>
              <Input id="last_name" type="text" placeholder="King"
                value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </div>
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
          <div className="grid gap-1">
            <Label htmlFor="verification" className='text-sm font-medium'>Verify Password</Label>
            <Input id="verification" type="password" 
              value={verification} onChange={e => setVerification(e.target.value)} />
          </div>
          <div className='pt-2'>
            <Button className='w-full' disabled={isLoading}>
              {
                isLoading ? <div className='flex items-center gap-x-2'>
                  <Loader2 className='animate-spin' />
                  <p>Loading...</p>
                </div> :
                <p>Create account</p>
              }
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Register