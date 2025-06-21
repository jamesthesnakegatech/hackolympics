'use client'

import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="w-6 h-6 text-primary-400" />
            <span className="text-xl font-bold">Hackolympics</span>
          </div>
          <p className="text-gray-400 mb-4">
            Track your hacker house journey in San Francisco
          </p>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500 text-sm">
              © 2024 Hackolympics. Built with ❤️ in San Francisco.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 