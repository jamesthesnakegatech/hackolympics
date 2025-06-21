// User types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

// Badge types
export interface Badge {
  id: string
  name: string
  description: string
  emoji: string
  category: BadgeCategory
  rarity: BadgeRarity
  requirements: string[]
  createdAt: Date
}

export type BadgeCategory = 
  | 'event'
  | 'hackathon'
  | 'community'
  | 'networking'
  | 'achievement'
  | 'special'

export type BadgeRarity = 
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'

// User Badge (earned badge)
export interface UserBadge {
  id: string
  userId: string
  badgeId: string
  earnedAt: Date
  eventId?: string
  badge: Badge
}

// Event types
export interface Event {
  id: string
  title: string
  description: string
  date: Date
  location: string
  hackerHouse: string
  maxAttendees?: number
  currentAttendees: number
  badges: Badge[]
  createdAt: Date
  updatedAt: Date
}

// Hacker House types
export interface HackerHouse {
  id: string
  name: string
  description: string
  location: string
  website?: string
  logoUrl?: string
  createdAt: Date
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface EarlyAccessForm {
  email: string
}

export interface ProfileForm {
  name: string
  bio?: string
  website?: string
  twitter?: string
  github?: string
} 