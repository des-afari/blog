import { Outlet } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"


const Layout = () => {
  return (
	  <main>
	  	<Outlet />
      <Toaster />
	  </main>
  )
}

export default Layout