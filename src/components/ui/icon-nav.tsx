'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  Search,
  PlusCircle,
  BarChart2,
  Settings,
  Briefcase,
  Vote,
  type LucideIcon
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Discover', href: '/discover', icon: Search },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Portfolio', href: '/portfolio', icon: BarChart2 },
  { name: 'Governance', href: '/governance', icon: Vote },
  { name: 'Settings', href: '/settings', icon: Settings },
]

function NavIcon({
  icon: Icon,
  active = false,
  name,
}: {
  icon: LucideIcon
  active?: boolean
  name: string
}) {
  return (
    <Icon
      className={cn(
        'h-6 w-6',
        active
          ? 'text-white'
          : 'text-gray-400 group-hover:text-gray-300'
      )}
      aria-hidden="true"
      role="img"
      aria-label={`${name} icon`}
    />
  )
}

export function IconNav() {
  const pathname = usePathname()

  return (
    <nav 
      className="flex flex-1 flex-col gap-y-4 py-6"
      aria-label="Main Navigation"
    >
      {navigation.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'group flex items-center justify-center h-12 w-12 mx-auto rounded-md transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900',
              active
                ? 'bg-gray-800 text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            )}
            aria-label={item.name}
            aria-current={active ? 'page' : undefined}
          >
            <span className="sr-only">{item.name}</span>
            <NavIcon icon={item.icon} active={active} name={item.name} />
          </Link>
        )
      })}
    </nav>
  )
} 