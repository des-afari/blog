import { FC, FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '@/utils/api'
import axiosError from '@/utils/error'
import {ChatBubbleIcon, DotsHorizontalIcon, HeartFilledIcon, HeartIcon, TrashIcon, UpdateIcon } from '@radix-ui/react-icons'
import { formatDate, formatTitle } from '@/utils/config'
import parser from 'html-react-parser'
import { Badge } from '@/components/ui/badge'
import 'quill/dist/quill.core.css'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import AuthorizedComments from './components/AuthorizedComments'
import UnAuthorizedComments from './components/UnAuthorizedComments'
import Footer from '@/components/Footer'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import { buttonVariants } from '@/components/ui/button'
import { Item } from '@radix-ui/react-select'

export interface ArticleResponse {
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

export interface ArticleInterface {
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
  const [article, setArticle] = useState<ArticleInterface>()
  const [voteCheck, setVoteCheck] = useState<boolean>()
  const [modal, setModal] = useState<string>()
  const [commentId, setCommentId] = useState<number>()
  
  const navigate = useNavigate()
  const { articleId } = useParams()
  const axiosPrivate = useAxiosPrivate()
  
  const userId = localStorage.getItem('id')
  const SI = localStorage.getItem('SI')
  
  useEffect(() => {
    const get_article = async () => {
      try {
        const response: ArticleResponse = await axios.get(`/article/${articleId}`)
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

  const handleCommentDelete = async ()  => {
    try {
      await axiosPrivate.delete(`comment/${commentId}/delete`)

      setArticle(prevArticle => {
        if (prevArticle) {
          const updatedComments =prevArticle.comments.filter(comment => {
            return comment.id !== commentId
          })

          return {
            ...prevArticle,
            comments: updatedComments
          }
        }
      })

    } catch (error) {
      axiosError(error as Error)
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
          <h1 className='text-[32px] leading-[38px] md:text-5xl font-extrabold'> {article?.title} </h1>
          <p className='sourceSerif text-xl md:text-[22px] md:leading-7'> {article?.description} </p>
          <div className='flex items-center gap-x-5'>
            <div onClick={handleVote} className='flex items-center gap-x-1 cursor-pointer'>
              {
                voteCheck ?
                <HeartFilledIcon width={18} height={18} /> : 
                <HeartIcon width={18} height={18} />
              }
              {article?.votes.length}
            </div>
            <div onClick={() => document.getElementById('comments')?.scrollIntoView()} className='flex items-center gap-x-1 cursor-pointer'>
              <ChatBubbleIcon width={18} height={18} />
              {article?.comments.length}
            </div>
          </div>
          <div className='text-muted-foreground'>
            <p className='text-sm'>
              {article?.updated_at ? formatDate(article.updated_at) : formatDate(article.created_at)}
            </p>
          </div>
          <img src={article?.article_img_url} className='w-full' alt="article_image" />
          <div className='mainArticle'> {parser(article?.content || "")}  </div>
          <div id='comments' className='mb-40'>
            <h2 className='text-xl md:text-2xl font-extrabold py-3'>Comments ({article?.comments.length}) </h2>
            {
              SI ? <AuthorizedComments article={article} setArticle={setArticle} /> : <UnAuthorizedComments />
            }
            <Dialog>
            <DropdownMenu>
              <div className='border-t pt-8 space-y-7'>
                {
                  article?.comments?.map(comment => (
                    <div key={comment.id} className='flex justify-between'>
                      <div className='flex gap-x-2'>
                        <div>
                          <Avatar>
                            <AvatarFallback> {comment.user.first_name.charAt(0)}{comment.user.last_name.charAt(0)} </AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <p className='font-bold'> {comment.user.first_name} {comment.user.last_name} </p>
                          <p className='text-xs text-muted-foreground'> {comment.updated_at ? formatDate(comment.updated_at) : formatDate(comment.created_at)} </p>
                          <p className='mt-4'> {comment.comment} </p>
                        </div>
                      </div>
                      <div className='w-12 grid items-start justify-end'>
                        {
                          comment.user.id !== userId ? 
                          "" :
                          <DropdownMenuTrigger>
                            <DotsHorizontalIcon />
                          </DropdownMenuTrigger>
                        }
                      </div>
                      <DropdownMenuContent>
                        <DialogTrigger asChild onClick={() => {
                          setModal('update')
                          setCommentId(comment.id)
                        }}>
                          <DropdownMenuItem className='flex items-center gap-x-2'>
                            <UpdateIcon />
                            <p>update</p>
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogTrigger asChild onClick={() => {
                          setModal('delete')
                          setCommentId(comment.id)
                        }}>
                          <DropdownMenuItem className='flex items-center gap-x-2'>
                            <TrashIcon />
                            <p>delete</p>
                          </DropdownMenuItem>
                        </DialogTrigger>
                      </DropdownMenuContent>
                    </div>
                  )) 
                }
              </div>
            </DropdownMenu>
            {
            modal === 'delete' && (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Comment</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently remove the comment.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className='grid gap-y-2 md:grid-flow-col'>
                  <DialogClose className={buttonVariants({"variant": "outline"})}>
                    Cancel
                  </DialogClose>
                  <DialogClose onClick={handleCommentDelete} className={buttonVariants({"variant": "default"})}>
                    Continue
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            )
          }
            </Dialog>
          </div>
        </article>
      }
      <Footer />
    </main>
  )
}

export default ArticleView