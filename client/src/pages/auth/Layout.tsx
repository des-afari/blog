import { Outlet } from 'react-router-dom'


const Layout = () => {
  return (
	  <main>
        <header></header>
	  	<Outlet />
	  </main>
  )
}

export default Layout