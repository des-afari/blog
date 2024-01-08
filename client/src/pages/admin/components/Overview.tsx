import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileTextIcon, LightningBoltIcon, MixIcon, PersonIcon } from '@radix-ui/react-icons'
import { FC, useEffect, useState } from 'react'
import { UserInterface, UsersResponse } from './Accounts'
import { ArticlesInterface, ArticlesResponse } from './Articles'
import { TagInterface, TagResponse } from './Tags'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import axiosError from '@/utils/error'
import axios from '@/utils/api'


const Overview: FC = () => {
  const axiosPrivate = useAxiosPrivate()
  const [users, setUsers] = useState<UserInterface[]>()
  const [articles, setArticles] = useState<ArticlesInterface[]>()
  const [tags, setTags] = useState<TagInterface[]>()

  useEffect(() => {
    const get_users = async () => {
      try {
        const response: UsersResponse = await axiosPrivate.get('/users')
        
        const items = response?.data?.filter(user => user.role === 'user')
        setUsers(items)
        
      } catch (error) {
        axiosError(error as Error)
        
      }
    }
    
    const get_articles = async () => {
      try {
        const response: ArticlesResponse = await axios.get('/articles')
        
        const items = response?.data
        setArticles(items)
        
      } catch (error) {
        axiosError(error as Error)
        
      }
    }
    
    const get_tags = async () => {
      try {
        const response: TagResponse = await axios.get('/tags')
        
        const items = response?.data?.filter(tag => tag.parent_id !== null)
        setTags(items)
        
      } catch (error) {
        axiosError(error as Error)

      }
    }

    get_users()
    get_articles()
    get_tags()

  }, [])


  return (
    <div className='space-y-4'>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Users
            </CardTitle>
            <PersonIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"> {users?.length} </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Articles
            </CardTitle>
            <FileTextIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"> {articles?.length} </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Visitors
            </CardTitle>
            <LightningBoltIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"> 350 </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tags
            </CardTitle>
            <MixIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"> {tags?.length} </div>
          </CardContent>
        </Card>
      </div>
      <div className='grid grid-cols-6 gap-4'>
        <Card className='col-span-4'></Card>
        <Card className='customScroll h-[365px] col-span-2 overflow-y-auto'>
          <CardHeader className='sticky top-0 bg-white'>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <div className='space-y-2'>
            {
              users?.map(item => (
                <CardContent key={item.id}>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{item.first_name} {item.last_name}</p>
                    <p className="text-sm text-muted-foreground"> {item.email} </p>
                  </div>
                </CardContent>
              ))
            }
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Overview