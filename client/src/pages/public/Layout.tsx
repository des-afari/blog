import { Link, Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'


const Layout = () => {
  return (
	  <main className='min-h-screen'>
        <header className='h-16 px-6 flex items-center justify-between'>
          <div>
            <a href="/">
              <p className='font-bold text-2xl'>
                craft
                <span className='text-red-600'>.</span>
              </p>
            </a>
          </div>
          <div>
            <Button variant={'ghost'} className='lg:hidden'>
              <Menu />
            </Button>
            <div className='hidden lg:flex lg:gap-x-2'>
              <Link to='/login' className={cn(
                buttonVariants({"variant": "secondary", "size": "md"}), "font-semibold")}>Log in</Link>
              <Link to='/register' className={cn(
                buttonVariants({"variant": "default", "size": "md"}), "font-semibold")}>Register</Link>
            </div>
          </div>
        </header>
        <div className='h-12 bg-gray-100'></div>
	  	<Outlet />
	  </main>
  )
}

export default Layout