'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'
import algosdk from 'algosdk'
import { AlgorandService } from '@/services/blockchain/algorand'

interface WalletContextType {
  account: algosdk.Account | null
  accountInfo: any | null
  isConnecting: boolean
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  createProjectToken: (projectName: string, totalSupply: number) => Promise<void>
  investInProject: (projectAssetId: number, amount: number) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<algosdk.Account | null>(null)
  const [accountInfo, setAccountInfo] = useState<any | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // Check for existing wallet connection on mount
  useEffect(() => {
    const savedAccount = localStorage.getItem('algorand_account')
    if (savedAccount) {
      try {
        const accountData = JSON.parse(savedAccount)
        const recoveredAccount = algosdk.mnemonicToSecretKey(accountData.mnemonic)
        setAccount(recoveredAccount)
        setIsConnected(true)
        fetchAccountInfo(recoveredAccount.addr)
      } catch (error) {
        console.error('Error recovering account:', error)
        localStorage.removeItem('algorand_account')
      }
    }
  }, [])

  const fetchAccountInfo = async (address: string) => {
    try {
      const info = await AlgorandService.getAccountInfo(address)
      setAccountInfo(info)
    } catch (error) {
      console.error('Error fetching account info:', error)
    }
  }

  const connect = async () => {
    setIsConnecting(true)
    try {
      // Generate new account for demo purposes
      // In production, this would integrate with MyAlgo, WalletConnect, etc.
      const account = algosdk.generateAccount()
      const mnemonic = algosdk.secretKeyToMnemonic(account.sk)
      
      // Save account locally
      localStorage.setItem('algorand_account', JSON.stringify({ mnemonic }))
      
      setAccount(account)
      setIsConnected(true)
      await fetchAccountInfo(account.addr)
    } catch (error) {
      console.error('Error connecting wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    localStorage.removeItem('algorand_account')
    setAccount(null)
    setAccountInfo(null)
    setIsConnected(false)
  }

  const createProjectToken = async (projectName: string, totalSupply: number) => {
    if (!account) throw new Error('No wallet connected')
    
    try {
      const result = await AlgorandService.createProjectToken(
        account,
        projectName,
        totalSupply
      )
      console.log('Project token created:', result)
      return result
    } catch (error) {
      console.error('Error creating project token:', error)
      throw error
    }
  }

  const investInProject = async (projectAssetId: number, amount: number) => {
    if (!account) throw new Error('No wallet connected')
    
    try {
      const result = await AlgorandService.investInProject(
        account,
        projectAssetId,
        amount
      )
      console.log('Investment successful:', result)
      await fetchAccountInfo(account.addr)
      return result
    } catch (error) {
      console.error('Error investing in project:', error)
      throw error
    }
  }

  return (
    <WalletContext.Provider
      value={{
        account,
        accountInfo,
        isConnecting,
        isConnected,
        connect,
        disconnect,
        createProjectToken,
        investInProject,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
} 