import { FC, useRef, useState, useEffect, FormEvent } from 'react'
import ReactQuill from 'react-quill'
import useTextAreaExpansion from '@/hooks/useTextAreaExpansion'
import { Input } from '@/components/ui/input'
import { TagsResponse, TagsInterface, TagInterface } from '@/components/Interfaces'
import axios from '@/utils/api'
import axiosError from '@/utils/error'
import { Button, buttonVariants } from '@/components/ui/button'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useNavigate } from 'react-router-dom'
import Loader from '@/components/Loader'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import useReactQuillModules, { formats } from '@/hooks/useReactQuillModules'
import "react-quill/dist/quill.snow.css"


const CreateArticle: FC = () => {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [articleImageURL, setArticleImageURL] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<TagInterface[]>([])
  const [tags, setTags] = useState<TagsInterface[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const titleArea = useRef<HTMLTextAreaElement>(null)
  const descriptionArea = useRef<HTMLTextAreaElement>(null)
  const textAreaExpansion = useTextAreaExpansion()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const reactQuillModules = useReactQuillModules()

  useEffect(() => {
    const get_tags = async () => {
      try {
        const response: TagsResponse = await axios.get('/tags')
        setTags(response?.data?.filter(value => value.parent_id !== null))
        
      } catch (error) {
        axiosError(error as Error)

      }
    } 

    get_tags()

  }, [])

  const handleClick = (item: TagInterface) => {
    selectedTags.some(tag => tag.id === item.id) ? 
    setSelectedTags(prevTags => prevTags.filter(tag => tag.id !== item.id)) :
    setSelectedTags(prevTags => [...prevTags, item])
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const tagIds = selectedTags.map(item => item.id)

    const data = {
      "title": title,
      "article_img_url": articleImageURL,
      "description": description,
      "content": content,
      "tags": tagIds
    }

    try {
      await axiosPrivate.post('/article/create', data)
      navigate(-1)

    } catch (error) {
      axiosError(error as Error)

    } finally {
      setIsLoading(false)

    }
  }

  return (
    <>
    {
      isLoading ?
      <Loader height='100vh' styles='' /> :
      <form action='#' method='POST' onSubmit={handleSubmit} className='p-6 mb-20 max-w-3xl mx-auto space-y-4'>
        <div className='text-6xl'>
          <Textarea
            ref={titleArea}
            value={title}
            onChange={e => textAreaExpansion(e, titleArea, setTitle)}
            placeholder='Title'
            className='text-5xl font-semibold resize-none overflow-hidden'
          />
        </div>
        <div className='flex justify-center flex-wrap'>
          {
            tags?.map(item => (
              <div
                key={item.id}
                onClick={() => handleClick(item)}
                className={cn(
                  buttonVariants(
                    {"variant": `${selectedTags.some(tag => tag.id === item.id) ? 'default' : 'outline'}`}
                  ),
                  "cursor-pointer")}
              >
                {item.name}
              </div>
            ))
          }
        </div>
        <div>
          <Input 
            value={articleImageURL}
            onChange={e => setArticleImageURL(e.target.value)}
            placeholder="Insert the url for the article's image"
          />
        </div>
        <div>
          <Textarea
            ref={descriptionArea}
            value={description}
            onChange={e => textAreaExpansion(e, descriptionArea, setDescription)}
            placeholder='Add a description here'
            className='min-h-24 overflow-hidden resize-none'
          />
        </div>
        <ReactQuill
            theme="snow"
            modules={reactQuillModules}
            formats={formats}
            placeholder="Write here"
            value={content}
            onChange={value => setContent(value)} 
          >
          </ReactQuill>
        <Button type='submit' className='float-right'>
          Create new Article
        </Button>
      </form>
    }
    </>
  )
}

export default CreateArticle