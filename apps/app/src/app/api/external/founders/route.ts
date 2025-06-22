import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://workflow.thinkbuddy.ai/webhook/hackathon-get-founders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch founders data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching founders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch founders data' },
      { status: 500 }
    );
  }
} 