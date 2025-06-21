'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CustomBadge } from '@/components/ui/custom-badge'
import { Label } from '@/components/ui/label'
import { 
  LinkIcon, 
  Upload, 
  Sparkles, 
  Calendar, 
  AlertCircle, 
  CheckCircle2,
  Loader2
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface EventMetadata {
  title: string
  description?: string
  imageUrl?: string
  date?: string
  location?: string
  organizer?: string
  platform: 'luma' | 'partiful'
  eventUrl: string
}

interface BadgeSuggestion {
  name: string
  description: string
  emoji: string
  category: string
  rarity: string
}

interface CustomBadgeForm {
  name: string
  description: string
  emoji: string
  category: 'EVENT' | 'HACKATHON' | 'COMMUNITY' | 'ACHIEVEMENT'
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  imageUrl?: string
}

export function BadgeCreator() {
  const [eventUrl, setEventUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [metadata, setMetadata] = useState<EventMetadata | null>(null)
  const [suggestions, setSuggestions] = useState<BadgeSuggestion[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState<BadgeSuggestion | null>(null)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customBadge, setCustomBadge] = useState<CustomBadgeForm>({
    name: '',
    description: '',
    emoji: '🎉',
    category: 'EVENT',
    rarity: 'COMMON'
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleUrlSubmit = async () => {
    if (!eventUrl.trim()) return

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/badges/create-from-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventUrl })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract event metadata')
      }

      setMetadata(data.metadata)
      setSuggestions(data.suggestions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBadge = async (badgeData: BadgeSuggestion | CustomBadgeForm) => {
    if (!metadata) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/badges/create-from-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventUrl: metadata.eventUrl,
          customBadge: badgeData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create badge')
      }

      setSuccess(true)
      // Reset form after success
      setTimeout(() => {
        setEventUrl('')
        setMetadata(null)
        setSuggestions([])
        setSelectedSuggestion(null)
        setShowCustomForm(false)
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const isValidUrl = (url: string) => {
    return url.includes('lu.ma') || url.includes('partiful.com')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span>Create Event Badge</span>
          </CardTitle>
          <p className="text-gray-600">
            Create custom badges for your Luma or Partiful events. Simply paste the event URL and 
            choose from suggested badges or create your own!
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Paste your Luma (lu.ma/...) or Partiful (partiful.com/e/...) event URL"
                value={eventUrl}
                onChange={(e) => setEventUrl(e.target.value)}
                className="text-sm"
              />
            </div>
            <Button 
              onClick={handleUrlSubmit}
              disabled={!eventUrl.trim() || !isValidUrl(eventUrl) || loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Extract Event
                </>
              )}
            </Button>
          </div>
          
          {eventUrl && !isValidUrl(eventUrl) && (
            <p className="text-sm text-red-600 mt-2">
              Please enter a valid Luma (lu.ma) or Partiful (partiful.com) URL
            </p>
          )}
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Badge created successfully! 🎉
          </AlertDescription>
        </Alert>
      )}

      {/* Event Metadata */}
      {metadata && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Event Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Title:</span> {metadata.title}
              </div>
              {metadata.description && (
                <div>
                  <span className="font-medium">Description:</span> {metadata.description}
                </div>
              )}
              <div>
                <span className="font-medium">Platform:</span> 
                <Badge variant="outline" className="ml-2 capitalize">
                  {metadata.platform}
                </Badge>
              </div>
              {metadata.location && (
                <div>
                  <span className="font-medium">Location:</span> {metadata.location}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badge Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Badges</CardTitle>
            <p className="text-sm text-gray-600">
              Choose from these automatically generated badge suggestions:
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedSuggestion === suggestion 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSuggestion(suggestion)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{suggestion.emoji}</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{suggestion.name}</h4>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                      <div className="flex space-x-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.category.toLowerCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.rarity.toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedSuggestion && (
              <div className="mt-4 flex space-x-2">
                <Button 
                  onClick={() => handleCreateBadge(selectedSuggestion)}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  Create Selected Badge
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCustomForm(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Create Custom Badge
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Custom Badge Form */}
      {showCustomForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Custom Badge</CardTitle>
            <p className="text-sm text-gray-600">
              Design your own badge for this event:
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="badge-name">Badge Name</Label>
                  <Input
                    id="badge-name"
                    value={customBadge.name}
                    onChange={(e) => setCustomBadge({...customBadge, name: e.target.value})}
                    placeholder="Enter badge name"
                  />
                </div>
                <div>
                  <Label htmlFor="badge-emoji">Emoji</Label>
                  <Input
                    id="badge-emoji"
                    value={customBadge.emoji}
                    onChange={(e) => setCustomBadge({...customBadge, emoji: e.target.value})}
                    placeholder="🎉"
                    className="text-center"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="badge-description">Description</Label>
                <Input
                  id="badge-description"
                  value={customBadge.description}
                  onChange={(e) => setCustomBadge({...customBadge, description: e.target.value})}
                  placeholder="Describe what this badge represents"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="badge-category">Category</Label>
                  <select
                    id="badge-category"
                    value={customBadge.category}
                    onChange={(e) => setCustomBadge({...customBadge, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-label="Badge Category"
                  >
                    <option value="EVENT">Event</option>
                    <option value="HACKATHON">Hackathon</option>
                    <option value="COMMUNITY">Community</option>
                    <option value="ACHIEVEMENT">Achievement</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="badge-rarity">Rarity</Label>
                  <select
                    id="badge-rarity"
                    value={customBadge.rarity}
                    onChange={(e) => setCustomBadge({...customBadge, rarity: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-label="Badge Rarity"
                  >
                    <option value="COMMON">Common</option>
                    <option value="RARE">Rare</option>
                    <option value="EPIC">Epic</option>
                    <option value="LEGENDARY">Legendary</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="badge-image">Badge Image URL (Optional)</Label>
                <Input
                  id="badge-image"
                  value={customBadge.imageUrl || ''}
                  onChange={(e) => setCustomBadge({...customBadge, imageUrl: e.target.value})}
                  placeholder="https://example.com/badge-image.png"
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleCreateBadge(customBadge)}
                  disabled={!customBadge.name || !customBadge.description || loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Create Custom Badge
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCustomForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 