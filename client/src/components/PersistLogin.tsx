import { FC, useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useRefreshToken from '@/hooks/useRefreshToken'
import useAuth from '@/hooks/useAuth'
import Loader from './Loader'
import axios from 'axios'
import axiosError from '@/utils/error'

const PersistLogin: FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const { auth } = useAuth()

  useEffect(() => {
    let isMounted = true

    const verifyRefreshToken = async () => {
		try {
      await refresh()
  
		} catch (error) {
        axiosError(error as Error)

		} finally {
		  isMounted && setIsLoading(false)
		}
	  }

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false)

    return () => {
      isMounted = false
    }
  }, [auth, refresh])

  return (
    <div>
      {isLoading ? <Loader /> : <Outlet />}
    </div>
  )
}

export default PersistLogin
