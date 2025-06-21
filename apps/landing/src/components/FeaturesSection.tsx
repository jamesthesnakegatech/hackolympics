'use client'

import { motion } from 'framer-motion'
import { Badge, Calendar, Users, Zap, Trophy, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function FeaturesSection() {
  const features = [
    {
      icon: Badge,
      title: 'Collect Unique Badges',
      description: 'Earn badges for attending events, participating in hackathons, and contributing to the community.',
      color: 'text-blue-600'
    },
    {
      icon: Calendar,
      title: 'Track Your Journey',
      description: 'See your progress over time and discover new events happening in SF hacker houses.',
      color: 'text-green-600'
    },
    {
      icon: Users,
      title: 'Connect with Builders',
      description: 'Find like-minded developers, designers, and entrepreneurs in the SF tech scene.',
      color: 'text-purple-600'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Get instant notifications about new events and automatically earn badges when you attend.',
      color: 'text-yellow-600'
    },
    {
      icon: Trophy,
      title: 'Show Your Impact',
      description: 'Display your achievements and contributions to the hacker house community.',
      color: 'text-red-600'
    },
    {
      icon: Star,
      title: 'Discover Events',
      description: 'Find the best events, talks, and workshops happening across San Francisco.',
      color: 'text-indigo-600'
    }
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Build your reputation in the SF hacker house community through meaningful participation
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
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
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