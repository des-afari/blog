import { FC, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from '@/utils/api'
import axiosError from '@/utils/error'
import { CalendarIcon, ChatBubbleIcon, HeartIcon } from '@radix-ui/react-icons'
import { formatArticleDate } from '@/utils/config'
import parser from 'html-react-parser'
import { Badge } from '@/components/ui/badge'
import 'quill/dist/quill.core.css'

export interface ArticlesResponse {
  data: {
    id: string
    title: string
    article_img_url: string
    description: string
    content: string
    created_at: Date
    updated_at: Date
    tags: {
      id: number
      parent_id: number
      name: string
    }[]
    votes: {
      article_id: string
      user_id: string
    }[]
    comments: {
      id: number
      comment: string
      created_at: Date
      updated_at: Date
      user: {
        id: string
        first_name: string
        last_name: string
      }
    }[]
  }
}

export interface ArticlesInterface {
  id: string
  title: string
  article_img_url: string
  description: string
  content: string
  created_at: Date
  updated_at: Date
  tags: {
    id: number
    parent_id: number
    name: string
  }[]
  votes: {
    article_id: string
    user_id: string
  }[]
  comments: {
    id: number
    comment: string
    created_at: Date
    updated_at: Date
    user: {
      id: string
      first_name: string
      last_name: string
    }
  }[]
}

const ArticleView: FC = () => {
  const [article, setArticle] = useState<ArticlesInterface>()
  
  const location = useLocation()
  const articleId = location.state && location.state.articleId
  
  useEffect(() => {
    const get_article = async () => {
      try {
        const response: ArticlesResponse = await axios.get(`/article/${articleId}`)
        setArticle(response?.data)

      } catch (error) {
        axiosError(error as Error)

      }
    }

    get_article()
  }, [])

  return (
    <main>
      {
        
        <article className='sm:max-w-3xl mx-auto grid gap-y-3 p-6 pt-10'>
          <div className='flex flex-wrap gap-2'>
          {
            article?.tags.map(item => (
              <Badge key={item.id} variant={'outline'}> {item.name} </Badge>
            ))
          }
          </div>
          <h1 className='sourceSerif text-[32px] leading-[38px] md:text-5xl font-extrabold'> {article?.title} </h1>
          <p className='sourceSerif text-xl md:text-2xl md:leading-7'> {article?.description} </p>
          <div className='flex items-center gap-x-5'>
            <div className='text-lg flex items-center gap-x-1'>
              <HeartIcon width={18} height={18} />
              {article?.votes.length}
            </div>
            <div className='text-lg flex items-center gap-x-1'>
              <ChatBubbleIcon width={18} height={18} />
              {article?.comments.length}
            </div>
          </div>
          <div className='text-muted-foreground flex items-center gap-x-1'>
            <CalendarIcon className='mb-0.5' />
            <p className='text-sm'>
              {article?.updated_at && formatArticleDate(article.updated_at)}
              {article?.updated_at === null && formatArticleDate(article.created_at)}
            </p>
          </div>
          <img src={article?.article_img_url} className='w-full' alt="article_image" />
          <div className='mainArticle'> {parser(article?.content || "")}  </div>
        </article>
      }
    </main>
  )
}

export default ArticleView