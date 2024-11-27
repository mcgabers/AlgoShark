'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'
import { useWallet } from './WalletContext'

interface User {
  id: string
  email: string
  name?: string
  walletAddress: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { account, isConnected } = useWallet()

  // Check for existing user when wallet is connected
  useEffect(() => {
    if (isConnected && account) {
      fetchUser(account.addr)
    } else {
      setUser(null)
    }
  }, [isConnected, account])

  const fetchUser = async (walletAddress: string) => {
    try {
      const response = await fetch(`/api/users?walletAddress=${walletAddress}`)
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const login = async (email: string) => {
    if (!account) {
      throw new Error('Wallet not connected')
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          walletAddress: account.addr,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'Failed to login')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in')
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
    } catch (error) {
      console.error('Update profile error:', error)
      setError(error instanceof Error ? error.message : 'Failed to update profile')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 