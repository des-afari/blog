import { FC, FormEvent, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { nameRegex } from '@/utils/config'
import { toast } from 'sonner'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import axiosError from '@/utils/error'
import { CurrentUserResponse, UserComponentInterface } from './Interfaces'

const Information: FC<UserComponentInterface> = ({ user, setUser }) => {
  const [firstName, setFirstName] = useState<string>(user.first_name)
  const [lastName, setLastName] = useState<string>(user.last_name)

  const axiosPrivate = useAxiosPrivate()

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
      const response: CurrentUserResponse = await axiosPrivate.put('/user/update', data)
      
      setUser(response?.data)
      sessionStorage.setItem('currentUser', JSON.stringify(response?.data))

    } catch (error) {
      axiosError(error as Error)
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Update name</DialogTitle>
        <DialogDescription>Make changes to your name here. Click save changes when you're done.</DialogDescription>
      </DialogHeader>
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
    </DialogContent>
  )
}

export default Information