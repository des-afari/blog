import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import { FC } from 'react'
import { VoteComponentInterface, VoteResponse } from '@/components/Interfaces'
import axiosError from '@/utils/error'
import { useNavigate } from 'react-router-dom'


const Votes: FC<VoteComponentInterface> = ({ article, setArticle, articleId, voteCheck, setVoteCheck }) => {
  const SI = localStorage.getItem('SI')
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  
  const handleVote = async () => {
    if (SI) {
      try {
        const response: VoteResponse = await axiosPrivate.get(`/vote/${articleId}`)
        
        const state: string = response?.data?.state
        
        const vote = {
          "article_id": response?.data?.article_id,
          "user_id": response?.data?.user_id
        }

        if (state === 'add') {
          setVoteCheck(true)
          setArticle(prevArticle => {
            if (prevArticle) {
              return {
                ...prevArticle,
                votes: [...prevArticle.votes, vote]
              }
            }
          })
        } else if (state === 'remove') {
          setVoteCheck(false)
          setArticle(prevArticle => {
            if (prevArticle) {
              const updatedVotes = prevArticle.votes.filter(votes => {
                return votes.user_id !== vote.user_id
              })

              return {
                ...prevArticle,
                votes: updatedVotes
              }
            }
          })
        }

      } catch (error) {
        axiosError(error as Error)
      }
    } else {
      navigate('/register')
    }
  }

  return (
    <div onClick={handleVote} className='flex items-center gap-x-1 cursor-pointer'>
      {
        voteCheck ?
        <HeartFilledIcon width={18} height={18} /> : 
        <HeartIcon width={18} height={18} />
      }
      {article.votes.length}
    </div>
  )
}

export default Votes