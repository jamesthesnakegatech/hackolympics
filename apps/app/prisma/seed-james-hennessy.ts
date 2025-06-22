import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding James Hennessy profile and badges...')

  // Create James Hennessy's user profile
  const jamesUser = await prisma.user.upsert({
    where: { email: 'james@hennessy.dev' },
    update: {},
    create: {
      name: 'James Hennessy',
      email: 'james@hennessy.dev',
      image: 'https://partiful.com/static/images/default-avatar.png',
      bio: 'Builder, creator, and event enthusiast. Active in the SF tech community.',
      location: 'San Francisco, CA',
      twitter: 'jamesthesnake',
      partiful: 'https://partiful.com/u/BRNcSN2N4bfoK9maRruOC6BH78E2',
      jobTitle: 'Software Engineer',
      company: 'Tech Startup',
      skills: ['JavaScript', 'React', 'Node.js', 'Event Planning', 'Community Building'],
      isPublic: true,
    },
  })

  console.log(`✅ Created user: ${jamesUser.name} (${jamesUser.id})`)

  // Create sample badges that James could earn
  const badges = [
    {
      name: 'Partiful Pioneer',
      description: 'Early adopter of the Partiful platform',
      emoji: '🎉',
      category: 'COMMUNITY' as const,
      rarity: 'RARE' as const,
      criteria: JSON.stringify({
        description: 'Join Partiful before 2022',
        requirements: ['Account created before 2022-01-01']
      }),
      externalPlatform: 'partiful',
    },
    {
      name: 'Event Enthusiast',
      description: 'Attended multiple community events',
      emoji: '🎊',
      category: 'EVENT' as const,
      rarity: 'COMMON' as const,
      criteria: JSON.stringify({
        description: 'Attend 5+ events on Partiful',
        requirements: ['Attend at least 5 events', 'Active participation']
      }),
      externalPlatform: 'partiful',
    },
    {
      name: 'SF Tech Community Member',
      description: 'Active member of the San Francisco tech community',
      emoji: '🌉',
      category: 'COMMUNITY' as const,
      rarity: 'EPIC' as const,
      criteria: JSON.stringify({
        description: 'Recognized contributor to SF tech scene',
        requirements: ['Located in SF', 'Active in tech community', 'Networking events']
      }),
    },
    {
      name: 'Code & Coffee Champion',
      description: 'Regular attendee of coding meetups',
      emoji: '☕',
      category: 'EVENT' as const,
      rarity: 'COMMON' as const,
      criteria: JSON.stringify({
        description: 'Attend coding meetups regularly',
        requirements: ['Attend 3+ coding meetups', 'Engage with community']
      }),
    },
    {
      name: 'Hackathon Hero',
      description: 'Participated in multiple hackathons',
      emoji: '💻',
      category: 'HACKATHON' as const,
      rarity: 'RARE' as const,
      criteria: JSON.stringify({
        description: 'Complete multiple hackathon challenges',
        requirements: ['Participate in 2+ hackathons', 'Submit working projects']
      }),
    }
  ]

  const createdBadges = []
  for (const badgeData of badges) {
    const badge = await prisma.badge.upsert({
      where: { name: badgeData.name },
      update: {},
      create: {
        ...badgeData,
        createdBy: jamesUser.id, // James created these badges as examples
      },
    })
    createdBadges.push(badge)
    console.log(`✅ Created badge: ${badge.name} (${badge.id})`)
  }

  // Award some badges to James
  const badgesToAward = [
    { badgeName: 'Partiful Pioneer', reason: 'James joined Partiful in Sep 2021' },
    { badgeName: 'Event Enthusiast', reason: 'James has attended many community events' },
    { badgeName: 'SF Tech Community Member', reason: 'James is active in SF tech scene' },
  ]

  for (const { badgeName, reason } of badgesToAward) {
    const badge = createdBadges.find(b => b.name === badgeName)
    if (badge) {
      const userBadge = await prisma.userBadge.upsert({
        where: {
          userId_badgeId: {
            userId: jamesUser.id,
            badgeId: badge.id,
          }
        },
        update: {},
        create: {
          userId: jamesUser.id,
          badgeId: badge.id,
          earnedAt: new Date(),
        },
      })
      console.log(`🏆 Awarded badge "${badgeName}" to James - ${reason}`)
    }
  }

  // Create a sample event that James might have attended
  const sampleEvent = await prisma.event.upsert({
    where: { title: 'SF Tech Networking Night' },
    update: {},
    create: {
      title: 'SF Tech Networking Night',
      description: 'Monthly networking event for SF tech professionals',
      location: 'San Francisco, CA',
      startTime: new Date('2024-01-15T18:00:00Z'),
      endTime: new Date('2024-01-15T21:00:00Z'),
      venue: 'WeWork SOMA',
      maxAttendees: 100,
      createdBy: jamesUser.id,
    },
  })

  // Mark James as attending this event
  await prisma.eventAttendee.upsert({
    where: {
      userId_eventId: {
        userId: jamesUser.id,
        eventId: sampleEvent.id,
      }
    },
    update: {},
    create: {
      userId: jamesUser.id,
      eventId: sampleEvent.id,
      status: 'ATTENDED',
    },
  })

  console.log(`✅ Created sample event and marked James as attendee`)

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`👤 User: ${jamesUser.name}`)
  console.log(`🔗 Partiful: ${jamesUser.partiful}`)
  console.log(`🏆 Badges created: ${createdBadges.length}`)
  console.log(`🏅 Badges awarded to James: ${badgesToAward.length}`)
  console.log(`📅 Events: 1`)
  
  console.log('\n🔍 Profile Details:')
  console.log(`- Name: ${jamesUser.name}`)
  console.log(`- Username: jamesthesnake`)
  console.log(`- Joined Partiful: Sep '21`)
  console.log(`- Location: ${jamesUser.location}`)
  console.log(`- Skills: ${jamesUser.skills?.join(', ')}`)
  console.log(`- Partiful URL: ${jamesUser.partiful}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  }) 