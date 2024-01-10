import { buttonVariants } from '@/components/ui/button'
import { FC } from 'react'
import { Link } from 'react-router-dom'


const UnAuthorizedComments: FC = () => {
  return (
  <div className='pb-12 pt-4 space-y-4 text-center'>
    <h2 className=' text-xl md:text-2xl font-bold'>Give your opinion</h2>
    <p className='leading-5'>Sign in or create an account to start commenting</p>
    <Link to='/register' className={buttonVariants({"variant": "default", "size": "lg"})}>Create an account</Link>
    <div>
      <span className='text-muted-foreground'>Already a member? </span>
      <Link to='/login' className='font-bold'>Sign in</Link>
    </div>
  </div>
  )
}

export default UnAuthorizedComments