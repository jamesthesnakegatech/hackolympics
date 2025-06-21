'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge, Edit, LogOut, Home, Users, MapPin, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  title?: string
  subtitle?: string
}

export function Navigation({ title, subtitle }: NavigationProps) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/founders', label: 'Founders', icon: Users },
    { href: '/projects', label: 'Projects', icon: Badge },
    { href: '/houses', label: 'Houses', icon: Home },
    { href: '/external-badges', label: 'Badges', icon: Badge },
  ]

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                SF Hacker Houses ✨
              </h1>
            </Link>
          </div>

          {/* Navigation Items - Hidden on mobile, shown on larger screens */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                    }
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <Link href="/badges/create" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-700">
                <Badge className="w-4 h-4 mr-1" />
                <span className="hidden lg:inline">Create Badge</span>
                <span className="lg:hidden">Create</span>
              </Button>
            </Link>
            <Link href="/profile" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-purple-600">
                <Edit className="w-4 h-4 mr-1" />
                <span className="hidden lg:inline">Profile</span>
              </Button>
            </Link>
            <div className="hidden md:block text-sm text-gray-600 max-w-32 truncate">
              {session?.user?.name || session?.user?.email}
            </div>
            <Button
              onClick={() => signOut()}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-red-600 border-gray-300"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Shown only on small screens */}
        <div className="md:hidden pb-3">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white whitespace-nowrap"
                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50 whitespace-nowrap"
                    }
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Page Title Section */}
        {(title || subtitle) && (
          <div className="pb-4">
            {title && (
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        )}
      </div>
    </header>
  )
} 