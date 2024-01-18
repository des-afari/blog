import { FC, useState, useEffect, FormEvent } from 'react'
import axios from '@/utils/api'
import axiosError from '@/utils/error'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { nameRegex } from '@/utils/config'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ScissorsIcon } from '@radix-ui/react-icons'
import { TagsInterface, TagsResponse, TagInterface } from '@/components/Interfaces'


const Tags: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<TagsInterface[]>()
  const [tags, setTags] = useState<TagsInterface[]>()
  const [category, setCategory] = useState<string>('')
  const [tag, setTag] = useState<string>('')
  const [selected, setSelected] = useState<string>()

  const axiosPrivate = useAxiosPrivate()

  const get_tags = async () => {
    try {
      const response: TagsResponse = await axios.get('/tags')

      setCategories(response?.data?.filter(value => value.parent_id === null))
      setTags(response?.data?.filter(value => value.parent_id !== null))
      
    } catch (error) {
      axiosError(error as Error)

    }
  }

  useEffect(() => {
    get_tags()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!nameRegex.test(tag)) {
      toast('Something went wrong', {
        description: "Tag must have at least two characters",
        descriptionClassName: "sonner-desc",
          style: {
            backgroundColor: "#dc2626",
            borderColor: "#dc2626",
            color: "white"
          }
      })
      setIsLoading(false)
      return
    }

    const parent_id = categories?.find(value => value.name === category)?.id

    const data = {
      "parent_id": parent_id,
      "name": tag
    }

    try {
      await axiosPrivate.post<TagInterface>('/tag/create', data)
      
      get_tags()

    } catch (error) {
      axiosError(error as Error)

    } finally {
      setCategory('')
      setTag('')
      setIsLoading(false)

    }
  }

  const handleDelete = async () => {
    try {
      await axiosPrivate.delete(`/tag/${selected}/delete`)

      get_tags()

    } catch (error) {
      axiosError(error as Error)
    }
  }

  return (
    <section className='grid grid-cols-6' style={{height: "calc(100vh - 9rem)"}}>
      <div className='border-r pr-4 col-span-4'>
        <AlertDialog>
        <div className='customScroll grid grid-flow-col gap-x-3 pb-3 overflow-x-auto'>
          {
            categories?.map(item => (
              <Card key={item.id} className='h-32 w-52'>
                <CardContent className='h-full relative pt-2 space-y-1'>
                  <Badge className='text-[.6rem]'>Category</Badge>
                  <h2 className='text-xl font-extrabold'> {item.name} </h2>
                  <AlertDialogTrigger asChild>
                    <Button title='delete' onClick={() => setSelected(item.id)} className='absolute bottom-2 right-2 rounded-full' variant={'ghost'} size={'icon'}>
                      <ScissorsIcon />                   
                    </Button>
                  </AlertDialogTrigger>
                </CardContent>
              </Card>
            ))
          }
        </div>
        <div className=' customScroll  max-h-[20rem] pb-3 grid grid-cols-4 gap-4 overflow-y-auto'>
          {
            tags?.map(item => (
              <Card key={item.id} className='h-32'>
                <CardContent className='h-full relative pt-2 space-y-1'>
                  <Badge className='text-[.6rem]' variant={'secondary'}> {categories?.find(value => value.id === item.parent_id)?.name} </Badge>
                  <h2 className='text-xl font-extrabold'> {item.name} </h2>
                  <AlertDialogTrigger asChild>
                    <Button title='delete' onClick={() => setSelected(item.id)} className='absolute bottom-2 right-2 rounded-full' variant={'ghost'} size={'icon'}>
                      <ScissorsIcon />
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
              This action cannot be undone. This will permanently remove the tag.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
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
                    <svg className='animate-spin' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
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