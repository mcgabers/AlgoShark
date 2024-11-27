'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import algosdk from 'algosdk'
import { AlgorandService } from '@/services/blockchain/algorand'

interface WalletContextType {
  account: algosdk.Account | null
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  balance: number | null
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  balance: null,
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<algosdk.Account | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true)
      // For development, generate a test account
      const newAccount = AlgorandService.generateAccount()
      setAccount(newAccount)

      // Get initial balance
      const accountBalance = await AlgorandService.getBalance(newAccount.addr)
      setBalance(accountBalance)
    } catch (error) {
      console.error('Error connecting wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAccount(null)
    setBalance(null)
  }, [])

  // Update balance periodically when connected
  useEffect(() => {
    if (!account) return

    const updateBalance = async () => {
      try {
        const newBalance = await AlgorandService.getBalance(account.addr)
        setBalance(newBalance)
      } catch (error) {
        console.error('Error updating balance:', error)
      }
    }

    const interval = setInterval(updateBalance, 10000) // Update every 10 seconds
    return () => clearInterval(interval)
  }, [account])

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnected: !!account,
        isConnecting,
        connect,
        disconnect,
        balance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
} 