'use client'

import { motion } from 'framer-motion'
import { CustomBadge } from '@/components/ui/custom-badge'

export function BadgeShowcase() {
  const badges = [
    { 
      name: 'AI Pioneer', 
      emoji: '🤖', 
      description: 'Leading innovation in artificial intelligence and machine learning',
      category: 'achievement' as const,
      rarity: 'epic' as const,
      isEarned: true
    },
    { 
      name: 'Hackathon Winner', 
      emoji: '🏆', 
      description: 'Achieved victory in competitive hackathon events',
      category: 'hackathon' as const,
      rarity: 'rare' as const,
      isEarned: true
    },
    { 
      name: 'Open Source Hero', 
      emoji: '💻', 
      description: 'Made significant contributions to open source projects',
      category: 'community' as const,
      rarity: 'rare' as const,
      isEarned: false
    },
    { 
      name: 'Community Builder', 
      emoji: '🤝', 
      description: 'Organized events and mentored fellow builders',
      category: 'community' as const,
      rarity: 'epic' as const,
      isEarned: false
    },
    { 
      name: 'Product Expert', 
      emoji: '🚀', 
      description: 'Shipped successful products used by thousands',
      category: 'achievement' as const,
      rarity: 'rare' as const,
      isEarned: true
    },
    { 
      name: 'Founder', 
      emoji: '🌟', 
      description: 'Started and scaled successful companies',
      category: 'achievement' as const,
      rarity: 'legendary' as const,
      isEarned: false
    },
    { 
      name: 'Safety Advocate', 
      emoji: '🛡️', 
      description: 'Champion of AI safety and ethical technology',
      category: 'community' as const,
      rarity: 'epic' as const,
      isEarned: false
    },
    { 
      name: 'Night Owl', 
      emoji: '🦉', 
      description: 'Dedicated to late-night coding and building',
      category: 'event' as const,
      rarity: 'common' as const,
      isEarned: true
    },
    { 
      name: 'Stealth Mode', 
      emoji: '🥷', 
      description: 'Working on confidential breakthrough projects',
      category: 'achievement' as const,
      rarity: 'rare' as const,
      isEarned: false
    },
  ]

  return (
    <section id="badges" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-4"
          >
            Showcase Your Achievements 🎖️
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Earn beautiful badges that represent your contributions to the SF tech community
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="hover:scale-105 transition-transform duration-300"
            >
              <CustomBadge
                name={badge.name}
                emoji={badge.emoji}
                description={badge.description}
                category={badge.category}
                rarity={badge.rarity}
                isEarned={badge.isEarned}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Badge Rarity System ✨</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
                <span className="font-semibold text-gray-700">Common</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-400 rounded-full mx-auto mb-2"></div>
                <span className="font-semibold text-blue-700">Rare</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2"></div>
                <span className="font-semibold text-purple-700">Epic</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-2"></div>
                <span className="font-semibold text-yellow-700">Legendary</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 