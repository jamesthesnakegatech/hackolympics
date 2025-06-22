'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Award, Star, Users, Calendar } from 'lucide-react';
import { PageLayout } from '@/components/ui/page-layout';

interface ExternalBadge {
  [key: string]: any; // Since it's flat JSON, we'll handle any structure
}

// Helper function to safely get values from flat JSON structure
function getProperty(obj: any, ...keys: string[]): any {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      return obj[key];
    }
  }
  return null;
}

// Mock badge data for when external API is not available
const mockBadges = [
  {
    id: 'mock-1',
    name: 'Hackathon Winner',
    description: 'Won first place in a major hackathon',
    category: 'Achievement',
    rarity: 'Epic',
    date: '2024-01-15',
    icon: '🏆'
  },
  {
    id: 'mock-2',
    name: 'Open Source Contributor',
    description: 'Made significant contributions to open source projects',
    category: 'Development',
    rarity: 'Rare',
    date: '2024-02-10',
    icon: '💻'
  },
  {
    id: 'mock-3',
    name: 'Community Builder',
    description: 'Helped build and grow the SF tech community',
    category: 'Community',
    rarity: 'Legendary',
    date: '2024-03-05',
    icon: '🌟'
  }
];

export default function ExternalBadgesPage() {
  const [badges, setBadges] = useState<ExternalBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBadges() {
      try {
        const response = await fetch('/api/external/badge-data');
        if (!response.ok) {
          // If external API fails, use mock data
          setBadges(mockBadges);
          setError('Using sample badge data - external API unavailable');
          return;
        }
        const result = await response.json();
        // The API returns { data: [...] }, so we need to access the data property
        const data = result.data || result;
        setBadges(Array.isArray(data) ? data : [data]);
      } catch (err) {
        // Fallback to mock data
        setBadges(mockBadges);
        setError('Using sample badge data - external API unavailable');
      } finally {
        setLoading(false);
      }
    }

    fetchBadges();
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return 'from-yellow-100 to-orange-100 text-yellow-700 border-yellow-200';
      case 'epic': return 'from-purple-100 to-pink-100 text-purple-700 border-purple-200';
      case 'rare': return 'from-blue-100 to-purple-100 text-blue-700 border-blue-200';
      case 'common': return 'from-gray-100 to-gray-200 text-gray-700 border-gray-200';
      default: return 'from-green-100 to-blue-100 text-green-700 border-green-200';
    }
  };

  if (loading) {
    return (
      <PageLayout title="Community Achievement Badges" subtitle="Discover badges earned by the SF hackathon community">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading badges...</span>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Community Achievement Badges" subtitle="Discover badges earned by the SF hackathon community">
      {error && (
        <Card className="bg-blue-50 border-blue-200 mb-6">
          <CardContent className="p-6">
            <p className="text-blue-600">ℹ️ {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{badges.length}</p>
                <p className="text-gray-600 font-medium">Total Badges</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {badges.filter(b => getProperty(b, 'rarity')?.toLowerCase() === 'legendary' || getProperty(b, 'rarity')?.toLowerCase() === 'epic').length}
                </p>
                <p className="text-gray-600 font-medium">Rare Badges</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {new Set(badges.map(b => getProperty(b, 'category', 'type'))).size}
                </p>
                <p className="text-gray-600 font-medium">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge, index) => (
          <Card key={badge.id || index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 text-4xl flex items-center justify-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                {getProperty(badge, 'icon') || '🏅'}
              </div>
              <CardTitle className="text-gray-900 text-xl">
                {getProperty(badge, 'name', 'title', 'badge') || `Badge ${index + 1}`}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {getProperty(badge, 'description') || 'Achievement badge earned in the community'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {getProperty(badge, 'date', 'earned', 'timestamp') && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Earned: {getProperty(badge, 'date', 'earned', 'timestamp')}</span>
                </div>
              )}

              {/* Badge Categories and Rarity */}
              <div className="flex flex-wrap gap-2">
                {getProperty(badge, 'category', 'type') && (
                  <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
                    {getProperty(badge, 'category', 'type')}
                  </Badge>
                )}
                {getProperty(badge, 'rarity') && (
                  <Badge className={`bg-gradient-to-r ${getRarityColor(getProperty(badge, 'rarity'))}`}>
                    {getProperty(badge, 'rarity')}
                  </Badge>
                )}
              </div>

              {/* Additional Details */}
              {getProperty(badge, 'event', 'hackathon', 'source') && (
                <div className="text-gray-600 text-sm">
                  <strong>Event:</strong> {getProperty(badge, 'event', 'hackathon', 'source')}
                </div>
              )}

              {getProperty(badge, 'criteria', 'requirements') && (
                <div className="text-gray-600 text-sm">
                  <strong>Criteria:</strong> {getProperty(badge, 'criteria', 'requirements')}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {badges.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 col-span-full">
            <CardContent className="p-12 text-center">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 text-xl font-semibold mb-2">No Badges Found</h3>
              <p className="text-gray-600">No badge data is currently available.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
} 