import { FC } from 'react'

const Footer: FC = () => {
    const year = new Date().getFullYear()
  return (
    <footer className='flex items-center justify-center h-16 bg-black text-white'>
        <p className='text-center font-medium'>Desmond Afari &copy; {year} </p>
    </footer>
  )
}

export default Footer