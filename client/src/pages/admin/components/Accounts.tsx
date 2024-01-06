import { Input } from '@/components/ui/input'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import axiosError from '@/utils/error'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils/config'
import { Button } from '@/components/ui/button'
import { ScissorsIcon } from '@radix-ui/react-icons'
import { AlertDialogFooter, AlertDialogHeader, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'


export interface UsersResponse {
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

export interface UserInterface {
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
  const [query, setQuery] = useState<string>()
	const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout>()
  const [selected, setSelected] = useState<string>()
  const [tagRefresh, setTagRefresh] = useState<boolean>()

  const typingTimeout = 1300
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

  }, [tagRefresh])

	const handleSubmit = async () => {
		try {
			const response: UsersResponse = await axiosPrivate.get(`/users?query=${query}`)
			setUsers(response?.data)

		} catch (error) {
			axiosError(error as Error)

		}
	}

	const  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		clearTimeout(typingTimer)
		setQuery(e.target.value)

		const timer = setTimeout(handleSubmit, typingTimeout)
		setTypingTimer(timer)
	}

	useEffect(() => {
		return () => {
			clearTimeout(typingTimer)
		}
	}, [typingTimer])

  const handleDelete = async () => {
    try {
      await axiosPrivate.delete(`/user/${selected}/delete`)

      setTagRefresh(!tagRefresh)

    } catch (error) {
      axiosError(error as Error)
    }
  }

  return (
    <section style={{height: "calc(100vh - 9rem"}} className='space-y-4'>
      <div className='w-[450px]'>
        <small className='col-span-4 text-muted-foreground'>Provide an email address to filter the table</small>
        <Input className='col-span-3' placeholder='Filter users' value={query} onChange={handleChange}></Input>
      </div>
      <AlertDialog>
      <Table className='border'>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[340px]">Id</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className='text-right'>Delete</TableHead>
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
                  <TableCell> {formatDate(item.last_login)} </TableCell>
                  <TableCell> {formatDate(item.created_at)} </TableCell>
                  <TableCell>
                    {
                      item.role === 'admin' ? 
                      <Badge> {item.role} </Badge> :
                      <Badge variant={'secondary'}> {item.role} </Badge>
                    }
                  </TableCell>
                  <TableCell className='text-right'>
                    <AlertDialogTrigger asChild>
                      <Button 
                        onClick={() => setSelected(item.id)} 
                        size={'icon'} 
                        variant={'destructive'} 
                        className='rounded-full'
                      >
                        <ScissorsIcon />
                      </Button>
                    </AlertDialogTrigger>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
          <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </Table>
      </AlertDialog>
    </section>
  )
}

export default Accounts