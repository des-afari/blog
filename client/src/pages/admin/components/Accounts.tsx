import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { FC, useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import axiosError from '@/utils/error'
import { Badge } from '@/components/ui/badge'


interface UsersResponse {
  data: {
    id: string
    first_name: string
    last_name: string
    role: string
    email: string
    last_login: Date
    created_at: Date
  }[]
}

interface UserInterface {
  id: string
  first_name: string
  last_name: string
  role: string
  email: string
  last_login: Date
  created_at: Date
}[]



const Accounts: FC = () => {
  const [users, setUsers] = useState<UserInterface[]>()

  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    const get_users = async () => {
      try {
        const response: UsersResponse = await axiosPrivate.get('/users')

        setUsers(response?.data)

      } catch (error) {
        axiosError(error as Error)
        
      }
    }

    get_users()
  }, [])

  return (
    <section style={{height: "calc(100vh - 9rem"}} className='space-y-4'>
      <div className='grid grid-cols-4 gap-1 w-[450px]'>
        <small className='col-span-4 text-muted-foreground'>Provide an email address to filter the table</small>
        <Input className='col-span-3' placeholder='Filter users'></Input>
        <Button variant={'outline'} className='col-span-1 flex items-center justify-center gap-x-1 text-muted-foreground'>
          <MagnifyingGlassIcon />
          Search
        </Button>   
      </div>
      <Table className='border'>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[330px]">Id</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className='text-right'>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='customScroll max-h-[381px] overflow-y-auto'>
          {
            users?.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium"> {item.id} </TableCell>
                <TableCell> {item.first_name} </TableCell>
                <TableCell> {item.last_name} </TableCell>
                <TableCell> {item.email} </TableCell>
                <TableCell> {new Date(item.last_login).toLocaleDateString('en-US', {'year': 'numeric', "month": 'short', "day": 'numeric', "hour": 'numeric', "minute": 'numeric'})} </TableCell>
                <TableCell> {new Date(item.created_at).toLocaleDateString('en-US', {'year': 'numeric', "month": 'short', "day": 'numeric', "hour": 'numeric', "minute": 'numeric'})} </TableCell>
                <TableCell className='text-right'>
                  {
                    item.role === 'admin' ? 
                    <Badge> {item.role} </Badge> :
                    <Badge variant={'secondary'}> {item.role} </Badge>
                  }
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </section>
  )
}

export default Accounts