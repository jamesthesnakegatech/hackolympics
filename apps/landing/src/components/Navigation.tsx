'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navigation() {
  // Setup - hooks and state
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Logic - process data
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  // Guard clauses - none needed

  // Markup - clean navigation UI
  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Hackolympics</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-primary-600 transition-colors">
              Features
            </a>
            <a href="#badges" className="text-gray-700 hover:text-primary-600 transition-colors">
              Badges
            </a>
            <a href="#community" className="text-gray-700 hover:text-primary-600 transition-colors">
              Community
            </a>
            <Button>
              Get Early Access
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#badges"
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                Badges
              </a>
              <a
                href="#community"
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                Community
              </a>
              <Button className="w-full mt-2">
                Get Early Access
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
} 