import { FC } from 'react'

const Footer: FC = () => {
    const year = new Date().getFullYear()
  return (
    <footer className='bg-black border-t h-40 px-6'>
        <p className='mt-6 text-sm font-medium text-muted-foreground'><span className='text-white'>Desmond Afari</span> &copy; {year} </p>
    </footer>
  )
}

export default Footer