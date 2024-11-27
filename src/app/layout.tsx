'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { AppShell } from '@/components/AppShell'
import { WalletProvider } from '@/contexts/WalletContext'
import { UserProvider } from '@/contexts/UserContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={cn(inter.className, "h-full bg-gray-50")}>
        <WalletProvider>
          <UserProvider>
            <AppShell>
              {children}
            </AppShell>
          </UserProvider>
        </WalletProvider>
      </body>
    </html>
  )
} 