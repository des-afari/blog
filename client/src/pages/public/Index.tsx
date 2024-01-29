import { FC, useEffect, useState } from 'react'
import axios from '@/utils/api'
import { TagsResponse, TagsInterface, ArticlesResponse, ArticlesInterface } from '@/components/Interfaces'
import axiosError from '@/utils/error'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import Footer from '@/components/Footer'
import { formatDate } from '@/utils/config'
import { Badge } from '@/components/ui/badge'
import IndexSkeleton from '@/components/skeletons/IndexSkeleton'


const Index: FC = () => {
  const [tags, setTags] = useState<TagsInterface[]>()
  const [articles, setArticles] = useState<ArticlesInterface[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)

    const get_tags = async () => {
      try {
        const response: TagsResponse = await axios.get('/tags')

        const items = response?.data?.filter(tag => tag.parent_id !== null)
        setTags(items)

      } catch (error) {
        axiosError(error as Error)
      }
    }

    const get_articles = async () => {
      try {
        const response: ArticlesResponse = await axios.get('/articles')

        response?.data?.reverse()
        setArticles(response?.data)

      } catch (error) {
        axiosError(error as Error)

      } finally {
        // setIsLoading(false)
      }
    }

    get_tags()
    get_articles()
  }, [])

  return (
    <div>
      {
        isLoading ? <IndexSkeleton /> :
        <div>
          <section className='customScroll overflow-y-auto px-4 md:px-6 flex items-center lg:justify-center gap-x-3 h-11 bg-gray-100 border-b'>
            {
              tags?.map(item => (
                <Button 
                  key={item.id} 
                  variant={"outline"} 
                  size={"sm"}
                  className='hover:bg-white'
                  onClick={() => navigate(`tag/${item.id}`)}
                  >
                  {item.name}
                </Button>
              ))
            }
          </section>
          <main style={{minHeight: "calc(100vh - 2.75rem - 4rem"}} className='p-6'>
            {
              articles &&
              <div className='grid gap-y-12 sm:px-12 md:px-0 md:grid-cols-2 md:gap-6 lg:grid-cols-3 mb-12'>
                {
                  articles?.map(article => (
                    <div key={article.id} className='space-y-3 cursor-pointer' onClick={() => navigate(`/article/${article.id}`)}>
                      <img src={article.article_img_url} alt="article_img" />
                      <div className='flex items-center flex-wrap gap-2'>
                        {
                          article.tags.map(item => (
                            <Badge key={item.id} variant={'outline'}> 
                              {item.name} 
                            </Badge>
                          ))
                        }
                      </div>
                      <h1 className='text-2xl font-extrabold'> {article.title} </h1>
                      <p className='text-sm md:text-base'> {article.description} </p>
                      <p className='text-muted-foreground text-sm'> {formatDate(article.created_at)}</p>  
                    </div>
                  ))
                }
              </div>
            }
          </main>
          <Footer />
        </div>
      }
    </div>
  )
}

export default Index