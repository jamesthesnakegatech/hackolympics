'use client'

import { motion } from 'framer-motion'
import { HeroSection } from '@/components/HeroSection'
import { FeaturesSection } from '@/components/FeaturesSection'
import { BadgeShowcase } from '@/components/BadgeShowcase'
import { CTASection } from '@/components/CTASection'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <HeroSection />
        <FeaturesSection />
        <BadgeShowcase />
        <CTASection />
      </motion.div>

      <Footer />
    </div>
  )
} 