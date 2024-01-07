import { FC, FormEvent, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '@/utils/api'
import { ArticlesInterface, ArticlesResponse } from '@/pages/admin/components/Articles'
import axiosError from '@/utils/error'
import { Badge } from '@/components/ui/badge'
import { formatArticleDate, formatTitle } from '@/utils/config'

const TagView: FC = () => {
  const [articles, setArticles] = useState<ArticlesInterface[]>()

  const location = useLocation()
  const navigate = useNavigate()

  const tagId = location.state && location.state.tagId
  const tagName = location.state && location.state.tagName

  useEffect(() => {
    const get_articles = async () => {
     try {
      const response: ArticlesResponse = await axios.get(`/tag/${tagId}`)
      setArticles(response?.data)

     } catch (error) {
      axiosError(error as Error)
     }
    }

    get_articles()
  }, [])

  const handleClick = (e: FormEvent) => {
    const articleId = e.currentTarget.getAttribute('data-id')
    const articleTitle = formatTitle(e.currentTarget.getAttribute('data-title'))

    articleId && articleTitle && navigate(`/article/${articleTitle}`, {state: {articleId}})
  }

  return (
    <main>
      <div className='bg-gray-100 border-b'>
        <h1 className='px-6 flex items-center sm:max-w-3xl mx-auto text-5xl font-extrabold h-32'>{tagName}</h1>
      </div>
      <div className='sm:max-w-3xl mx-auto grid p-6'>
      {
        articles?.map(item => (
          <div
            key={item.id}
            className='grid gap-y-3 py-6 md:grid-cols-4 md:gap-x-3 md:border-b cursor-pointer'
            data-title={item.title}
            data-id={item.id}
            onClick={handleClick}
            >
            <div className='md:col-span-1'>
              <img className='' src={item.article_img_url} alt="article_image" />
            </div>
            <div className='grid gap-y-3 md:col-span-3 md:gap-y-0'>
              <div className=' flex items-center flex-wrap gap-3'>
                {
                  item.tags.map(tag => (
                    <Badge key={tag.id} className='text-[.68rem] ' variant={'secondary'}> {tag.name} </Badge>
                    ))
                  }
              </div>
              <h1 className='text-2xl font-extrabold md:text-xl md:font-bold leading-tight'> {item.title} </h1>
              <p className='md:text-sm'> {item.description} </p>
              <small className='text-muted-foreground'> {formatArticleDate(item.updated_at ? item.updated_at : item.created_at)} </small>
            </div>
          </div>
        ))
      }
      </div>
    </main>
  )
}

export default TagView