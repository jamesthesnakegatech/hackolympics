'use client'

import { motion } from 'framer-motion'
import { CustomBadge } from '@/components/ui/custom-badge'

export function BadgeShowcase() {
  const badges = [
    { 
      name: 'First Timer', 
      emoji: '🌟', 
      description: 'Attended your first hacker house event',
      category: 'event' as const,
      rarity: 'common' as const,
      isEarned: true
    },
    { 
      name: 'Hackathon Hero', 
      emoji: '🏆', 
      description: 'Participated in a 48-hour hackathon',
      category: 'hackathon' as const,
      rarity: 'rare' as const,
      isEarned: true
    },
    { 
      name: 'Demo Day', 
      emoji: '🎤', 
      description: 'Presented at a demo day',
      category: 'event' as const,
      rarity: 'common' as const,
      isEarned: false
    },
    { 
      name: 'Community Builder', 
      emoji: '🤝', 
      description: 'Organized an event for the community',
      category: 'community' as const,
      rarity: 'epic' as const,
      isEarned: false
    },
    { 
      name: 'Night Owl', 
      emoji: '🦉', 
      description: 'Stayed coding until 3am at an event',
      category: 'achievement' as const,
      rarity: 'rare' as const,
      isEarned: true
    },
    { 
      name: 'Networking Pro', 
      emoji: '🌐', 
      description: 'Met 10+ new people at events',
      category: 'community' as const,
      rarity: 'legendary' as const,
      isEarned: false
    },
  ]

  return (
    <section id="badges" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Collect These Badges
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Every event you attend, every contribution you make earns you unique badges
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
      </div>
    </section>
  )
} 