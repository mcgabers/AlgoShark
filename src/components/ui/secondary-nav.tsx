'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  BarChart2,
  Users,
  Vote,
  History,
  Filter,
  Tag,
  Briefcase,
  Settings as SettingsIcon,
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const discoverNavigation: NavItem[] = [
  { name: 'All Projects', href: '/discover', icon: Filter },
  { name: 'Trending', href: '/discover/trending', icon: BarChart2 },
  { name: 'Categories', href: '/discover/categories', icon: Tag },
]

const portfolioNavigation: NavItem[] = [
  { name: 'Overview', href: '/portfolio', icon: Briefcase },
  { name: 'Investments', href: '/portfolio/investments', icon: BarChart2 },
  { name: 'Projects', href: '/portfolio/projects', icon: History },
]

const governanceNavigation: NavItem[] = [
  { name: 'Active Proposals', href: '/governance', icon: Vote },
  { name: 'My Votes', href: '/governance/votes', icon: History },
  { name: 'Delegates', href: '/governance/delegates', icon: Users },
]

const settingsNavigation: NavItem[] = [
  { name: 'Profile', href: '/settings', icon: SettingsIcon },
  { name: 'Wallet', href: '/settings/wallet', icon: Briefcase },
  { name: 'Notifications', href: '/settings/notifications', icon: BarChart2 },
]

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <div>
      <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h2>
      <nav className="mt-2 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md',
                isActive
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              <Icon
                className={cn(
                  'flex-shrink-0 -ml-1 mr-3 h-6 w-6',
                  isActive
                    ? 'text-gray-500'
                    : 'text-gray-400 group-hover:text-gray-500'
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function SecondaryNav() {
  const pathname = usePathname()
  let navigation: NavItem[] = []
  let title = ''

  if (pathname.startsWith('/discover')) {
    navigation = discoverNavigation
    title = 'Discover'
  } else if (pathname.startsWith('/portfolio')) {
    navigation = portfolioNavigation
    title = 'Portfolio'
  } else if (pathname.startsWith('/governance')) {
    navigation = governanceNavigation
    title = 'Governance'
  } else if (pathname.startsWith('/settings')) {
    navigation = settingsNavigation
    title = 'Settings'
  }

  if (navigation.length === 0) {
    return null
  }

  return (
    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <NavSection title={title} items={navigation} />
    </div>
  )
} 