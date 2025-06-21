'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CustomBadgeProps {
  name: string
  emoji: string
  description: string
  category: 'event' | 'hackathon' | 'community' | 'achievement'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  isEarned?: boolean
  className?: string
}

const categoryColors = {
  event: 'bg-blue-100 text-blue-800',
  hackathon: 'bg-purple-100 text-purple-800',
  community: 'bg-green-100 text-green-800',
  achievement: 'bg-yellow-100 text-yellow-800',
}

const rarityColors = {
  common: 'border-gray-300',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-yellow-500',
}

const rarityGlow = {
  common: '',
  rare: 'shadow-blue-200/50',
  epic: 'shadow-purple-200/50',
  legendary: 'shadow-yellow-200/50',
}

export function CustomBadge({
  name,
  emoji,
  description,
  category,
  rarity,
  isEarned = false,
  className,
}: CustomBadgeProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:scale-105',
        rarityColors[rarity],
        rarityGlow[rarity] && `shadow-md ${rarityGlow[rarity]}`,
        !isEarned && 'opacity-60 grayscale',
        className
      )}
    >
      <CardContent className="p-4 text-center">
        <div className="text-3xl mb-2">{emoji}</div>
        <h3 className="font-semibold text-sm mb-1">{name}</h3>
        <p className="text-xs text-gray-600 mb-2">{description}</p>
        <div className="flex flex-col gap-1">
          <Badge
            variant="secondary"
            className={cn('text-xs', categoryColors[category])}
          >
            {category}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              'text-xs capitalize',
              rarity === 'legendary' && 'text-yellow-700 border-yellow-500',
              rarity === 'epic' && 'text-purple-700 border-purple-500',
              rarity === 'rare' && 'text-blue-700 border-blue-500',
              rarity === 'common' && 'text-gray-700 border-gray-500'
            )}
          >
            {rarity}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
} 