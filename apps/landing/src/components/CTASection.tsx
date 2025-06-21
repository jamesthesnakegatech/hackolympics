'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CTASectionProps {
  onEarlyAccess: (email: string) => Promise<void>
  isLoading: boolean
}

export function CTASection({ onEarlyAccess, isLoading }: CTASectionProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    await onEarlyAccess(email)
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section id="community" className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-white mb-6"
        >
          Ready to Start Your Journey?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto"
        >
          Join hundreds of builders in San Francisco's most active hacker houses. Start collecting badges today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          {submitted ? (
            <div className="bg-white/10 border border-white/20 rounded-lg p-4">
              <p className="text-white font-medium">Thanks! We'll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/70 focus:ring-white"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                variant="secondary"
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                {isLoading ? (
                  <span>Joining...</span>
                ) : (
                  <>
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-sm text-primary-200 mt-4"
        >
          Free to join • No spam • Unsubscribe anytime
        </motion.p>
      </div>
    </section>
  )
} 