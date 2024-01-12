import { FC, useEffect, useState } from 'react'
import axios from '@/utils/api'
import { TagsResponse, TagsInterface } from '@/components/Interfaces'
import axiosError from '@/utils/error'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'


const Index: FC = () => {
  const [tags, setTags] = useState<TagsInterface[]>()

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

    const storedTags = sessionStorage.getItem('tags')
    storedTags ? setTags(JSON.parse(storedTags)) : get_tags()
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
      <main className='p-6'>

      </main>
    </div>
  )
}

export default Index