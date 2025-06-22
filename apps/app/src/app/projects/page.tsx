'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Code, ExternalLink, Github, Calendar, Award } from 'lucide-react';
import { PageLayout } from '@/components/ui/page-layout';

interface Project {
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/external/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const result = await response.json();
        // The API returns { data: [...] }, so we need to access the data property
        const data = result.data || result;
        setProjects(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <PageLayout title="Hackathon Projects" subtitle="Discover innovative projects built by the SF tech community">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading projects...</span>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Hackathon Projects" subtitle="Discover innovative projects built by the SF tech community">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Hackathon Projects" subtitle="Discover innovative projects built by the SF tech community">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{projects.length}</p>
                <p className="text-gray-600 font-medium">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {projects.filter(p => getProperty(p, 'Awards', 'award', 'prize')).length}
                </p>
                <p className="text-gray-600 font-medium">Award Winners</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Github className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {projects.filter(p => getProperty(p, 'GitHub', 'github', 'repository', 'repo')).length}
                </p>
                <p className="text-gray-600 font-medium">Open Source</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-gray-900 text-xl">
                    {getProperty(project, 'Project Name', 'name', 'title', 'project') || `Project ${index + 1}`}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    {getProperty(project, 'tagline', 'subtitle') || getProperty(project, 'Description')?.substring(0, 80)}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {getProperty(project, 'Description') && (
                <p className="text-gray-600 text-sm">
                  {getProperty(project, 'Description').length > 150 
                    ? `${getProperty(project, 'Description').substring(0, 150)}...` 
                    : getProperty(project, 'Description')}
                </p>
              )}

              {(getProperty(project, 'Start Date') || getProperty(project, 'End Date')) && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">
                    {getProperty(project, 'Start Date')} {getProperty(project, 'End Date') && `- ${getProperty(project, 'End Date')}`}
                    {getProperty(project, 'Duration') && ` (${getProperty(project, 'Duration')} days)`}
                  </span>
                </div>
              )}

              {getProperty(project, 'Founder') && (
                <div className="text-gray-600 text-sm">
                  <strong>Founder:</strong> {Array.isArray(getProperty(project, 'Founder')) ? getProperty(project, 'Founder').join(', ') : getProperty(project, 'Founder')}
                </div>
              )}

              {/* Tech Stack or Awards */}
              <div className="flex flex-wrap gap-2 mt-3">
                {getProperty(project, 'Tech Stack', 'technologies', 'stack') && (
                  <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
                    {getProperty(project, 'Tech Stack', 'technologies', 'stack')}
                  </Badge>
                )}
                {getProperty(project, 'Awards', 'award', 'prize') && (
                  <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-200">
                    🏆 {getProperty(project, 'Awards', 'award', 'prize')}
                  </Badge>
                )}
                {getProperty(project, 'Category', 'category') && (
                  <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-green-200">
                    {getProperty(project, 'Category', 'category')}
                  </Badge>
                )}
              </div>

              {/* Links */}
              <div className="flex gap-2 mt-4">
                {getProperty(project, 'GitHub', 'github', 'repository', 'repo') && (
                  <a 
                    href={getProperty(project, 'GitHub', 'github', 'repository', 'repo')} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    Code
                  </a>
                )}
                {getProperty(project, 'Demo', 'demo', 'live', 'website') && (
                  <a 
                    href={getProperty(project, 'Demo', 'demo', 'live', 'website')} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Demo
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {projects.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 col-span-full">
            <CardContent className="p-12 text-center">
              <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 text-xl font-semibold mb-2">No Projects Found</h3>
              <p className="text-gray-600">No project data is currently available.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
} 