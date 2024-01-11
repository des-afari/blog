import { FC, FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '@/utils/api'
import axiosError from '@/utils/error'
import {ChatBubbleIcon } from '@radix-ui/react-icons'
import { formatDate, formatTitle } from '@/utils/config'
import parser from 'html-react-parser'
import { Badge } from '@/components/ui/badge'
import 'quill/dist/quill.core.css'
import Footer from '@/components/Footer'
import { ArticleResponse, ArticleInterface } from '@/components/Interfaces'
import Votes from './components/Votes'
import Comments from './components/Comments'

const ArticleView: FC = () => {
  const [article, setArticle] = useState<ArticleInterface>()
  const [voteCheck, setVoteCheck] = useState<boolean>()
  
  const navigate = useNavigate()
  const { articleId } = useParams()
  const userId = localStorage.getItem('id')
  
  useEffect(() => {
    const get_article = async () => {
      try {
        const response: ArticleResponse = await axios.get(`/article/${articleId}`)
        setArticle(response?.data)

        setVoteCheck(response?.data?.votes?.some(
          vote => vote.article_id === articleId && vote.user_id === userId
        ))
      } catch (error) {
        axiosError(error as Error)
      }
    }

    get_article()
  }, [])

  const handleTagClick = (e: FormEvent) => {
    const tagId = e.currentTarget.getAttribute('data-id')
    const tagName = e.currentTarget.getAttribute('data-name')
    const tagFormatedName = formatTitle(e.currentTarget.getAttribute('data-name'))

    tagId && tagName && navigate(`/tag/${tagFormatedName}`, {state: {tagId, tagName}})
  }


  return (
    <main>
      {
        article &&
        <div>
          <article className='sm:max-w-3xl mx-auto grid gap-y-3 p-6 pt-10'>
            <div className='flex items-center flex-wrap gap-2'>
            {
              article.tags.map(item => (
                <Badge 
                  key={item.id}
                  variant={'outline'}
                  onClick={handleTagClick}
                  data-id={item.id}
                  data-name={item.name}
                  className='cursor-pointer'
                  > 
                    {item.name} 
                  </Badge>
              ))
            }
            </div>
            <h1 className='text-[32px] leading-[38px] md:text-5xl font-extrabold'> {article.title} </h1>
            <p className='sourceSerif text-xl md:text-[22px] md:leading-7'> {article.description} </p>
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
            <div className='text-muted-foreground'>
              <p className='text-sm'>
                {article.updated_at ? formatDate(article.updated_at) : formatDate(article.created_at)}
              </p>
            </div>
            <img src={article.article_img_url} className='w-full' alt="article_image" />
            <div className='mainArticle'> {parser(article.content)}  </div>
            <Comments 
              article={article}
              setArticle={setArticle}
            />
          </article>
          <Footer />
        </div>
      }
    </main>
  )
}

export default ArticleView