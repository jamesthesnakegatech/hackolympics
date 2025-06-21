import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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

// Extract metadata from Luma URL
async function extractLumaMetadata(url: string): Promise<EventMetadata | null> {
  try {
    // In a real implementation, you would scrape the Luma page or use their API
    // For now, we'll extract basic info from the URL
    const eventId = url.match(/lu\.ma\/([^/?]+)/)?.[1]
    if (!eventId) return null

    // Mock response - in production, you'd fetch from Luma's API or scrape
    return {
      title: `Event ${eventId}`, // Would be actual title from API
      description: 'Description from Luma event',
      imageUrl: undefined,
      date: new Date().toISOString(),
      location: 'San Francisco, CA',
      organizer: 'Event Organizer',
      platform: 'luma',
      eventUrl: url
    }
  } catch (error) {
    console.error('Error extracting Luma metadata:', error)
    return null
  }
}

// Extract metadata from Partiful URL
async function extractPartifulMetadata(url: string): Promise<EventMetadata | null> {
  try {
    // Similar to Luma, extract event info
    const eventId = url.match(/partiful\.com\/e\/([^/?]+)/)?.[1]
    if (!eventId) return null

    // Mock response - in production, you'd fetch from Partiful's API or scrape
    return {
      title: `Event ${eventId}`, // Would be actual title from API
      description: 'Description from Partiful event',
      imageUrl: undefined,
      date: new Date().toISOString(),
      location: 'San Francisco, CA',
      organizer: 'Event Organizer',
      platform: 'partiful',
      eventUrl: url
    }
  } catch (error) {
    console.error('Error extracting Partiful metadata:', error)
    return null
  }
}

// Generate automatic badge suggestions based on event metadata
function generateBadgeSuggestions(metadata: EventMetadata) {
  const suggestions = []
  
  // Basic event attendance badge
  suggestions.push({
    name: `${metadata.title} Attendee`,
    description: `Attended ${metadata.title}`,
    emoji: '🎉',
    category: 'EVENT',
    rarity: 'COMMON'
  })

  // Platform-specific badges
  if (metadata.platform === 'luma') {
    suggestions.push({
      name: 'Luma Explorer',
      description: 'Attended an event organized through Luma',
      emoji: '📅',
      category: 'EVENT',
      rarity: 'COMMON'
    })
  } else if (metadata.platform === 'partiful') {
    suggestions.push({
      name: 'Partiful Party-goer',
      description: 'Attended an event organized through Partiful',
      emoji: '🎊',
      category: 'EVENT',
      rarity: 'COMMON'
    })
  }

  // Location-based badges
  if (metadata.location?.includes('San Francisco') || metadata.location?.includes('SF')) {
    suggestions.push({
      name: 'SF Event Explorer',
      description: 'Attended an event in San Francisco',
      emoji: '🌉',
      category: 'COMMUNITY',
      rarity: 'COMMON'
    })
  }

  // Time-based badges (if it's a hackathon or multi-day event)
  if (metadata.title.toLowerCase().includes('hackathon')) {
    suggestions.push({
      name: 'Hackathon Participant',
      description: 'Participated in a hackathon event',
      emoji: '⚡',
      category: 'HACKATHON',
      rarity: 'RARE'
    })
  }

  return suggestions
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { eventUrl, customBadge } = await request.json()

    if (!eventUrl) {
      return NextResponse.json(
        { error: 'Event URL is required' },
        { status: 400 }
      )
    }

    // Extract metadata based on platform
    let metadata: EventMetadata | null = null
    
    if (eventUrl.includes('lu.ma')) {
      metadata = await extractLumaMetadata(eventUrl)
    } else if (eventUrl.includes('partiful.com')) {
      metadata = await extractPartifulMetadata(eventUrl)
    } else {
      return NextResponse.json(
        { error: 'Unsupported event platform. Please use Luma or Partiful URLs.' },
        { status: 400 }
      )
    }

    if (!metadata) {
      return NextResponse.json(
        { error: 'Could not extract event metadata from URL' },
        { status: 400 }
      )
    }

    // If custom badge data is provided, use it. Otherwise, generate suggestions
    if (customBadge) {
      // Create the custom badge
      const badge = await prisma.badge.create({
        data: {
          name: customBadge.name,
          description: customBadge.description,
          emoji: customBadge.emoji,
          category: customBadge.category,
          rarity: customBadge.rarity,
          imageUrl: customBadge.imageUrl || null,
          externalEventUrl: metadata.eventUrl,
          externalPlatform: metadata.platform,
          createdBy: session.user?.email as string,
          criteria: JSON.stringify({
            eventUrl: metadata.eventUrl,
            platform: metadata.platform,
            eventTitle: metadata.title,
            createdBy: session.user?.email
          })
        }
      })

      return NextResponse.json({ 
        badge,
        metadata,
        message: 'Badge created successfully!'
      })
    } else {
      // Return metadata and badge suggestions for user to choose from
      const suggestions = generateBadgeSuggestions(metadata)
      
      return NextResponse.json({
        metadata,
        suggestions,
        message: 'Event metadata extracted successfully. Choose a badge or create a custom one.'
      })
    }

  } catch (error) {
    console.error('Error creating badge from event:', error)
    return NextResponse.json(
      { error: 'Failed to create badge from event' },
      { status: 500 }
    )
  }
} 