import { createContext, useState, FC, ReactNode, Dispatch, SetStateAction } from "react"


interface AuthContextProps {
  auth: any
  setAuth: Dispatch<SetStateAction<any>>
}

const AuthContext = createContext<AuthContextProps>({
  auth: {},
  setAuth: () => {},
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState({})

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext