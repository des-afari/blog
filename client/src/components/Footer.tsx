import { FC } from 'react'

const Footer: FC = () => {
    const year = new Date().getFullYear()
  return (
    <footer className='bg-black border-t h-40 px-6 flex items-center flex-col md:flex-row md:items-start md:justify-between'> 
        <p className='mt-6 text-sm font-medium text-muted-foreground'><span className='text-white'>Desmond Afari</span> &copy; {year} </p>
        <p className='md:mt-6 text-muted-foreground text-sm'>afaridesmond@gmail.com</p>
    </footer>
  )
}

export default Footer