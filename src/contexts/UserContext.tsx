'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name?: string
  email?: string
  walletAddress?: string
  onboardingComplete?: boolean
  displayName?: string
  investmentStyle?: string
  riskTolerance?: string
}

interface UserContextType {
  user: User | null
  updateUser: (data: Partial<User>) => Promise<void>
  isLoading: boolean
  error: string | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch('/api/user')
        if (response.ok) {
          const data = await response.json()
          setUser(data)
        }
      } catch (err) {
        console.error('Error loading user:', err)
        setError('Failed to load user data')
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const updateUser = async (data: Partial<User>) => {
    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
    } catch (err) {
      console.error('Error updating user:', err)
      throw err
    }
  }

  return (
    <UserContext.Provider value={{ user, updateUser, isLoading, error }}>
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