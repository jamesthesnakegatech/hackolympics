import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    // Fetch user with their badges and related data
    const user = await prisma.user.findUnique({
      where: { 
        id: userId 
      },
      include: {
        userBadges: {
          include: {
            badge: true,
            event: {
              select: {
                id: true,
                title: true,
                startTime: true,
                location: true
              }
            }
          },
          orderBy: {
            earnedAt: 'desc'
          }
        },
        eventAttendees: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                startTime: true,
                location: true,
                venue: true
              }
            }
          },
          where: {
            status: 'ATTENDED'
          },
          orderBy: {
            attendedAt: 'desc'
          }
        },
        hackerHouseMembers: {
          include: {
            hackerHouse: {
              select: {
                id: true,
                name: true,
                location: true,
                neighborhood: true
              }
            }
          },
          where: {
            isActive: true
          }
        },
        _count: {
          select: {
            userBadges: true,
            eventAttendees: true,
            eventsCreated: true,
            badgesCreated: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Format the response
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      bio: user.bio,
      location: user.location,
      jobTitle: user.jobTitle,
      company: user.company,
      skills: user.skills,
      social: {
        website: user.website,
        twitter: user.twitter,
        github: user.github,
        linkedin: user.linkedin,
        partiful: user.partiful,
        luma: user.luma,
      },
      stats: {
        badgesEarned: user._count.userBadges,
        eventsAttended: user._count.eventAttendees,
        eventsCreated: user._count.eventsCreated,
        badgesCreated: user._count.badgesCreated,
      },
      badges: user.userBadges.map((userBadge: any) => ({
        id: userBadge.badge.id,
        name: userBadge.badge.name,
        description: userBadge.badge.description,
        emoji: userBadge.badge.emoji,
        category: userBadge.badge.category,
        rarity: userBadge.badge.rarity,
        imageUrl: userBadge.badge.imageUrl,
        earnedAt: userBadge.earnedAt,
        externalPlatform: userBadge.badge.externalPlatform,
        event: userBadge.event ? {
          id: userBadge.event.id,
          title: userBadge.event.title,
          startTime: userBadge.event.startTime,
          location: userBadge.event.location,
        } : null
      })),
      eventsAttended: user.eventAttendees.map((attendee: any) => ({
        id: attendee.event.id,
        title: attendee.event.title,
        startTime: attendee.event.startTime,
        location: attendee.event.location,
        venue: attendee.event.venue,
        attendedAt: attendee.attendedAt,
      })),
      hackerHouses: user.hackerHouseMembers.map((member: any) => ({
        id: member.hackerHouse.id,
        name: member.hackerHouse.name,
        location: member.hackerHouse.location,
        neighborhood: member.hackerHouse.neighborhood,
        role: member.role,
        startDate: member.startDate,
        isActive: member.isActive,
      })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Also support lookup by email or partiful URL
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json()
    const { email, partifulUrl } = body

    let user = null

    if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        include: {
          userBadges: {
            include: {
              badge: true,
              event: true
            }
          }
        }
      })
    } else if (partifulUrl) {
      user = await prisma.user.findFirst({
        where: { partiful: partifulUrl },
        include: {
          userBadges: {
            include: {
              badge: true,
              event: true
            }
          }
        }
      })
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      partiful: user.partiful,
      badges: user.userBadges.length,
      message: 'User found! Use GET /api/users/' + user.id + ' for full profile'
    })
  } catch (error) {
    console.error('Error searching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 