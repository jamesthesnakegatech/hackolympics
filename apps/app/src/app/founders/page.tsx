'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageLayout } from '@/components/ui/page-layout';
import { Loader2, Users, MapPin, Building, Globe, Github } from 'lucide-react';

interface Founder {
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

export default function FoundersPage() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFounders() {
      try {
        const response = await fetch('/api/external/founders');
        if (!response.ok) {
          throw new Error('Failed to fetch founders');
        }
        const result = await response.json();
        // The API returns { data: [...] }, so we need to access the data property
        const data = result.data || result;
        setFounders(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchFounders();
  }, []);

  if (loading) {
    return (
      <PageLayout title="SF Hackathon Founders" subtitle="Meet the brilliant minds building the future of technology">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading founders...</span>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="SF Hackathon Founders" subtitle="Meet the brilliant minds building the future of technology">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="SF Hackathon Founders" subtitle="Meet the brilliant minds building the future of technology">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{founders.length}</p>
                <p className="text-gray-600 font-medium">Total Founders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {new Set(founders.map(f => getProperty(f, 'Employment History', 'company', 'startup', 'organization')).filter(Boolean)).size}
                </p>
                <p className="text-gray-600 font-medium">Companies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {new Set(founders.map(f => getProperty(f, 'Location', 'location', 'city')).filter(Boolean)).size}
                </p>
                <p className="text-gray-600 font-medium">Locations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Founders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {founders.map((founder, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-gray-900 text-xl">
                    {getProperty(founder, 'Full name', 'name', 'founder', 'title') || `Founder ${index + 1}`}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    {getProperty(founder, 'Headline', 'role', 'position') || 'Founder & CEO'}
                  </CardDescription>
                </div>
                {(getProperty(founder, 'Profile Picture') && founder['Profile Picture'][0]?.url) && (
                  <img 
                    src={founder['Profile Picture'][0].url} 
                    alt={getProperty(founder, 'Full name') || 'Founder'} 
                    className="w-12 h-12 rounded-full border-2 border-purple-200"
                  />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {getProperty(founder, 'Employment History', 'company', 'startup', 'organization') && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Building className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">{getProperty(founder, 'Employment History', 'company', 'startup', 'organization')}</span>
                </div>
              )}
              
              {getProperty(founder, 'Location', 'location', 'city') && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{getProperty(founder, 'Location', 'location', 'city')}</span>
                </div>
              )}

              {getProperty(founder, 'GitHub', 'website', 'url', 'link') && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Github className="h-4 w-4 text-green-500" />
                  <a 
                    href={getProperty(founder, 'GitHub', 'website', 'url', 'link')} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:text-purple-600 transition-colors"
                  >
                    View Profile
                  </a>
                </div>
              )}
              
              {getProperty(founder, 'Summary', 'description', 'bio') && (
                <p className="text-gray-600 text-sm mt-3">
                  {getProperty(founder, 'Summary', 'description', 'bio')}
                </p>
              )}

              {/* Display any tags/categories */}
              <div className="flex flex-wrap gap-2 mt-3">
                {getProperty(founder, 'Skills', 'category') && (
                  <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
                    {getProperty(founder, 'Skills', 'category')}
                  </Badge>
                )}
                {getProperty(founder, 'Industry', 'industry') && (
                  <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
                    {getProperty(founder, 'Industry', 'industry')}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {founders.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 col-span-full">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 text-xl font-semibold mb-2">No Founders Found</h3>
              <p className="text-gray-600">No founder data is currently available.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
} 