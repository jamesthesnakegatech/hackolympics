'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Home, Users, MapPin, ExternalLink, Calendar, Star, Wifi, Coffee } from 'lucide-react';
import Link from 'next/link';
import { PageLayout } from '@/components/ui/page-layout';

interface ExternalHouse {
  [key: string]: any; // Since it's flat JSON, we'll handle any structure
}

interface LocalHouse {
  id: string;
  name: string;
  neighborhood: string;
  description: string;
  memberCount: number;
  focusAreas: string[];
  coordinates: { lat: number; lng: number };
  address: string;
  image: string;
  amenities: string[];
  type: string;
}

type CombinedHouse = LocalHouse | (ExternalHouse & { type: string; id: string });

// Helper function to safely access properties
const getProperty = (obj: any, ...keys: string[]) => {
  for (const key of keys) {
    if (obj[key] !== undefined) return obj[key];
  }
  return undefined;
};

// Existing sample houses from your current system
const sampleHouses: LocalHouse[] = [
  {
    id: '1',
    name: 'Hacker House SOMA',
    neighborhood: 'SOMA',
    description: 'Premier AI/ML focused house in the heart of SF tech scene. Weekly demo days, 24/7 workspace, and direct connections to top VCs.',
    memberCount: 12,
    focusAreas: ['AI/ML', 'Startups', 'Deep Tech'],
    coordinates: { lat: 37.7849, lng: -122.4094 },
    address: '850 Bryant St, San Francisco, CA 94103',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    amenities: ['Co-working Space', 'High-speed Internet', 'Weekly Demo Days', 'Mentorship Program'],
    type: 'local'
  },
  {
    id: '2',
    name: 'Mission Builders',
    neighborhood: 'Mission',  
    description: 'Web3 and crypto-focused collaborative living space. Building the future of decentralized finance with daily standups and weekend hackathons.',
    memberCount: 8,
    focusAreas: ['Web3', 'DeFi', 'Blockchain'],
    coordinates: { lat: 37.7599, lng: -122.4148 },
    address: '3200 16th St, San Francisco, CA 94103',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    amenities: ['Trading Setup', 'Ethereum Node', 'Security Audits', 'Legal Support'],
    type: 'local'
  },
  {
    id: '3',
    name: 'Castro Tech Collective',
    neighborhood: 'Castro',
    description: 'Hardware and IoT innovation hub with a fully equipped lab. From wearables to smart city solutions, we build the physical layer of tech.',
    memberCount: 6,
    focusAreas: ['Hardware', 'IoT', 'Robotics'],
    coordinates: { lat: 37.7609, lng: -122.4350 },
    address: '2200 Market St, San Francisco, CA 94114',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    amenities: ['Electronics Lab', '3D Printers', 'PCB Assembly', 'Testing Equipment'],
    type: 'local'
  }
];

