import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://workflow.thinkbuddy.ai/webhook/hackathon-get-badge', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If the external API is not available, return mock data
      const mockBadges = {
        data: [
          {
            id: 'badge-1',
            name: 'SF Hackathon Winner',
            description: 'Won first place at a San Francisco hackathon',
            category: 'hackathon',
            rarity: 'legendary',
            event: 'SF Tech Week 2024',
            location: 'San Francisco, CA',
            date: '2024-10-15',
            points: 100,
            emoji: '🏆'
          },
          {
            id: 'badge-2', 
            name: 'Community Builder',
            description: 'Active contributor to the SF hacker community',
            category: 'community',
            rarity: 'epic',
            event: 'Hacker House Events',
            location: 'San Francisco, CA',
            date: '2024-11-01',
            points: 75,
            emoji: '🏠'
          },
          {
            id: 'badge-3',
            name: 'Demo Day Presenter',
            description: 'Successfully presented at a demo day event',
            category: 'achievement',
            rarity: 'rare',
            event: 'Weekly Demo Day',
            location: 'SOMA, SF',
            date: '2024-11-20',
            points: 50,
            emoji: '🎤'
          }
        ]
      };
      return NextResponse.json(mockBadges);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching badge data:', error);
    // Return mock data as fallback
    const mockBadges = {
      data: [
        {
          id: 'badge-1',
          name: 'SF Hackathon Winner',
          description: 'Won first place at a San Francisco hackathon',
          category: 'hackathon',
          rarity: 'legendary',
          event: 'SF Tech Week 2024',
          location: 'San Francisco, CA',
          date: '2024-10-15',
          points: 100,
          emoji: '🏆'
        }
      ]
    };
    return NextResponse.json(mockBadges);
  }
} 