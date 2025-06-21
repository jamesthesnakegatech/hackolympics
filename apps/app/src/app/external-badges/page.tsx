'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Award, Trophy, Star, Calendar, Users, MapPin } from 'lucide-react';
import Link from 'next/link';

interface ExternalBadge {
  [key: string]: any; // Since it's flat JSON, we'll handle any structure
}

// Helper function to safely access properties
const getProperty = (obj: any, ...keys: string[]) => {
  for (const key of keys) {
    if (obj[key] !== undefined) return obj[key];
  }
  return undefined;
};

export default function ExternalBadgesPage() {
  const [badges, setBadges] = useState<ExternalBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBadges() {
      try {
        const response = await fetch('/api/external/badge-data');
        if (!response.ok) {
          throw new Error('Failed to fetch badge data');
        }
        const result = await response.json();
        // The API returns { data: [...] }, so we need to access the data property
        const data = result.data || result;
        setBadges(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchBadges();
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      case 'common': return 'from-gray-400 to-gray-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getBadgeIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'hackathon': return <Trophy className="h-5 w-5" />;
      case 'event': return <Calendar className="h-5 w-5" />;
      case 'community': return <Users className="h-5 w-5" />;
      case 'achievement': return <Star className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <span className="ml-2 text-white">Loading badges...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-red-900/20 border-red-500">
            <CardContent className="p-6">
              <p className="text-red-300">Error: {error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Community Badges</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Discover achievement badges from hackathons, events, and community activities
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{badges.length}</div>
                <div className="text-gray-300">Total Badges</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {badges.filter(b => getProperty(b, 'rarity')?.toLowerCase() === 'legendary').length}
                </div>
                <div className="text-gray-300">Legendary</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">
                  {badges.filter(b => getProperty(b, 'rarity')?.toLowerCase() === 'epic').length}
                </div>
                <div className="text-gray-300">Epic</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {new Set(badges.map(b => getProperty(b, 'category', 'type', 'eventType'))).size}
                </div>
                <div className="text-gray-300">Categories</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-gray-700 hover:bg-white/15 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${getRarityColor(getProperty(badge, 'rarity', 'tier', 'level'))}`}>
                    {getBadgeIcon(getProperty(badge, 'category', 'type', 'eventType'))}
                  </div>
                  {getProperty(badge, 'emoji') && (
                    <div className="text-2xl">{getProperty(badge, 'emoji')}</div>
                  )}
                </div>
                <CardTitle className="text-white text-lg group-hover:text-purple-300 transition-colors">
                  {getProperty(badge, 'name', 'title', 'badgeName') || `Badge ${index + 1}`}
                </CardTitle>
                <CardDescription className="text-gray-300 text-sm">
                  {getProperty(badge, 'description', 'tagline', 'subtitle')?.substring(0, 100) || 'Achievement badge'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Event/Source Info */}
                  {getProperty(badge, 'event', 'source', 'hackathon') && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      <span className="text-sm">{getProperty(badge, 'event', 'source', 'hackathon')}</span>
                    </div>
                  )}
                  
                  {/* Location */}
                  {getProperty(badge, 'location', 'venue', 'city') && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">{getProperty(badge, 'location', 'venue', 'city')}</span>
                    </div>
                  )}
                  
                  {/* Date */}
                  {getProperty(badge, 'date', 'dateEarned', 'timestamp') && (
                    <div className="text-gray-400 text-xs">
                      {new Date(getProperty(badge, 'date', 'dateEarned', 'timestamp')).toLocaleDateString()}
                    </div>
                  )}
                  
                  {/* Rarity and Category */}
                  <div className="flex flex-wrap gap-2">
                    {getProperty(badge, 'rarity', 'tier', 'level') && (
                      <Badge 
                        variant="secondary" 
                        className={`bg-gradient-to-r ${getRarityColor(getProperty(badge, 'rarity', 'tier', 'level'))} text-white border-0 text-xs`}
                      >
                        {getProperty(badge, 'rarity', 'tier', 'level')}
                      </Badge>
                    )}
                    {getProperty(badge, 'category', 'type', 'eventType') && (
                      <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-300">
                        {getProperty(badge, 'category', 'type', 'eventType')}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Additional Info */}
                  {getProperty(badge, 'criteria', 'requirement', 'achievement') && (
                    <div className="text-gray-400 text-xs">
                      <strong>Criteria:</strong> {getProperty(badge, 'criteria', 'requirement', 'achievement')}
                    </div>
                  )}
                  
                  {/* Points/Score */}
                  {getProperty(badge, 'points', 'score', 'value') && (
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Star className="h-3 w-3" />
                      <span>{getProperty(badge, 'points', 'score', 'value')} points</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {badges.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
            <CardContent className="p-12 text-center">
              <Award className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">No Badges Found</h3>
              <p className="text-gray-400">No badge data is currently available.</p>
            </CardContent>
          </Card>
        )}
        
        {/* Navigation */}
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/badges">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-white/10">
              ← View Your Badges
            </Button>
          </Link>
          <Link href="/badges/create">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Create New Badge
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 