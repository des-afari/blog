import { FC, FormEvent, useState } from 'react'
import AuthorizedComments from './AuthorizedComments'
import UnAuthorizedComments from './UnAuthorizedComments'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDate } from '@/utils/config'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DotsHorizontalIcon, TrashIcon, UpdateIcon } from '@radix-ui/react-icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import axiosError from '@/utils/error'
import { CommentResponse, CommentComponentInterface } from '@/components/Interfaces'


const Comments: FC<CommentComponentInterface> = ({ article, setArticle }) => {
  const [modal, setModal] = useState<string>()
  const [commentId, setCommentId] = useState<number>()
  const [comment, setComment] = useState<string>("")

  const SI = localStorage.getItem('SI')
  const userId = localStorage.getItem('id')
  const axiosPrivate = useAxiosPrivate()

  const handleCommentDelete = async ()  => {
    try {
      await axiosPrivate.delete(`comment/${commentId}/delete`)

      setArticle(prevArticle => {
        if (prevArticle) {
          const updatedComments =prevArticle.comments.filter(item => {
            return item.id !== commentId
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

  const handleCommentChange = async (e: FormEvent) => {
    e.preventDefault()

    const data = {
      "comment": comment
    }

    try {
      const response: CommentResponse = await axiosPrivate.patch(`/comment/${commentId}/update`, data)
      
      setArticle(prevArticle => {
        if (prevArticle) {
          const updatedComments = prevArticle.comments.filter(item => item.id !== commentId)
      
          return {
            ...prevArticle,
            comments: [...updatedComments, response?.data]
          }
        }
      
        return prevArticle
      })

    } catch (error) {
      axiosError(error as Error)
    }
  }


  return (
    <div id='comments' className='mb-40'>
      <h2 className='text-xl md:text-2xl font-extrabold py-3'>Comments ({article.comments.length}) </h2>
      {
        SI ? <AuthorizedComments article={article} setArticle={setArticle} /> : <UnAuthorizedComments />
      }
      <Dialog>
        <div className='border-t pt-8 space-y-7'>
          {
            article.comments.map(comment => (
              <div key={comment.id} className='flex justify-between'>
                <div className='flex gap-x-2'>
                  <div>
                    <Avatar>
                      <AvatarFallback> {comment.user.first_name.charAt(0)}{comment.user.last_name.charAt(0)} </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className='font-bold'> {comment.user.first_name} {comment.user.last_name} </p>
                    <p className='text-xs text-muted-foreground'> {formatDate(comment.created_at)} </p>
                    <p className='mt-3'> {comment.comment} </p>
                  </div>
                </div>
                <div className='w-12 grid items-start justify-end'>
                  {
                    comment.user.id !== userId ? 
                    "" :
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <DotsHorizontalIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DialogTrigger asChild onClick={() => {
                          setModal('update')
                          setCommentId(comment.id)
                          setComment(article.comments.find(item => item.id === comment.id)?.comment || "")
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
                    </DropdownMenu>
                  }
                </div>
              </div>
            )) 
          }
        </div>
        
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
      )} 
      {
      modal === 'update' && (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update comment</DialogTitle>
          <DialogDescription>
            Make changes to your comment here. Click save changes when you're done.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-y-4" onSubmit={handleCommentChange}>
          <div className="grid gap-1">
            <Label htmlFor="Updatecomment" className='text-sm font-medium'>Comment</Label>
            <Input id="Updatecomment" value={comment} onChange={e => setComment(e.target.value)} />
          </div>
          <DialogFooter>
            <DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
      )}
      </Dialog>
    </div>
  )
}

export default Comments