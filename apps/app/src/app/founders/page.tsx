'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, MapPin, Building, Globe } from 'lucide-react';

interface Founder {
  [key: string]: any; // Since it's flat JSON, we'll handle any structure
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <span className="ml-2 text-white">Loading founders...</span>
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
            <Users className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">SF Hackathon Founders</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Discover the brilliant minds building the future of tech in San Francisco
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{founders.length}</div>
                <div className="text-gray-300">Total Founders</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {new Set(founders.map(f => f.company || f.startup || f.organization)).size}
                </div>
                <div className="text-gray-300">Companies</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {new Set(founders.map(f => f.location || f.city || 'SF')).size}
                </div>
                <div className="text-gray-300">Locations</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {founders.map((founder, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-gray-700 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-xl">
                      {founder['Full name'] || founder.name || founder.founder || founder.title || `Founder ${index + 1}`}
                    </CardTitle>
                    <CardDescription className="text-gray-300 mt-1">
                      {founder.Headline || founder.role || founder.position || 'Founder & CEO'}
                    </CardDescription>
                  </div>
                  {(founder['Profile Picture'] && founder['Profile Picture'][0]?.url) && (
                    <img 
                      src={founder['Profile Picture'][0].url} 
                      alt={founder['Full name'] || 'Founder'} 
                      className="w-12 h-12 rounded-full border-2 border-purple-400"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(founder['Employment History'] || founder.company || founder.startup || founder.organization) && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Building className="h-4 w-4 text-purple-400" />
                      <span className="text-sm">{founder['Employment History'] || founder.company || founder.startup || founder.organization}</span>
                    </div>
                  )}
                  
                  {(founder['Hacker House Location'] && founder['Hacker House Location'][0]) && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">{founder['Hacker House Location'][0]}</span>
                    </div>
                  )}
                  
                  {(founder.GitHub || founder.LinkedIn || founder.Twitter) && (
                    <div className="flex gap-3 text-gray-300">
                      {founder.GitHub && (
                        <a href={founder.GitHub} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                      {founder.LinkedIn && (
                        <a href={founder.LinkedIn} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                      {founder.Twitter && (
                        <a href={founder.Twitter} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                  
                  {founder.Description && (
                    <p className="text-gray-300 text-sm mt-3">
                      {founder.Description}
                    </p>
                  )}
                  
                  {/* Display any tags/categories */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {founder['Skills Primary'] && (
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                        Skills: {founder['Skills Primary']}
                      </Badge>
                    )}
                    {founder.Education && (
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                        {founder.Education}
                      </Badge>
                    )}
                    {founder['Total Projects'] > 0 && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                        {founder['Total Projects']} Projects
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {founders.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">No Founders Found</h3>
              <p className="text-gray-400">No founder data is currently available.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 