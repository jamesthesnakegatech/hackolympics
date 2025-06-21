'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CustomBadge } from '@/components/ui/custom-badge'
import { Plus, ExternalLink, Calendar, Users, Trophy, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface BadgeData {
  id: string
  name: string
  description: string
  emoji: string
  category: string
  rarity: string
  imageUrl?: string
  externalEventUrl?: string
  externalPlatform?: string
  createdAt: string
  creator?: {
    name?: string
    email: string
  }
}

export default function BadgesPage() {
  const { data: session } = useSession()
  const [badges, setBadges] = useState<BadgeData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBadges()
  }, [])

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/badges')
      if (response.ok) {
        const data = await response.json()
        setBadges(data)
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'event': return Calendar
      case 'hackathon': return Trophy
      case 'community': return Users
      default: return Calendar
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Directory
                </Button>
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Event Badges
              </h1>
            </div>
            {session && (
              <Link href="/badges/create">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Badge
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <Card className="mb-8 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              SF Hacker House Event Badges ✨
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Discover and create badges for SF hacker house events. Connect your Luma and Partiful events 
              to create custom badges that showcase your community involvement!
            </p>
            {session && (
              <Link href="/badges/create">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Badge
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{badges.length}</div>
              <div className="text-gray-600">Total Badges Created</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">
                {badges.filter(b => b.externalPlatform === 'luma').length}
              </div>
              <div className="text-gray-600">Luma Event Badges</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {badges.filter(b => b.externalPlatform === 'partiful').length}
              </div>
              <div className="text-gray-600">Partiful Event Badges</div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Grid */}
        {badges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => {
              const CategoryIcon = getCategoryIcon(badge.category)
              return (
                <Card key={badge.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">{badge.emoji}</div>
                      <div className="flex items-center space-x-2">
                        {badge.externalPlatform && (
                          <Badge variant="outline" className="text-xs capitalize">
                            {badge.externalPlatform}
                          </Badge>
                        )}
                        <Badge 
                          variant="outline" 
                          className={`text-xs border ${getRarityColor(badge.rarity)}`}
                        >
                          {badge.rarity.toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{badge.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{badge.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <CategoryIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500 capitalize">{badge.category.toLowerCase()}</span>
                      </div>
                      {badge.externalEventUrl && (
                        <a 
                          href={badge.externalEventUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      Created {new Date(badge.createdAt).toLocaleDateString()}
                      {badge.creator && (
                        <> by {badge.creator.name || badge.creator.email}</>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No badges yet!</h3>
              <p className="text-gray-600 mb-6">
                Be the first to create a badge for your hacker house event.
              </p>
              {session && (
                <Link href="/badges/create">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Badge
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
} 