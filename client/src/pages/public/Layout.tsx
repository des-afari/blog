import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'


const Layout = () => {

  return (
	  <main className='min-h-screen'>
      <Header />
	  	<Outlet />
	  </main>
  )
}

export default Layout