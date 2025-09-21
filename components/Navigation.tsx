'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, Users, Home, Shield, MessageSquare } from 'lucide-react'
import { clsx } from 'clsx'

const navigationItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/customer', label: 'Customer', icon: Car },
  { href: '/agent', label: 'Agent Dashboard', icon: Users },
  { href: '/notifications', label: 'SMS Notifications', icon: MessageSquare },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-xl shadow-slate-200/20 border-b border-white/20 fixed top-0 left-0 right-0 z-50 slide-in-left">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold gradient-text tracking-tight">
                Insurance Co-Pilot
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-wider uppercase">
                AI-Powered Claims
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'nav-link group relative',
                    isActive ? 'nav-link-active' : 'nav-link-inactive'
                  )}
                >
                  {/* Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>

                  <div className="relative flex items-center space-x-2.5">
                    <Icon className={clsx(
                      'h-4 w-4 transition-transform duration-200',
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    )} />
                    <span className="font-semibold tracking-wide text-sm">
                      {item.label}
                    </span>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="nav-link nav-link-inactive p-2">
              <div className="space-y-1">
                <div className="w-5 h-0.5 bg-slate-600"></div>
                <div className="w-5 h-0.5 bg-slate-600"></div>
                <div className="w-5 h-0.5 bg-slate-600"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="grid grid-cols-2 gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex flex-col items-center space-y-1 py-3 px-2 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-semibold">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}