import { ArticlesInterface, ArticlesResponse } from '@/components/Interfaces'
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
      <form onSubmit={handleSubmit} className='px-6 py-2 flex items-center bg-gray-100 border-b  font-extrabold min-h-24 md:min-h-32'>
        <Input 
          value={title}
          onChange={e => setTitle(e.target.value)}
          className='text-4xl md:text-5xl h-full border-0 border-gray-300 shadow-none hover:border-b focus-visible:ring-0 focus:border-b'
          placeholder='Type article title here'
        />
      </form>
      {
        isLoading ? 
        <div style={{height: "calc(100vh - 8rem - 4rem)"}} className='flex items-center justify-center'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/><line x1="4.93" x2="7.76" y1="4.93" y2="7.76"/><line x1="16.24" x2="19.07" y1="16.24" y2="19.07"/><line x1="2" x2="6" y1="12" y2="12"/><line x1="18" x2="22" y1="12" y2="12"/><line x1="4.93" x2="7.76" y1="19.07" y2="16.24"/><line x1="16.24" x2="19.07" y1="7.76" y2="4.93"/></svg>
        </div> :
        <div className='sm:max-w-3xl mx-auto p-6'>
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