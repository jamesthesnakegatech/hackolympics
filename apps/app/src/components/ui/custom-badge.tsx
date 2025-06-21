'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Award, Brain, Coffee, Github, Heart, Rocket, Star, Trophy, Users, Zap } from 'lucide-react'

export interface CustomBadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  badgeId?: string
  showLabel?: boolean
  className?: string
  children?: React.ReactNode
}

// Badge definitions with icons and colors
const BADGE_DEFINITIONS = {
  'ai-pioneer': {
    name: 'AI Pioneer',
    description: 'Leading the way in artificial intelligence',
    icon: Brain,
    gradient: 'from-blue-500 to-purple-600',
    bgGradient: 'from-blue-50 to-purple-50',
    textColor: 'text-blue-700',
    rarity: 'epic'
  },
  'hackathon-winner': {
    name: 'Hackathon Winner',
    description: 'Victorious in coding competitions',
    icon: Trophy,
    gradient: 'from-yellow-400 to-orange-500',
    bgGradient: 'from-yellow-50 to-orange-50',
    textColor: 'text-orange-700',
    rarity: 'rare'
  },
  'open-source-contributor': {
    name: 'Open Source Hero',
    description: 'Contributing to the community',
    icon: Github,
    gradient: 'from-gray-600 to-gray-800',
    bgGradient: 'from-gray-50 to-gray-100',
    textColor: 'text-gray-700',
    rarity: 'common'
  },
  'community-builder': {
    name: 'Community Builder',
    description: 'Bringing people together',
    icon: Users,
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50',
    textColor: 'text-green-700',
    rarity: 'rare'
  },
  'product-expert': {
    name: 'Product Expert',
    description: 'Master of product development',
    icon: Rocket,
    gradient: 'from-pink-500 to-rose-600',
    bgGradient: 'from-pink-50 to-rose-50',
    textColor: 'text-pink-700',
    rarity: 'rare'
  },
  'safety-advocate': {
    name: 'Safety Advocate',
    description: 'Keeping AI safe and beneficial',
    icon: Heart,
    gradient: 'from-red-500 to-pink-600',
    bgGradient: 'from-red-50 to-pink-50',
    textColor: 'text-red-700',
    rarity: 'epic'
  },
  'founder': {
    name: 'Founder',
    description: 'Building the future',
    icon: Star,
    gradient: 'from-indigo-500 to-purple-600',
    bgGradient: 'from-indigo-50 to-purple-50',
    textColor: 'text-indigo-700',
    rarity: 'legendary'
  },
  'stealth-mode': {
    name: 'Stealth Mode',
    description: 'Working on something secret',
    icon: Zap,
    gradient: 'from-gray-700 to-black',
    bgGradient: 'from-gray-50 to-slate-100',
    textColor: 'text-gray-800',
    rarity: 'epic'
  },
  'night-owl': {
    name: 'Night Owl',
    description: 'Coding through the night',
    icon: Coffee,
    gradient: 'from-amber-600 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-50',
    textColor: 'text-amber-700',
    rarity: 'common'
  }
}

const RARITY_STYLES = {
  common: 'ring-2 ring-gray-200',
  rare: 'ring-2 ring-blue-300 shadow-md',
  epic: 'ring-2 ring-purple-400 shadow-lg',
  legendary: 'ring-4 ring-yellow-400 shadow-xl animate-pulse'
}

export function CustomBadge({ 
  badgeId, 
  variant = 'default', 
  size = 'md', 
  showLabel = true,
  className,
  children,
  ...props 
}: CustomBadgeProps) {
  
  if (children) {
    // Regular badge usage
    return (
      <Badge variant={variant} className={cn(className)} {...props}>
        {children}
      </Badge>
    )
  }

  if (!badgeId || !BADGE_DEFINITIONS[badgeId as keyof typeof BADGE_DEFINITIONS]) {
    return null
  }

  const badgeData = BADGE_DEFINITIONS[badgeId as keyof typeof BADGE_DEFINITIONS]
  const IconComponent = badgeData.icon
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn('inline-flex flex-col items-center space-y-1', className)}>
      <div className={cn(
        'rounded-full p-2 bg-gradient-to-br shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer',
        sizeClasses[size],
        `bg-gradient-to-br ${badgeData.gradient}`,
        RARITY_STYLES[badgeData.rarity as keyof typeof RARITY_STYLES]
      )}
      title={badgeData.description}
      >
        <div className={cn(
          'w-full h-full rounded-full bg-gradient-to-br flex items-center justify-center text-white',
          `bg-gradient-to-br ${badgeData.bgGradient}`
        )}>
          <IconComponent className={cn(iconSizes[size], 'text-white')} />
        </div>
      </div>
      
      {showLabel && (
        <div className="text-center">
          <div className={cn('text-xs font-semibold', badgeData.textColor)}>
            {badgeData.name}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomBadge 