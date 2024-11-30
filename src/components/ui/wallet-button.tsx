'use client'

import { useState } from 'react'
import { Wallet } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'

export function WalletButton() {
  const { isConnected, walletAddress, connect, disconnect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      if (isConnected) {
        await disconnect();
      } else {
        await connect();
      }
    } catch (error) {
      console.error('Wallet operation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = isLoading 
    ? 'Loading...' 
    : isConnected 
      ? (walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connected')
      : 'Connect Wallet';

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="flex-shrink-0 bg-white shadow min-h-[44px] min-w-[44px] px-4 flex items-center justify-center rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
      aria-busy={isLoading}
      aria-live="polite"
    >
      <Wallet className="w-5 h-5 mr-2" aria-hidden="true" />
      {isLoading ? (
        <span role="status" className="flex items-center">
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        <span>{buttonText}</span>
      )}
    </button>
  )
} 