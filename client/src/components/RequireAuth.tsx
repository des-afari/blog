import { FC } from 'react'
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'

interface RequireAuthProps {
  allowedRoles: string[]
}


const RequireAuth: FC<RequireAuthProps> = ({ allowedRoles }) => {
	const { auth } = useAuth()
	const location = useLocation()


	return (
		allowedRoles.includes(auth?.role) ? <Outlet /> :
		auth?.accessToken ? <Navigate to="/unauthorized" state={{ from: location }} replace />
		: <Navigate to='/login' state={{ from: location }} replace />
	)
}

export default RequireAuth