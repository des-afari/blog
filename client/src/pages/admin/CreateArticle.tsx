import { FC, useRef, useState, useEffect, FormEvent } from 'react'
import 'quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'
import useTextAreaExpansion from '@/hooks/useTextAreaExpansion'
import { Input } from '@/components/ui/input'
import { TagResponse, TagInterface, SelectedInterface } from './components/Tags'
import axios from '@/utils/api'
import axiosError from '@/utils/error'
import { Button, buttonVariants } from '@/components/ui/button'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useNavigate } from 'react-router-dom'
import Loader from '@/components/Loader'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'


const CreateArticle: FC = () => {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [articleImageURL, setArticleImageURL] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<SelectedInterface[]>([])
  const [tags, setTags] = useState<TagInterface[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const titleArea = useRef<HTMLTextAreaElement>(null)
  const descriptionArea = useRef<HTMLTextAreaElement>(null)
  const textAreaExpansion = useTextAreaExpansion()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()

  const modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ 'script': 'super' }, { 'script': 'sub' }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        { align: [] }
      ],
      [{ "color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color'] }],
    ]
  }

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
            modules={modules}
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