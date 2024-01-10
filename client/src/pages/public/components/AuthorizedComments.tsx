import { axiosPrivate } from '@/utils/api'
import { Dispatch, FC, FormEvent, SetStateAction, useState } from 'react'
import { ArticleInterface } from '../ArticleView'
import axiosError from '@/utils/error'
import { Input } from '@/components/ui/input'


export interface CommentResponse {
  data: {
    id: 0,
    comment: string
    created_at: Date
    updated_at: Date
    user: {
      id: string
      first_name: string
      last_name: string
    }
  }
}

interface ArticleCommentInterface {
  article: ArticleInterface
  setArticle: Dispatch<SetStateAction<ArticleInterface | undefined>>
}

const AuthorizedComments: FC<ArticleCommentInterface> = ({ article, setArticle }) => {
  const [comment, setComment] = useState<string>('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const data = {
      "comment": comment
    }

    try {
      const response: CommentResponse = await axiosPrivate.post(`/comment/${article.id}/create`, data)
      
      setArticle(prevArticle => {
        if (prevArticle) {
          return {
            ...prevArticle,
            comments: [...prevArticle.comments, response?.data]
          }
        }
      })

      setComment('')
      
    } catch (error) {
      axiosError(error as Error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='pb-8'>
      <Input 
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder='What are your thoughts?'
        className='shadow-md h-12 text-md'
      />
    
    </form>
  )
}

export default AuthorizedComments