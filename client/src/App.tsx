import Layout from './Layout'
import { Routes, Route } from 'react-router-dom'
import PersistLogin from './components/PersistLogin'
import RequireAuth from './components/RequireAuth'
import Index from './pages/public/Index'
import Privacy from './pages/public/Privacy'
import Terms from './pages/public/Terms'
import NotFound from './pages/public/NotFound'
import Unauthorized from './pages/public/Unauthorized'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/admin/Dashboard'
import PublicLayout from './pages/public/Layout'
import AuthLayout from './pages/auth/Layout'
import AdminLayout from './pages/admin/Layout'
import CreateArticle from './pages/admin/CreateArticle'


const ROLES = {
	"ADMIN": "admin",
	"USER": "user"
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* public routes */}
        <Route element={<PublicLayout />}>
          <Route path='/' element={<Index />} />
        </Route>
        
        {/* auth routes */}
        <Route element={<AuthLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>

        <Route element={<PersistLogin />}>

          {/* admin routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
            <Route element={<AdminLayout />}>
              <Route path='/dashboard' element={<Dashboard />} />
            </Route>
            <Route path='/article/create' element={<CreateArticle />} />
          </Route>

        </Route>

        <Route path='/terms' element={<Terms />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/unathorized' element={<Unauthorized />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
