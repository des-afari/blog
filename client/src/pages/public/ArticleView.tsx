import { FC, FormEvent, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '@/utils/api'
import axiosError from '@/utils/error'
import { CalendarIcon, ChatBubbleIcon, HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import { formatArticleDate, formatTitle } from '@/utils/config'
import parser from 'html-react-parser'
import { Badge } from '@/components/ui/badge'
import 'quill/dist/quill.core.css'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { toast } from 'sonner'

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

interface VoteResponse {
  data: {
    state: string
    user_id: string
    article_id: string
  }
}

const ArticleView: FC = () => {
  const [article, setArticle] = useState<ArticlesInterface>()
  const [voteCheck, setVoteCheck] = useState<boolean>()
  
  const location = useLocation()
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()
  
  const articleId = location.state && location.state.articleId
  const userId = localStorage.getItem('id')
  const SI = localStorage.getItem('SI')
  
  useEffect(() => {
    const get_article = async () => {
      try {
        const response: ArticlesResponse = await axios.get(`/article/${articleId}`)
        setArticle(response?.data)

        setVoteCheck(response?.data?.votes?.some(
          vote => vote.article_id === articleId && vote.user_id === userId
        ))
      } catch (error) {
        axiosError(error as Error)
      }
    }

    get_article()
  }, [])

  const handleTagClick = (e: FormEvent) => {
    const tagId = e.currentTarget.getAttribute('data-id')
    const tagName = e.currentTarget.getAttribute('data-name')
    const tagFormatedName = formatTitle(e.currentTarget.getAttribute('data-name'))

    tagId && tagName && navigate(`/tag/${tagFormatedName}`, {state: {tagId, tagName}})
  }

  const handleVote = async () => {
    if (SI) {
      try {
        const response: VoteResponse = await axiosPrivate.get(`/vote/${articleId}`)
        
        const state: string = response?.data?.state
        const user_id: string = response?.data?.user_id
        const article_id: string = response?.data?.article_id

        const vote = {
          "article_id": article_id,
          "user_id": user_id
        }

        if (state === 'add') {
          setVoteCheck(true)
          setArticle(prevArticle => {
            if (prevArticle) {
              return {
                ...prevArticle,
                votes: [...prevArticle.votes, vote]
              }
            }
          })
        } else if (state === 'remove') {
          setVoteCheck(false)
          setArticle(prevArticle => {
            if (prevArticle) {
              const updatedVotes = prevArticle.votes.filter(votes => {
                return votes.user_id !== vote.user_id
              })

              return {
                ...prevArticle,
                votes: updatedVotes
              }
            }
          })
        }

      } catch (error) {
        axiosError(error as Error)
      }
    } else {
      navigate('/register')
    }
  }

  return (
    <main>
      {
        article &&
        <article className='sm:max-w-3xl mx-auto grid gap-y-3 p-6 pt-10'>
          <div className='flex items-center flex-wrap gap-2'>
          {
            article?.tags.map(item => (
              <Badge 
                key={item.id}
                variant={'outline'}
                onClick={handleTagClick}
                data-id={item.id}
                data-name={item.name}
                className='cursor-pointer'
                > 
                  {item.name} 
                </Badge>
            ))
          }
          </div>
          <h1 className='sourceSerif text-[32px] leading-[38px] md:text-5xl font-extrabold'> {article?.title} </h1>
          <p className='sourceSerif text-xl md:text-2xl md:leading-7'> {article?.description} </p>
          <div className='flex items-center gap-x-5'>
            <div onClick={handleVote} className='text-lg flex items-center gap-x-1 cursor-pointer'>
              {
                voteCheck ?
                <HeartFilledIcon width={18} height={18} /> : 
                <HeartIcon width={18} height={18} />
              }
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