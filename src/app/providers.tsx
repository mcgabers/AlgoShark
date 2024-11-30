'use client'

import { WalletProvider } from '@/contexts/WalletContext'
import { ErrorBoundary } from '@/components/error-boundary'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <WalletProvider>
        {children}
      </WalletProvider>
    </ErrorBoundary>
  )
} 