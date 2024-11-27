'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { IconNav } from '@/components/ui/icon-nav'
import { SecondaryNav } from '@/components/ui/secondary-nav'
import { WalletButton } from '@/components/ui/wallet-button'

// Pages that don't use secondary navigation
const PAGES_WITHOUT_SECONDARY_NAV = ['/', '/submit', '/projects']

interface AppShellProps {
  children: React.ReactNode
  className?: string
}

export function AppShell({ children, className }: AppShellProps) {
  const pathname = usePathname()
  // Only check exact matches for paths that should hide secondary nav
  const showSecondaryNav = !PAGES_WITHOUT_SECONDARY_NAV.includes(pathname)

  return (
    <div className="h-screen flex flex-col">
      {/* Logo Row */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200">
        <div className="h-12 flex items-center px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-[#004921] p-1.5 rounded">
              <div className="w-4 h-4 border-2 border-white"></div>
            </div>
            <span className="font-['Helvetica'] text-lg font-bold tracking-tight text-gray-900">ALGOSHARK</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar - Column 1 */}
        <div className="flex-shrink-0 w-16 flex flex-col bg-gray-900">
          <IconNav />
        </div>

        {/* Secondary Column - Column 2 */}
        {showSecondaryNav && (
          <div className="flex-shrink-0 w-64 flex flex-col bg-gray-100 overflow-y-auto">
            <SecondaryNav />
          </div>
        )}

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
          <div className={cn("flex-1 overflow-y-auto", className)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 