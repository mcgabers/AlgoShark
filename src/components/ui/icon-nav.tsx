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
  type LucideIcon
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Discover', href: '/discover', icon: Search },
  { name: 'Submit Project', href: '/submit', icon: PlusCircle },
  { name: 'Portfolio', href: '/portfolio', icon: BarChart2 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

function NavIcon({
  icon: Icon,
  active = false,
}: {
  icon: LucideIcon
  active?: boolean
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
    />
  )
}

export function IconNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-1 flex-col gap-y-4 pt-4">
      {navigation.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'group flex items-center justify-center p-2',
              active
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            )}
          >
            <span className="sr-only">{item.name}</span>
            <NavIcon icon={item.icon} active={active} />
          </Link>
        )
      })}
    </nav>
  )
} 