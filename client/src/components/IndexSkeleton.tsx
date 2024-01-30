import { FC } from 'react'
import { Skeleton } from './ui/skeleton'

const IndexSkeleton: FC = () => {
  return (
    <div>
      <section className='customScroll overflow-y-auto px-4 md:px-6 flex items-center lg:justify-center gap-x-3 h-11 border-b'>
        <Skeleton className='h-8 w-20 rounded-md px-3 text-xs'></Skeleton>
        <Skeleton className='h-8 w-20 rounded-md px-3 text-xs'></Skeleton>
        <Skeleton className='h-8 w-20 rounded-md px-3 text-xs'></Skeleton>
        <Skeleton className='h-8 w-20 rounded-md px-3 text-xs'></Skeleton>
      </section>
    </div>
  )
}

export default IndexSkeleton