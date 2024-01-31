import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '@/utils/api'
import axiosError from '@/utils/error'
import {ChatBubbleIcon } from '@radix-ui/react-icons'
import { formatDate } from '@/utils/config'
import { Badge } from '@/components/ui/badge'
import 'quill/dist/quill.core.css'
import Footer from '@/components/Footer'
import { ArticleResponse, ArticleInterface } from '@/components/Interfaces'
import Votes from './components/Votes'
import Comments from './components/Comments'
import { Helmet } from 'react-helmet-async'
import Loader from '@/components/Loader'


const ArticleView: FC = () => {
  const [article, setArticle] = useState<ArticleInterface>()
  const [voteCheck, setVoteCheck] = useState<boolean>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const navigate = useNavigate()
  const { articleId } = useParams()
  const userId = localStorage.getItem('id')
  
  useEffect(() => {    
    const get_article = async () => {
      setIsLoading(true)

      try {
        const response: ArticleResponse = await axios.get(`/article/${articleId}`)

        response?.data.comments.reverse()
        setArticle(response?.data)

        setVoteCheck(response?.data?.votes?.some(
          vote => vote.article_id === articleId && vote.user_id === userId
        ))

      } catch (error) {
        axiosError(error as Error)

      } finally {
        setIsLoading(false)
      }
    }

    get_article()
  }, [])
  

  return (
    <main>
      {
        isLoading ? <Loader height='100vh' styles='absolute top-0 z-100 w-screen' /> :
        <>
          {
            article &&
            <>
            <article className='sm:max-w-3xl mx-auto grid gap-y-3 p-4 sm:p-6 pt-10'>
            <Helmet>
              <title> {article.title} </title>
              <meta name='description' content={article.description} />
              {/* Open Graph Meta Tags (for social media sharing) */}
              <meta property="og:title" content={article.title} />
              <meta property="og:description" content={article.description} />
              <meta property="og:image" content={article.article_img_url} />
              <meta property="og:url" content={`https://blog.desmondafari.com/article/${article.id}`} />
              <meta property="og:type" content="article" />
              {/* End Open Graph Meta Tags */}
              { /* Twitter tags */ }
              <meta name="twitter:creator" content="Desmond Afari" />
              <meta name="twitter:card" content="article" />
              <meta name="twitter:title" content={article.title} />
              <meta name="twitter:description" content={article.description} />
              <meta property="twitter:image" content={article.article_img_url} />
              { /* End Twitter tags */ }
            </Helmet>
              <div className='flex items-center flex-wrap gap-2'>
              {
                article.tags.map(item => (
                  <Badge 
                    key={item.id}
                    variant={'outline'}
                    onClick={() => navigate(`/tag/${item.id}`)}
                    className='cursor-pointer'
                    > 
                      {item.name} 
                    </Badge>
                ))
              }
              </div>
              <h1 className='text-3xl md:text-5xl font-extrabold'> {article.title} </h1>
              <p className='text-lg md:text-xl'> {article.description} </p>
              <div className='flex items-center gap-x-5'>
                <Votes 
                  article={article}
                  setArticle={setArticle}
                  articleId={articleId}
                  voteCheck={voteCheck}
                  setVoteCheck={setVoteCheck}
                />
                <div onClick={() => document.getElementById('comments')?.scrollIntoView()} className='flex items-center gap-x-1 cursor-pointer'>
                  <ChatBubbleIcon width={18} height={18} />
                  {article.comments.length}
                </div>
              </div>
              <p className='text-sm text-muted-foreground'>
                {formatDate(article.created_at)}
              </p>
              <img src={article.article_img_url} className='w-full' alt="article_image" />
              <div className='content mt-4 mb-20'> <div dangerouslySetInnerHTML={{__html: article.content}} /> </div>
              <Comments 
                article={article}
                setArticle={setArticle}
              />
            </article>
            <Footer />
          </>
          }
        </>
      }
    </main>
  )
}

export default ArticleView