import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ChatBubbleIcon, HeartIcon, ScissorsIcon } from '@radix-ui/react-icons'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Link } from 'react-router-dom'
import axios, { axiosPrivate } from '@/utils/api'
import axiosError from '@/utils/error'


interface ArticlesResponse {
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
  }[]
}

interface ArticlesInterface {
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
}[]

const Articles: FC = () => {
  const [articles, setArticles] = useState<ArticlesInterface[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [query, setQuery] = useState<string>('')
  const [selected, setSelected] = useState<ArticlesInterface | null>(null)
  const [articlesRefresh, setArticlesRefresh] = useState<boolean>(false)
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout>()
  const typingTimeout = 1300

  useEffect(() => {
    const get_articles = async () => {
      setIsLoading(true)

      try {
        const response: ArticlesResponse = await axios.get('/articles')
        setArticles(response?.data)

      } catch (error) {
        axiosError(error as Error)

      } finally {
        setIsLoading(false)

      }
    }

    get_articles()

  }, [articlesRefresh])

  const handleSubmit = async () => {
    setIsLoading(true)

		try {
			const response: ArticlesResponse = await axios.get(`/articles?query=${query}`)
			setArticles(response?.data)

		} catch (error) {
			axiosError(error as Error)

		} finally {
      setIsLoading(false)

    }
	}

	const  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		clearTimeout(typingTimer)
		setQuery(e.target.value)

		const timer = setTimeout(handleSubmit, typingTimeout)
		setTypingTimer(timer)
	}

	useEffect(() => {
		return () => {
			clearTimeout(typingTimer)
		}
	}, [typingTimer])

  const handleDeleteTag = async () => {
    setIsLoading(true)

    try {
      await axiosPrivate.delete(`/article/${selected?.id}/delete`)

      setArticlesRefresh(!articlesRefresh)

    } catch (error) {
      axiosError(error as Error)

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section style={{height: "calc(100vh - 9rem)"}} className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='w-[450px]'>
          <small className='col-span-4 text-muted-foreground'>Provide an article title to filter the list</small>
          <Input className='col-span-3' placeholder='Filter articles' value={query} onChange={handleChange}></Input>
        </div>
        <div>
          <Link to='/article/create' className={buttonVariants({"variant": "default"})}>Create new article</Link>
        </div>
      </div>
      {
        isLoading ?
        <div className='h-[420px] flex items-center justify-center'>
          <svg className='animate-spin' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        </div> :
        <AlertDialog>
        <div className='h-[420px] customScroll grid grid-cols-4 gap-4 overflow-y-auto'>
          {
            articles?.map(item => (
              <Card key={item.id} className='h-[360px]'>
                <CardContent className='p-0 space-y-3'>
                  <div>
                    <img src={item.article_img_url} alt="article_image" />
                  </div>
                  <div className='px-2 flex flex-wrap gap-2'>
                    {
                      item.tags.map(tag => (
                        <Badge key={tag.id} className='text-[.6rem]' variant={'secondary'}> {tag.name} </Badge>
                      ))
                    }
                  </div>
                  <h2 className='px-1 text-lg font-extrabold leading-tight text-center'>  {item.title} </h2>
                  <div className='px-2 flex items-center justify-between self-end'>
                    <div className='flex gap-x-3'>
                      <div className='flex items-center gap-x-1'>
                        <ChatBubbleIcon />
                        <p className='text-sm'> {item.comments.length} </p>
                      </div>
                      <div className='flex items-center gap-x-1'>
                        <HeartIcon />
                        <p className='text-sm'> {item.votes.length} </p>
                      </div>
                    </div>
                    <div>
                      <AlertDialogTrigger asChild>
                        <Button title='delete' onClick={() => setSelected(item)} className='rounded-full' variant={'secondary'} size={'icon'}>
                          <ScissorsIcon />
                        </Button>
                      </AlertDialogTrigger>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          }
        </div>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the article.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTag}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
      }
    </section>
  )
}

export default Articles