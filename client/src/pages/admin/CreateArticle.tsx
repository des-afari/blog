import { FC, useRef, useState } from 'react'
import 'quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'
import useTextAreaExpansion from '@/hooks/useTextareaExpansion'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'


const CreateArticle: FC = () => {
  const [title, setTitle] = useState<string>('')
  const [articleImageURL, setArticleImageURL] = useState<string>('')
  const [content, setContent] = useState<string>('')

  const titleArea = useRef<HTMLTextAreaElement>(null)
  const textAreaExpansion = useTextAreaExpansion()

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

  return (
    <div className='p-6 max-w-3xl mx-auto space-y-4'>
      <div>
        <textarea
          ref={titleArea}
          value={title}
          onChange={e => textAreaExpansion(e, titleArea, setTitle)}
          placeholder='Title'
          className='border-none text-5xl placeholder:text-muted-foreground w-full font-medium focus:outline-none resize-none'
        />
      </div>
      <div>
        <Label className='text-sm font-bold text-muted-foreground'>Article image url</Label>
        <Input 
          value={articleImageURL}
          onChange={e => setArticleImageURL(e.target.value)}
          placeholder="Insert the url for the article's image"
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
    </div>
  )
}

export default CreateArticle