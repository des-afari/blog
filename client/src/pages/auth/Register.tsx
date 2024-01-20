import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FC, FormEvent, useState } from 'react'
import { emailRegex, passwordRegex, nameRegex } from '@/utils/config'
import axios from '@/utils/api'
import useAuth from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import axiosError from '@/utils/error'
import useToast from '@/hooks/useToast'


interface RegistrationResponse {
  data: {
    id: string
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
  const toast = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!nameRegex.test(firstName)) {
      toast('First name must have at least two characters')
      setIsLoading(false)
      return
    }

    if (!nameRegex.test(lastName)) {
      toast('Last name must have at least two characters')
      setIsLoading(false)
      return
    }

    if (!emailRegex.test(email)) {
      toast('Invalid email')
      setIsLoading(false)
      return
    }

    if (!passwordRegex.test(password)) {
      toast('Password must have at least 10 characters, one special character, one capital letter and one number')
      setIsLoading(false)
      return
    }

    if (password !== verification) {
      toast('Passwords do not match')
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

      const id: string = response?.data?.id
      const accessToken: string = response?.data?.access_token
      const role: string = response?.data?.role

      setAuth({ accessToken, role })
      localStorage.setItem('SI', '1')
      localStorage.setItem('id', id)

      const timeoutId = setTimeout(() => {
        localStorage.removeItem('SI')
        localStorage.removeItem('id')
      }, 2147483647)

      if (role === 'admin') {
        navigate('/dashboard')
      } else {
        navigate(-1)
      }

      return () => clearTimeout(timeoutId)

    } catch (error) {
      axiosError(error as Error)

    } finally {
      setIsLoading(false)

    }
  }

  return (
    <div className='px-4 md:px-6 bg-white'>
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
                  <svg className='animate-spin' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
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