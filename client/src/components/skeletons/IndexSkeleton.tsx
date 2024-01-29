import { FC } from 'react'
import { Skeleton } from '../ui/skeleton'

const IndexSkeleton: FC = () => {
  return (
    <div>
      <section className='customScroll overflow-y-auto px-4 md:px-6 flex items-center lg:justify-center gap-x-3 h-11 bg-gray-100 border-b'>
        <Skeleton className='h-8 w-24 rounded-md px-3 text-xs'></Skeleton>
        <Skeleton className='h-8 w-24 rounded-md px-3 text-xs'></Skeleton>
        <Skeleton className='h-8 w-24 rounded-md px-3 text-xs'></Skeleton>
        <Skeleton className='h-8 w-24 rounded-md px-3 text-xs'></Skeleton>
      </section>
      <main style={{minHeight: "calc(100vh - 2.75rem - 4rem"}} className='p-6'>
        <div className='grid gap-y-12 sm:px-12 md:px-0 md:grid-cols-2 md:gap-6 lg:grid-cols-3 mb-12'>
          <div className='space-y-3'>
            <Skeleton className='h-[218px] sm:h-[330px] md:h-[232px] lg:h-[206px] xl:h-[298px]'></Skeleton>
            <div className='flex items-center flex-wrap gap-2'>
              <Skeleton className='h-[22px] w-[67px]'></Skeleton>
              <Skeleton className='h-[22px] w-[67px]'></Skeleton>
            </div>
            <Skeleton className='h-[44px]'></Skeleton>
            <Skeleton className='h-[100px] lg:h-[80px]'></Skeleton>
          </div>
          <div className='space-y-3'>
            <Skeleton className='h-[218px] sm:h-[330px] md:h-[232px] lg:h-[206px] xl:h-[298px]'></Skeleton>
            <div className='flex items-center flex-wrap gap-2'>
              <Skeleton className='h-[22px] w-[67px]'></Skeleton>
              <Skeleton className='h-[22px] w-[67px]'></Skeleton>
            </div>
            <Skeleton className='h-[44px]'></Skeleton>
            <Skeleton className='h-[100px] lg:h-[80px]'></Skeleton>
          </div>
          <div className='space-y-3'>
            <Skeleton className='h-[218px] sm:h-[330px] md:h-[232px] lg:h-[206px] xl:h-[298px]'></Skeleton>
            <div className='flex items-center flex-wrap gap-2'>
              <Skeleton className='h-[22px] w-[67px]'></Skeleton>
              <Skeleton className='h-[22px] w-[67px]'></Skeleton>
            </div>
            <Skeleton className='h-[44px]'></Skeleton>
            <Skeleton className='h-[100px] lg:h-[80px]'></Skeleton>
          </div>
          <div className='space-y-3'>
            <Skeleton className='h-[218px] sm:h-[330px] md:h-[232px] lg:h-[206px] xl:h-[298px]'></Skeleton>
            <div className='flex items-center flex-wrap gap-2'>
              <Skeleton className='h-[22px] w-[67px]'></Skeleton>
              <Skeleton className='h-[22px] w-[67px]'></Skeleton>
            </div>
            <Skeleton className='h-[44px]'></Skeleton>
            <Skeleton className='h-[100px] lg:h-[80px]'></Skeleton>
          </div>
          
        </div>
      </main>
    </div>
  )
}

export default IndexSkeleton