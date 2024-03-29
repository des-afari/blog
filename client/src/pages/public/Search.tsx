import { ArticlesInterface, ArticlesResponse } from '@/components/Interfaces'
import Loader from '@/components/Loader'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import axios from '@/utils/api'
import { formatDate } from '@/utils/config'
import axiosError from '@/utils/error'
import { FC, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Search: FC = () => {
  const [title, setTitle] = useState<string>('')
  const [articles, setArticles] = useState<ArticlesInterface[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response: ArticlesResponse = await axios.get(`/articles?query=${title}`)
      
      response?.data?.reverse()
      setArticles(response?.data)
      
    } catch (error) {
      axiosError(error as Error)

    } finally{
      setIsLoading(false)
    }
  }

  return (
    <main>
      <form onSubmit={handleSubmit} className='px-4 md:px-6 py-2 flex items-center bg-gray-100 border-b  font-extrabold min-h-24 md:min-h-32'>
        <Input 
          value={title}
          onChange={e => setTitle(e.target.value)}
          className='text-4xl md:text-5xl h-full border-0 border-gray-300 shadow-none hover:border-b focus-visible:ring-0 focus:border-b'
          placeholder='Type article title here'
        />
      </form>
      {
        isLoading ? 
        <Loader height='calc(100vh - 8rem - 4rem)' styles='' /> :
        <div className='sm:max-w-3xl mx-auto p-6 sm:px-12 md:px-6'>
        {
          articles?.map(item => (
            <div
              key={item.id}
              className='grid gap-y-3 py-6 md:grid-cols-4 md:gap-x-3 border-b cursor-pointer'
              onClick={() => navigate(`/article/${item.id}`)}
              >
              <div className='md:col-span-1'>
                <img src={item.article_img_url} alt="article_image" />
              </div>
              <div className='md:col-span-3 grid gap-y-3 md:gap-y-1'>
                <div className='flex items-center flex-wrap gap-2'>
                  {
                    item.tags.map(tag => (
                      <Badge key={tag.id} variant={'outline'}> {tag.name} </Badge>
                      ))
                    }
                </div>
                <h1 className=' text-2xl font-extrabold'> {item.title} </h1>
                <p> {item.description} </p>
                <p className='text-sm text-muted-foreground'>
                  {formatDate(item.created_at)} 
                </p>
              </div>
            </div>
          ))
        }
        </div>
      }
    </main>
  )
}

export default Search