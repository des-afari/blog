import { axiosPrivate } from '@/utils/api'
import { FC, FormEvent, useState } from 'react'
import axiosError from '@/utils/error'
import { Input } from '@/components/ui/input'
import { CommentResponse, AuthorizedCommentComponentInterface } from '@/components/Interfaces'
import { nameRegex } from '@/utils/config'
import useToast from '@/hooks/useToast'


const AuthorizedComments: FC<AuthorizedCommentComponentInterface> = ({ article, setArticle }) => {
  const [comment, setComment] = useState<string>('')

  const toast = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!nameRegex.test(comment)) {
      toast('Comment must be longer than two characters')
      return
    }


    const data = {
      "comment": comment
    }

    try {
      const response: CommentResponse = await axiosPrivate.post(`/comment/${article.id}/create`, data)
      
      setArticle(prevArticle => {
        if (prevArticle) {
          return {
            ...prevArticle,
            comments: [response?.data, ...prevArticle.comments]
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