import { FC } from 'react'
import Image from '@/assets/svg/404.svg'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const NotFound: FC = () => {
  return (
    <main className='h-screen flex flex-col items-center justify-center gap-y-6'>
      <img src={Image} alt="error image" />
      <h1 className='text-4xl md:text-5xl font-extrabold text-center'>Something is wrong</h1>
      <p className='text-center'>The page you are looking for was moved, removed, renamed or doesn't exist!</p>
      <Link to='/' className={cn(
        buttonVariants({}), "flex items-center gap-x-2")}>
        <span className='bg-white text-black h-6 w-6 rounded-full flex items-center justify-center' >
          <ArrowLeftIcon width={14} height={14} />
        </span>
        <span className='text-sm'>Return to homepage</span>
      </Link>
    </main>
  )
}

export default NotFound