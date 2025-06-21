'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Home, Users, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section id="community" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-white mb-6"
        >
          Ready to Find Your Hacker House? 🏠
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
        >
          Join SF's most innovative tech community. Discover amazing houses, connect with brilliant builders, and showcase your achievements with our badge system.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 mb-12"
        >
          <div className="flex items-center space-x-2 text-white/90">
            <Home className="w-5 h-5" />
            <span className="font-semibold">5+ Active Houses</span>
          </div>
          <div className="flex items-center space-x-2 text-white/90">
            <Users className="w-5 h-5" />
            <span className="font-semibold">50+ Community Members</span>
          </div>
          <div className="flex items-center space-x-2 text-white/90">
            <MapPin className="w-5 h-5" />
            <span className="font-semibold">5 SF Neighborhoods</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
        >
          <Button
            asChild
            size="lg"
            className="bg-white text-purple-700 hover:bg-gray-100 font-bold text-lg py-4 px-8 shadow-xl flex-1"
          >
            <a href="http://localhost:3001/auth/signin">
              <span>Explore Houses Now!</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto"
        >
          <h3 className="text-lg font-bold text-white mb-3">Try Demo Accounts 🚀</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="font-semibold text-white">Alex Chen</div>
              <div className="text-white/80">ML Engineer @ OpenAI</div>
              <div className="text-white/60 mt-1">alex / demo123</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="font-semibold text-white">Sarah Kim</div>
              <div className="text-white/80">PM @ Anthropic</div>
              <div className="text-white/60 mt-1">sarah / demo123</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="font-semibold text-white">Mike Torres</div>
              <div className="text-white/80">Founder @ Stealth AI</div>
              <div className="text-white/60 mt-1">mike / demo123</div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-sm text-white/70 mt-6"
        >
          No signup required • Instant access • Full demo experience
        </motion.p>
      </div>
    </section>
  )
} 