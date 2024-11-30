import { type Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { AppShell } from '@/components/AppShell'
import { UserProvider } from '@/contexts/UserContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AlgoShark',
  description: 'Decentralized Investment Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <UserProvider>
            <AppShell>{children}</AppShell>
          </UserProvider>
        </Providers>
      </body>
    </html>
  )
} 