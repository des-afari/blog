import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ChatBubbleIcon, HeartIcon, ScissorsIcon, UpdateIcon } from '@radix-ui/react-icons'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Link, useNavigate } from 'react-router-dom'
import axios, { axiosPrivate } from '@/utils/api'
import axiosError from '@/utils/error'
import { ArticlesInterface, ArticlesResponse } from '@/components/Interfaces'


const Articles: FC = () => {
  const [articles, setArticles] = useState<ArticlesInterface[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [query, setQuery] = useState<string>('')
  const [articleId, setArticleId] = useState<string>()
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout>()
  
  const typingTimeout = 1300
  const navigate = useNavigate()

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

  useEffect(() => {
    get_articles()
  }, [])

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

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      await axiosPrivate.delete(`/article/${articleId}/delete`)
      get_articles()
    
    } catch (error) {
      axiosError(error as Error)

    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = (item: ArticlesInterface) => {
    navigate(`/article/update`, { state: {item}})
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
          <svg className='animate-spin' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        </div> :
        <AlertDialog>
        <div className='h-[420px] customScroll grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto'>
          {
            articles?.map(item => (
              <Card key={item.id} className='pb-1'>
                <CardContent className='p-0 space-y-3'>
                  <img src={item.article_img_url} alt="article_image" />
                  <div className='px-2 flex flex-wrap gap-1'>
                    {
                      item.tags.map(tag => (
                        <Badge key={tag.id} className='text-[.6rem]' variant={'secondary'}> {tag.name} </Badge>
                      ))
                    }
                  </div>
                  <h2 className='px-1 text-lg font-extrabold leading-tight'>  {item.title} </h2>
                  <div className='px-2 flex items-center justify-between self-end'>
                    <div className='flex gap-x-2'>
                      <div className='flex items-center gap-x-1'>
                        <ChatBubbleIcon />
                        <p className='text-sm'> {item.comments.length} </p>
                      </div>
                      <div className='flex items-center gap-x-1'>
                        <HeartIcon />
                        <p className='text-sm'> {item.votes.length} </p>
                      </div>
                    </div>
                    <div className='flex gap-x-2'>
                      <Button title='update' onClick={() => handleUpdate(item)} className='rounded-full' variant={'secondary'} size={'icon'}>
                        <UpdateIcon />
                      </Button>
                      <AlertDialogTrigger asChild>
                        <Button title='delete' onClick={() => setArticleId(item.id)} className='rounded-full' variant={'secondary'} size={'icon'}>
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
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
      }
    </section>
  )
}

export default Articles