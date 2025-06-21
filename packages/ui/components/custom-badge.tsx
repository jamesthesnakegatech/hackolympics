'use client'

import { cn } from '../lib/utils'

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
    <div
      className={cn(
        'bg-white rounded-xl border-2 p-4 text-center transition-all duration-200 hover:scale-105',
        rarityColors[rarity],
        rarityGlow[rarity] && `shadow-md ${rarityGlow[rarity]}`,
        !isEarned && 'opacity-60 grayscale',
        className
      )}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <h3 className="font-semibold text-sm mb-1">{name}</h3>
      <p className="text-xs text-gray-600 mb-2">{description}</p>
      <div className="flex flex-col gap-1">
        <span
          className={cn(
            'inline-block px-2 py-1 rounded text-xs font-medium',
            categoryColors[category]
          )}
        >
          {category}
        </span>
        <span
          className={cn(
            'inline-block px-2 py-1 rounded text-xs border capitalize',
            rarity === 'legendary' && 'text-yellow-700 border-yellow-500 bg-yellow-50',
            rarity === 'epic' && 'text-purple-700 border-purple-500 bg-purple-50',
            rarity === 'rare' && 'text-blue-700 border-blue-500 bg-blue-50',
            rarity === 'common' && 'text-gray-700 border-gray-500 bg-gray-50'
          )}
        >
          {rarity}
        </span>
      </div>
    </div>
  )
}