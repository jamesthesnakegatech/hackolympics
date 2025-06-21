'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { HeroSection } from '@/components/HeroSection'
import { FeaturesSection } from '@/components/FeaturesSection'
import { BadgeShowcase } from '@/components/BadgeShowcase'
import { CTASection } from '@/components/CTASection'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  // Setup - hooks and state
  const [isLoading, setIsLoading] = useState(false)

  // Logic - process data (none needed for static landing page)
  const handleEarlyAccess = async (email: string) => {
    setIsLoading(true)
    // TODO: Implement early access signup
    setTimeout(() => setIsLoading(false), 1000)
  }

  // Guard clauses - none needed for this component

  // Markup - clean, readable UI showing the happy path
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <HeroSection onEarlyAccess={handleEarlyAccess} isLoading={isLoading} />
        <FeaturesSection />
        <BadgeShowcase />
        <CTASection onEarlyAccess={handleEarlyAccess} isLoading={isLoading} />
      </motion.div>

      <Footer />
    </div>
  )
} 