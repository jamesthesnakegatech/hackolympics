'use client'

import { motion } from 'framer-motion'
import { Badge, Calendar, Users, Zap, Trophy, Star, MapPin, Home, Heart, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function FeaturesSection() {
  const features = [
    {
      icon: Home,
      title: 'Discover Hacker Houses',
      description: 'Explore SF\'s most innovative collaborative living spaces with detailed profiles, member showcases, and real locations.',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Connect with Builders',
      description: 'Meet brilliant founders, engineers, and creators. View their skills, achievements, and social profiles in one place.',
      color: 'text-purple-600'
    },
    {
      icon: MapPin,
      title: 'Interactive Map View',
      description: 'Navigate SF neighborhoods to find houses in SOMA, Mission, Castro, Marina, and Pacific Heights with precise locations.',
      color: 'text-green-600'
    },
    {
      icon: Badge,
      title: 'Achievement Badges',
      description: 'Showcase your contributions with beautiful badges: AI Pioneer, Hackathon Winner, Community Builder, and more.',
      color: 'text-yellow-600'
    },
    {
      icon: Heart,
      title: 'Social Integration',
      description: 'Link your Partiful and Luma profiles to connect with the broader SF event ecosystem and discover new opportunities.',
      color: 'text-pink-600'
    },
    {
      icon: Sparkles,
      title: 'Modern Experience',
      description: 'Enjoy a beautifully designed, responsive interface with smooth animations and intuitive navigation.',
      color: 'text-indigo-600'
    }
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-4"
          >
            Why Choose Hackolympics? ✨
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            The most comprehensive platform for discovering and connecting with SF's hacker house community
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-white to-gray-50 flex items-center justify-center mb-4 shadow-md`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 