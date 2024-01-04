import { FC, useState, useEffect, FormEvent } from 'react'
import axios from '@/utils/api'
import axiosError from '@/utils/error'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DeleteIcon, Loader2 } from 'lucide-react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { nameRegex } from '@/utils/config'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"


interface TagResponse {
  data: {
    id: number
    parent_id: number
    name: string 
  }[]
}

interface TagInterface {
    id: number
    parent_id: number
    name: string 
}[]

interface SelectedInterface {
    id: number
    parent_id: number
    name: string 
}


const Tags: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<TagInterface[]>()
  const [tags, setTags] = useState<TagInterface[]>()
  const [category, setCategory] = useState<string>('')
  const [tag, setTag] = useState<string>('')
  const [tagRefresh, setTagRefresh] = useState<boolean>(false)
  const [selected, setSelected] = useState<SelectedInterface | null>(null)

  const axiosPrivate = useAxiosPrivate()


  useEffect(() => {
    const get_tags = async () => {
      try {
        const response: TagResponse = await axios.get('/tags')

        setCategories(response?.data?.filter(value => value.parent_id === null))
        setTags(response?.data?.filter(value => value.parent_id !== null))
        
      } catch (error) {
        axiosError(error as Error)

      }
    } 

    get_tags()

  }, [tagRefresh])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!nameRegex.test(tag)) {
      toast('Something went wrong', {
        description: "Tag must have at least two characters",
      })
      setIsLoading(false)
      return
    }

    const parent_id = categories?.find(value => value.name === category)?.id || undefined

    const data = {
      "parent_id": parent_id,
      "name": tag
    }

    try {
      await axiosPrivate.post('/tag/create', data)

      setTagRefresh(!tagRefresh)

    } catch (error) {
      axiosError(error as Error)

    } finally {
      setCategory('')
      setTag('')
      setIsLoading(false)

    }
  }

  const handleDeleteTag = async () => {
    try {
      await axiosPrivate.delete(`/tag/${selected?.id}/delete`)

      setTagRefresh(!tagRefresh)

    } catch (error) {
      axiosError(error as Error)
    }
  }

  return (
    <section className='grid grid-cols-6' style={{height: "calc(100vh - 9rem)"}}>
      <div className='border-r pr-4 col-span-4'>
        <AlertDialog>
        <div className='customScroll grid grid-flow-col gap-x-3 py-3 overflow-x-auto'>
          {
            categories?.map(item => (
              <Card key={item.id} className='h-32 w-52'>
                <CardContent className='h-full relative pt-2 space-y-1'>
                  <Badge className='text-[.6rem]'>Category</Badge>
                  <h2 className='text-xl font-extrabold'> {item.name} </h2>
                  <AlertDialogTrigger asChild>
                    <Button title='delete' onClick={() => setSelected(item)} className='absolute bottom-2 right-2 rounded-full' variant={'ghost'} size={'icon'}>
                      <DeleteIcon />
                    </Button>
                  </AlertDialogTrigger>
                </CardContent>
              </Card>
            ))
          }
        </div>
        <div className='p-3 customScroll h-fit max-h-[20rem] grid grid-cols-4 gap-4 overflow-y-auto'>
          {
            tags?.map(item => (
              <Card key={item.id} className='h-32'>
                <CardContent className='h-full relative pt-2 space-y-1'>
                  <Badge className='text-[.6rem]' variant={'secondary'}> {categories?.find(value => value.id === item.parent_id)?.name} </Badge>
                  <h2 className='text-xl font-extrabold'> {item.name} </h2>
                  <AlertDialogTrigger asChild>
                    <Button title='delete' onClick={() => setSelected(item)} className='absolute bottom-2 right-2 rounded-full' variant={'ghost'} size={'icon'}>
                      <DeleteIcon />
                    </Button>
                  </AlertDialogTrigger>
                </CardContent>
              </Card>
            ))
          }
        </div>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove a tag from the servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTag}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
      <div className='col-span-2 mt-20'>
        <form action="#" method='POST' onSubmit={handleSubmit} className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h1 className='text-3xl font-extrabold text-center'>Create a Tag</h1>
          <p className='text-center text-sm text-muted-foreground'>Select the parent and enter the name of the tag below</p>
          <div className='space-y-4 pt-6'>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder='Select a category' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {
                    categories?.map(item => (
                      <SelectItem key={item.id} value={item.name}> {item.name} </SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>         
            <div>
              <Input id="tag" type="text" placeholder="Neural Networks" 
                value={tag} onChange={e => setTag(e.target.value)}  />
            </div>
            <div className='pt-2'>
              <Button type='submit' className='w-full' disabled={isLoading}>
                {
                  isLoading ? <div className='flex items-center gap-x-2'>
                    <Loader2 className='animate-spin' />
                    <p>Loading...</p>
                  </div> :
                  <p>Continue</p>
                }
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Tags