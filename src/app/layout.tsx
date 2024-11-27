import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { IconNav } from '@/components/ui/icon-nav'
import { SecondaryNav } from '@/components/ui/secondary-nav'
import { WalletProvider } from '@/contexts/WalletContext'
import { UserProvider } from '@/contexts/UserContext'
import { WalletButton } from '@/components/ui/wallet-button'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AlgoShark - AI-Native Business Funding Platform',
  description: 'A decentralized platform for funding and managing AI-generated software businesses on Algorand',
}

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
            <div className="h-screen flex flex-col">
              <div className="flex-1 flex overflow-hidden">
                {/* Navigation Sidebar - Column 1 */}
                <div className="flex-shrink-0 w-16 flex flex-col bg-gray-900">
                  <IconNav />
                </div>

                {/* Secondary Column - Column 2 */}
                <div className="flex-shrink-0 w-64 flex flex-col bg-gray-100 overflow-y-auto">
                  <SecondaryNav />
                </div>

                {/* Main Content - Column 3 */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Top Bar */}
                  <div className="flex-shrink-0 bg-white shadow">
                    <div className="flex h-16 justify-end px-4">
                      <div className="flex items-center">
                        <WalletButton />
                      </div>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 overflow-y-auto">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </UserProvider>
        </WalletProvider>
      </body>
    </html>
  )
} 