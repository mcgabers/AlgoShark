'use client'

import { useState } from 'react'
import { Wallet } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { formatAddress } from '@/lib/utils'

export function WalletButton() {
  const { isConnected, isConnecting, account, connect, disconnect } = useWallet()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleClick = () => {
    if (isConnected) {
      setIsDropdownOpen(!isDropdownOpen)
    } else {
      connect()
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isConnecting}
        className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isConnected
            ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            : 'border-transparent bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <Wallet
          className={`-ml-1 mr-2 h-5 w-5 ${
            isConnected ? 'text-gray-400' : 'text-white'
          }`}
          aria-hidden="true"
        />
        {isConnecting ? (
          'Connecting...'
        ) : isConnected ? (
          formatAddress(account?.addr || '')
        ) : (
          'Connect Wallet'
        )}
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && isConnected && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="wallet-menu"
          >
            <button
              onClick={() => {
                navigator.clipboard.writeText(account?.addr || '')
                setIsDropdownOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Copy Address
            </button>
            <button
              onClick={() => {
                disconnect()
                setIsDropdownOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
              role="menuitem"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 