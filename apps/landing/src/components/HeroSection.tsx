'use client'

import { motion } from 'framer-motion'
import { ChevronRight, Badge, Users, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface HeroSectionProps {
  onEarlyAccess: (email: string) => Promise<void>
  isLoading: boolean
}

export function HeroSection({ onEarlyAccess, isLoading }: HeroSectionProps) {
  // Setup - hooks and state
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Logic - process data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    await onEarlyAccess(email)
    setSubmitted(true)
    setEmail('')
  }

  // Guard clauses - none needed for this component

  // Markup - hero section UI
  return (
    <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-8"
          >
            <MapPin className="w-4 h-4 mr-2" />
            San Francisco Hacker Houses
            <ChevronRight className="w-4 h-4 ml-2" />
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold text-gray-900 mb-6"
          >
            Find Your Perfect{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Hacker House
            </span>
            {' '}✨
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Connect with SF's most innovative hacker community! 🚀 Link your Partiful & Luma profiles, find your tribe, and discover amazing collaborative living spaces where brilliant minds build the future together.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 mb-12"
          >
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>15+ Active Houses</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span>200+ Community Members</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Badge className="w-5 h-5" />
              <span>5+ SF Neighborhoods</span>
            </div>
          </motion.div>

          {/* Email signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-md mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-bold text-lg py-4 px-8 shadow-xl"
              >
                <a href="http://localhost:3001/auth/signin">
                  Let's Explore! 🏠✨
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold"
              >
                <a href="#features">
                  Learn More 📖
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-gray-500 mt-4"
          >
            Connect with builders from SOMA, Mission, Castro, and beyond
          </motion.p>
        </div>
      </div>
    </section>
  )
} 