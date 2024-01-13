import { FC, useEffect, useState } from 'react'
import axios from '@/utils/api'
import { TagsResponse, TagsInterface, ArticlesResponse, ArticlesInterface } from '@/components/Interfaces'
import axiosError from '@/utils/error'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import Footer from '@/components/Footer'
import { formatDate } from '@/utils/config'
import { Badge } from '@/components/ui/badge'


const Index: FC = () => {
  const [tags, setTags] = useState<TagsInterface[]>()
  const [articles, setArticles] = useState<ArticlesInterface[]>()
  const [featuredArticle, setFeaturedArticle] = useState<ArticlesInterface>()

  const navigate = useNavigate()

  useEffect(() => {
    const get_tags = async () => {
      try {
        const response: TagsResponse = await axios.get('/tags')

        const items = response?.data?.filter(tag => tag.parent_id !== null)
        setTags(items)
        sessionStorage.setItem('tags', JSON.stringify(items))

      } catch (error) {
        axiosError(error as Error)
      }
    }

    const get_articles = async () => {
      try {
        const response: ArticlesResponse = await axios.get('/articles')
        const articles = response?.data?.filter(article => article.featured === false)
        const featuredArticle = response?.data?.find(article => article.featured === true)

        setArticles(articles)
        setFeaturedArticle(featuredArticle)

        sessionStorage.setItem('articles', JSON.stringify(articles))
        sessionStorage.setItem('featuredArticle', JSON.stringify(featuredArticle))

      } catch (error) {
        axiosError(error as Error)
      }
    }

    const storedTags = sessionStorage.getItem('tags')
    const storedArticles = sessionStorage.getItem('articles')
    const storedFeaturedArticle = sessionStorage.getItem('featuredArticle')

    storedTags ? setTags(JSON.parse(storedTags)) : get_tags()
    storedArticles ? setArticles(JSON.parse(storedArticles)) : get_articles()
    storedFeaturedArticle ? setFeaturedArticle(JSON.parse(storedFeaturedArticle)) : get_articles()
  }, [])

  return (
    <div>
      <section className='customScroll overflow-y-auto px-6 flex items-center lg:justify-center gap-x-3 h-11 bg-gray-100 border-b'>
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
          featuredArticle && (
          <div className='articleContainer space-y-3 mb-12 cursor-pointer' onClick={() => navigate(`/article/${featuredArticle.id}`)}>
            <h1 className='articleTitle text-2xl md:text-3xl lg:text-5xl leading-7 md:leading-8 font-extrabold'> {featuredArticle.title} </h1>
            <img src={featuredArticle.article_img_url} alt="featured_image" className='articleImage' />
            <div className='articleTags flex items-center flex-wrap gap-2'>
              {
                featuredArticle.tags.map(item => (
                  <Badge key={item.id} variant={'outline'}> 
                    {item.name} 
                  </Badge>
                ))
              }
            </div>
            <p className='articleDescription text-sm md:text-base'> {featuredArticle.description} </p>
            <p className='articleDate text-muted-foreground text-sm'> {formatDate(featuredArticle.created_at)}</p>
          </div>
          )
        }
        {
          articles &&
          <div className='grid gap-y-12 md:grid-cols-2 md:gap-6 lg:grid-cols-3 mb-12'>
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
                  <h1 className='text-2xl leading-7 font-extrabold'> {article.title} </h1>
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
  )
}

export default Index