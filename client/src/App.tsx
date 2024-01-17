import Layout from './Layout'
import { Routes, Route } from 'react-router-dom'
import PersistLogin from './components/PersistLogin'
import RequireAuth from './components/RequireAuth'
import Index from './pages/public/Index'
import NotFound from './pages/public/NotFound'
import Unauthorized from './pages/public/Unauthorized'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/admin/Dashboard'
import PublicLayout from './pages/public/Layout'
import AuthLayout from './pages/auth/Layout'
import AdminLayout from './pages/admin/Layout'
import CreateArticle from './pages/admin/CreateArticle'
import UpdateArticle from './pages/admin/UpdateArticle'
import TagView from './pages/public/TagView'
import ArticleView from './pages/public/ArticleView'
import Search from './pages/public/Search'


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
          <Route path='/tag/:tagId' element={<TagView />} />
          <Route path='/article/:articleId' element={<ArticleView />} />
          <Route path='/search' element={<Search />} />
        </Route>
        
        
        {/* auth routes */}
        <Route element={<AuthLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>

        {/* admin routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
            <Route element={<AdminLayout />}>
              <Route path='/dashboard' element={<Dashboard />} />
            </Route>
            <Route path='/article/create' element={<CreateArticle />} />
            <Route path='/article/update' element={<UpdateArticle />} />
          </Route>
        </Route>

        <Route path='/unathorized' element={<Unauthorized />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
