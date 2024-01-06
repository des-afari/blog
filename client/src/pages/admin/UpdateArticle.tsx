import { Textarea } from '@/components/ui/textarea'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useTextAreaExpansion from '@/hooks/useTextAreaExpansion'
import { FC, FormEvent, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { TagResponse, TagInterface, SelectedInterface } from './components/Tags'
import axiosError from '@/utils/error'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import axios from '@/utils/api'
import { Input } from '@/components/ui/input'
import ReactQuill from 'react-quill'
import useReactQuillModules from '@/hooks/useReactQuillModules'
import Loader from '@/components/Loader'

const UpdateArticle: FC = () => {
  const location = useLocation()
  const article = location.state && location.state.item
  const id = article.id
  
  const [title, setTitle] = useState<string>(article.title)
  const [description, setDescription] = useState<string>(article.description)
  const [articleImageURL, setArticleImageURL] = useState<string>(article.article_img_url)
  const [content, setContent] = useState<string>(article.content)
  const [selectedTags, setSelectedTags] = useState<SelectedInterface[]>(article.tags)
  const [tags, setTags] = useState<TagInterface[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const titleArea = useRef<HTMLTextAreaElement>(null)
  const descriptionArea = useRef<HTMLTextAreaElement>(null)
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const textAreaExpansion = useTextAreaExpansion()
  const reactQuillModules = useReactQuillModules()

  const formats = [
    "header", "height", "bold", "italic",
    "underline", "strike", "blockquote",
    "list", "color", "bullet", "indent",
    "link", "image", "align", "size",
  ]

  useEffect(() => {
    const get_tags = async () => {
      try {
        const response: TagResponse = await axios.get('/tags')
        setTags(response?.data?.filter(value => value.parent_id !== null))
        
      } catch (error) {
        axiosError(error as Error)

      }
    } 

    get_tags()

  }, [])

  const handleClick = (item: SelectedInterface) => {
    selectedTags.some(tag => tag.id === item.id) ? 
    setSelectedTags(prevTags => prevTags.filter(tag => tag.id !== item.id)) :
    setSelectedTags(prevTags => [...prevTags, item])
  }


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const tagIds = selectedTags.map(item => item.id)

      const data = {
        "title": title,
        "article_img_url": articleImageURL,
        "description": description,
        "content": content,
        "tags": tagIds
      }

      await axiosPrivate.put(`/article/${id}/update`, data)
      navigate(-1)

    } catch (error) {
      axiosError(error as Error)

    } finally {
      setIsLoading(false)

    }
  }
  
  return (
    <div>
      {
      isLoading ?
        <Loader /> :
        <form action='#' method='POST' onSubmit={handleSubmit} className='p-6 mb-20 max-w-3xl mx-auto space-y-4'>
          <div>
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
            Update Article
          </Button>
        </form>
      }
    </div>
  )
}

export default UpdateArticle