'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomBadge } from '@/components/ui/custom-badge';
import { PageLayout } from '@/components/ui/page-layout';
import { Loader2, Users, MapPin, Building, Globe, Github, Twitter, Linkedin, Mail, Calendar, Award, Briefcase, Star } from 'lucide-react';
import Link from 'next/link';

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

// Helper function to get URL from various possible fields
function getUrl(obj: any, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = obj[key];
    if (value && typeof value === 'string') {
      // Check if it's already a URL
      if (value.startsWith('http')) return value;
      // Try to construct URL for common platforms
      if (key.toLowerCase().includes('github')) return `https://github.com/${value.replace('@', '')}`;
      if (key.toLowerCase().includes('twitter')) return `https://twitter.com/${value.replace('@', '')}`;
      if (key.toLowerCase().includes('linkedin')) return `https://linkedin.com/in/${value}`;
    }
  }
  return null;
}

// Function to generate achievement badges based on founder data
function generateAchievementBadges(founder: any): Array<string> {
  const badges = [];
  
  // Check for founder status
  const company = getProperty(founder, 'Employment History', 'company', 'startup', 'organization');
  const role = getProperty(founder, 'Headline', 'role', 'position');
  
  if (role && (role.toLowerCase().includes('founder') || role.toLowerCase().includes('ceo'))) {
    badges.push('founder');
  }
  
  if (role && role.toLowerCase().includes('engineer')) {
    badges.push('open-source-contributor');
  }
  
  if (company && ['Y Combinator', 'YC', 'Combinator'].some(yc => company.includes(yc))) {
    badges.push('ai-pioneer');
  }
  
  if (getProperty(founder, 'GitHub', 'github')) {
    badges.push('open-source-contributor');
  }
  
  const location = getProperty(founder, 'Location', 'location', 'city');
  if (location && location.toLowerCase().includes('san francisco')) {
    badges.push('community-builder');
  }
  
  return badges;
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
        {founders.map((founder, index) => {
          const badges = generateAchievementBadges(founder);
          const githubUrl = getUrl(founder, 'GitHub', 'github');
          const twitterUrl = getUrl(founder, 'Twitter', 'twitter');
          const linkedinUrl = getUrl(founder, 'LinkedIn', 'linkedin');
          const websiteUrl = getUrl(founder, 'website', 'url', 'link');
          
          return (
            <Card key={index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <CardTitle className="text-gray-900 text-xl flex items-center space-x-2">
                      <span>{getProperty(founder, 'Full name', 'name', 'founder', 'title') || `Founder ${index + 1}`}</span>
                      {badges.some(b => b === 'founder') && <Star className="w-5 h-5 text-yellow-500" />}
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1 font-medium">
                      {getProperty(founder, 'Headline', 'role', 'position') || 'Founder & CEO'}
                    </CardDescription>
                  </div>
                  {(getProperty(founder, 'Profile Picture') && founder['Profile Picture'][0]?.url) && (
                    <img 
                      src={founder['Profile Picture'][0].url} 
                      alt={getProperty(founder, 'Full name') || 'Founder'} 
                      className="w-16 h-16 rounded-full border-3 border-white shadow-lg"
                    />
                  )}
                </div>

                {/* Achievement Badges */}
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {badges.map((badge, badgeIndex) => (
                      <CustomBadge
                        key={badgeIndex}
                        badgeId={badge}
                        size="sm"
                        showLabel={false}
                      />
                    ))}
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Professional Info */}
                {getProperty(founder, 'Employment History', 'company', 'startup', 'organization') && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Company</p>
                      <p className="font-semibold text-gray-900">{getProperty(founder, 'Employment History', 'company', 'startup', 'organization')}</p>
                    </div>
                  </div>
                )}
                
                {getProperty(founder, 'Location', 'location', 'city') && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-900">{getProperty(founder, 'Location', 'location', 'city')}</p>
                    </div>
                  </div>
                )}

                {/* Bio/Summary */}
                {getProperty(founder, 'Summary', 'description', 'bio') && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {getProperty(founder, 'Summary', 'description', 'bio')}
                    </p>
                  </div>
                )}

                {/* Skills & Categories */}
                <div className="flex flex-wrap gap-2">
                  {getProperty(founder, 'Skills', 'category') && (
                    <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
                      <Award className="w-3 h-3 mr-1" />
                      {getProperty(founder, 'Skills', 'category')}
                    </Badge>
                  )}
                  {getProperty(founder, 'Industry', 'industry') && (
                    <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {getProperty(founder, 'Industry', 'industry')}
                    </Badge>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    {githubUrl && (
                      <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                        <div className="w-8 h-8 bg-gray-900 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                          <Github className="h-4 w-4 text-white" />
                        </div>
                      </Link>
                    )}
                    {twitterUrl && (
                      <Link href={twitterUrl} target="_blank" rel="noopener noreferrer">
                        <div className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                          <Twitter className="h-4 w-4 text-white" />
                        </div>
                      </Link>
                    )}
                    {linkedinUrl && (
                      <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <div className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
                          <Linkedin className="h-4 w-4 text-white" />
                        </div>
                      </Link>
                    )}
                    {websiteUrl && (
                      <Link href={websiteUrl} target="_blank" rel="noopener noreferrer">
                        <div className="w-8 h-8 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors">
                          <Globe className="h-4 w-4 text-white" />
                        </div>
                      </Link>
                    )}
                  </div>
                  
                  {/* Contact Button */}
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {founders.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 col-span-full">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No founders found</h3>
              <p className="text-gray-600">Check back later for founder updates!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
} 