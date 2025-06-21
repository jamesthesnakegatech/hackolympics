'use client'

import { Navigation } from './navigation'
import { ReactNode } from 'react'

interface PageLayoutProps {
  title?: string
  subtitle?: string
  children: ReactNode
}

export function PageLayout({ title, subtitle, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navigation title={title} subtitle={subtitle} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
} 