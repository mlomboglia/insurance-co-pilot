'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, Users, ClipboardList, Home } from 'lucide-react'
import { clsx } from 'clsx'

const navigationItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/customer', label: 'Customer', icon: Car },
  { href: '/agent', label: 'Agent Dashboard', icon: Users },
  { href: '/status', label: 'Claim Status', icon: ClipboardList },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">
              Insurance Co-Pilot
            </span>
          </Link>

          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}