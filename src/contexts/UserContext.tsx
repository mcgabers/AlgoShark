'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { useWallet } from './WalletContext'

interface User {
  id: string
  name: string | null
  email: string | null
  walletAddress: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  error: string | null
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: false,
  error: null,
})

export function UserProvider({ children }: { children: ReactNode }) {
  const { account, isConnected } = useWallet()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isConnected && account) {
      setIsLoading(true)
      // For development, create a mock user when wallet is connected
      setUser({
        id: account.addr,
        name: 'Test User',
        email: null,
        walletAddress: account.addr,
      })
      setIsLoading(false)
    } else {
      setUser(null)
    }
  }, [isConnected, account])

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
} 