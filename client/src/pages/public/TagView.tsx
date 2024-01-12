import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '@/utils/api'
import { ArticlesInterface, ArticlesResponse, TagResponse, TagInterface } from '@/components/Interfaces'
import axiosError from '@/utils/error'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils/config'

const TagView: FC = () => {
  const [articles, setArticles] = useState<ArticlesInterface[]>()
  const [tag, setTag] = useState<TagInterface>()

  const navigate = useNavigate()
  const { tagId } = useParams() 

  useEffect(() => {
    const get_articles = async () => {
     try {
      const response: ArticlesResponse = await axios.get(`/tag/articles/${tagId}`)
      setArticles(response?.data)

     } catch (error) {
      axiosError(error as Error)
     }
    }

    const get_tag = async () => {
      try {
        const response: TagResponse = await axios.get(`/tag/${tagId}`)
        setTag(response?.data)

      } catch (error) {
        axiosError(error as Error)
      }
    }

    get_tag()
    get_articles()
  }, [])

  return (
    <main>
      <div className='bg-gray-100 border-b'>
        <h1 className='px-6 py-2 flex items-center sm:max-w-3xl mx-auto text-4xl md:text-5xl font-extrabold min-h-24 md:min-h-32'>{tag?.name}</h1>
      </div>
      <div className='sm:max-w-3xl mx-auto p-6'>
      {
        articles?.map(item => (
          <div
            key={item.id}
            className='grid gap-y-3 py-6 md:grid-cols-4 md:gap-x-3 border-b cursor-pointer'
            onClick={() => navigate(`/article/${item.id}`)}
            >
            <div className='md:col-span-1'>
              <img className='' src={item.article_img_url} alt="article_image" />
            </div>
            <div className='md:col-span-3 grid gap-y-3 md:gap-y-1'>
              <div className='flex items-center flex-wrap gap-2'>
                {
                  item.tags.map(tag => (
                    <Badge className='text-xs' key={tag.id} variant={'outline'}> {tag.name} </Badge>
                    ))
                  }
              </div>
              <h1 className='text-xl font-extrabold leading-tight'> {item.title} </h1>
              <p className='sourceSerif'> {item.description} </p>
              <p className='text-xs text-muted-foreground'>
                {item.updated_at ? formatDate(item.updated_at) : formatDate(item.created_at)} 
              </p>
            </div>
          </div>
        ))
      }
      </div>
    </main>
  )
}

export default TagView