export default function HousesPage() {
  const [externalHouses, setExternalHouses] = useState<(ExternalHouse & { type: string; id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'local' | 'external'>('all');

  useEffect(() => {
    async function fetchExternalHouses() {
      try {
        const response = await fetch('/api/external/houses');
        if (!response.ok) {
          throw new Error('Failed to fetch external houses');
        }
        const result = await response.json();
        // The API returns { data: [...] }, so we need to access the data property
        const data = result.data || result;
        const housesArray = Array.isArray(data) ? data : [data];
        setExternalHouses(housesArray.map((house, index) => ({ ...house, type: 'external', id: `external-${index}` })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchExternalHouses();
  }, []);

  // Combine local and external houses
  const allHouses: CombinedHouse[] = [...sampleHouses, ...externalHouses];
  const filteredHouses = filter === 'all' ? allHouses : allHouses.filter(house => house.type === filter);

  if (loading) {
    return (
      <PageLayout title="SF Hacker Houses" subtitle="Discover collaborative living spaces for builders, makers, and innovators in San Francisco">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading houses...</span>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="SF Hacker Houses" subtitle="Discover collaborative living spaces for builders, makers, and innovators in San Francisco">

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-8">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' : 'border-gray-300 text-gray-600 hover:bg-purple-50'}
          >
            All Houses ({allHouses.length})
          </Button>
          <Button
            variant={filter === 'local' ? 'default' : 'outline'}
            onClick={() => setFilter('local')}
            className={filter === 'local' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' : 'border-gray-300 text-gray-600 hover:bg-purple-50'}
          >
            Verified Houses ({sampleHouses.length})
          </Button>
          <Button
            variant={filter === 'external' ? 'default' : 'outline'}
            onClick={() => setFilter('external')}
            className={filter === 'external' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' : 'border-gray-300 text-gray-600 hover:bg-purple-50'}
          >
            Community Houses ({externalHouses.length})
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{allHouses.length}</p>
                  <p className="text-gray-600 font-medium">Total Houses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {allHouses.reduce((acc, house) => acc + (getProperty(house, 'memberCount', 'members', 'capacity') || 0), 0)}
                  </p>
                  <p className="text-gray-600 font-medium">Total Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {new Set(allHouses.map(h => getProperty(h, 'neighborhood', 'location', 'area') || 'SF')).size}
                  </p>
                  <p className="text-gray-600 font-medium">Neighborhoods</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    {new Set(allHouses.flatMap(h => getProperty(h, 'focusAreas', 'focus', 'specialties') || [])).size}
                  </p>
                  <p className="text-gray-600 font-medium">Focus Areas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Card className="bg-red-50 border-red-200 mb-6">
            <CardContent className="p-6">
              <p className="text-red-600">Warning: {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Houses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHouses.map((house, index) => (
            <Card key={house.id || index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-gray-900 text-xl">
                        {getProperty(house, 'name', 'title', 'houseName') || `House ${index + 1}`}
                      </CardTitle>
                      {house.type === 'external' && (
                        <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 text-xs">
                          Community
                        </Badge>
                      )}
                      {house.type === 'local' && (
                        <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-green-200 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-gray-600">
                      {getProperty(house, 'neighborhood', 'location', 'area') || 'San Francisco'}
                    </CardDescription>
                  </div>
                  {getProperty(house, 'verified', 'featured', 'premium') && (
                    <Star className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getProperty(house, 'image') && (
                    <img 
                      src={getProperty(house, 'image')} 
                      alt={getProperty(house, 'name') || 'House'} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  
                  <p className="text-gray-600 text-sm">
                    {(() => {
                      const description = getProperty(house, 'description');
                      return description 
                        ? (description.length > 120 ? `${description.substring(0, 120)}...` : description)
                        : 'A collaborative space for builders and innovators.';
                    })()}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span>{getProperty(house, 'memberCount', 'members', 'capacity') || 'N/A'} members</span>
                    </div>
                    {getProperty(house, 'address', 'location') && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-blue-500" />
                        <span>{getProperty(house, 'neighborhood', 'area') || 'SF'}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Focus Areas */}
                  {getProperty(house, 'focusAreas', 'focus', 'specialties') && (
                    <div className="flex flex-wrap gap-1">
                      {(getProperty(house, 'focusAreas', 'focus', 'specialties') || [])
                        .slice(0, 3)
                        .map((area: string, i: number) => (
                          <Badge key={i} className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
                            {area}
                          </Badge>
                        ))}
                      {(getProperty(house, 'focusAreas', 'focus', 'specialties') || []).length > 3 && (
                        <Badge className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border-gray-300">
                          +{(getProperty(house, 'focusAreas', 'focus', 'specialties') || []).length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Amenities */}
                  {getProperty(house, 'amenities') && (
                    <div className="flex flex-wrap gap-2">
                      {(getProperty(house, 'amenities') || []).slice(0, 2).map((amenity: string, i: number) => (
                        <div key={i} className="flex items-center gap-1 text-xs text-gray-600">
                          {amenity.includes('Internet') || amenity.includes('Wifi') ? <Wifi className="h-3 w-3 text-green-500" /> : 
                           amenity.includes('Coffee') || amenity.includes('Kitchen') ? <Coffee className="h-3 w-3 text-orange-500" /> : 
                           <Home className="h-3 w-3 text-blue-500" />}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {house.type === 'local' ? (
                      <Link href={`/house/${house.id}`} className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                          View Details
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="flex-1 border-gray-300 text-gray-600 hover:bg-purple-50">
                        Contact
                      </Button>
                    )}
                    
                    {getProperty(house, 'website', 'url', 'link') && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-300 text-gray-600 hover:bg-purple-50"
                        onClick={() => window.open(getProperty(house, 'website', 'url', 'link'), '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHouses.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 col-span-full">
            <CardContent className="p-12 text-center">
              <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 text-xl font-semibold mb-2">No Houses Found</h3>
              <p className="text-gray-600">No houses match your current filter criteria.</p>
            </CardContent>
          </Card>
        )}
        
        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-purple-50">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>
    </PageLayout>
  );
} 