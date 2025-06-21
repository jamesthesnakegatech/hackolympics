import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const badges = await prisma.badge.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(badges)
  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch badges' },
      { status: 500 }
    )
  }
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

    const data = await request.json()
    const { name, description, emoji, category, rarity, criteria } = data

    const badge = await prisma.badge.create({
      data: {
        name,
        description,
        emoji,
        category,
        rarity,
        criteria: JSON.stringify(criteria)
      }
    })

    return NextResponse.json(badge, { status: 201 })
  } catch (error) {
    console.error('Error creating badge:', error)
    return NextResponse.json(
      { error: 'Failed to create badge' },
      { status: 500 }
    )
  }
} 