import { FC, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from '@/utils/api'
import axiosError from '@/utils/error'
import { ChatBubbleIcon, HeartIcon } from '@radix-ui/react-icons'
import { formatArticleDate } from '@/utils/config'
import parser from 'html-react-parser'
import { Badge } from '@/components/ui/badge'

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
      <div className='px-6 h-11 sticky bg-white top-0 border-b flex items-center justify-center'>
        <p className='sourceSerif text-center text-sm'>{article?.title}</p>
      </div>
      {
        
        <article className='sm:max-w-3xl mx-auto grid gap-y-3 mt-4 p-6'>
          <div className='flex gap-x-2'>
          {
            article?.tags.map(item => (
              <Badge variant={'outline'}> {item.name} </Badge>
            ))
          }
          </div>
          <h1 className='sourceSerif text-5xl font-extrabold'> {article?.title} </h1>
          <p className='sourceSerif text-2xl'> {article?.description} </p>
          <div className='flex items-center gap-x-3'>
            <div className='flex items-center gap-x-1'>
              <ChatBubbleIcon />
              {article?.comments.length}
            </div>
            <div className='flex items-center gap-x-1'>
              <HeartIcon />
              {article?.votes.length}
            </div>
          </div>
          <small className='text-muted-foreground'>
            {article?.updated_at && formatArticleDate(article.updated_at)}
            {article?.updated_at === null && formatArticleDate(article.created_at)}
          </small>
          <img src={article?.article_img_url} className='w-full' alt="article_image" />
          <div className='mainArticle'> {parser(article?.content || "")}  </div>
        </article>
      }
    </main>
  )
}

export default ArticleView