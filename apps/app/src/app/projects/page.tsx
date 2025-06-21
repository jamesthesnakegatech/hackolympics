'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Code, ExternalLink, Github, Calendar, Award } from 'lucide-react';

interface Project {
  [key: string]: any; // Since it's flat JSON, we'll handle any structure
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <span className="ml-2 text-white">Loading projects...</span>
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
            <Code className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Hackathon Projects</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Innovative projects built by SF's finest developers and creators
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{projects.length}</div>
                <div className="text-gray-300">Total Projects</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {new Set(projects.map(p => p.hackathon || p.event || p.competition)).size}
                </div>
                <div className="text-gray-300">Hackathons</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {projects.filter(p => p.winner || p.award || p.prize).length}
                </div>
                <div className="text-gray-300">Winners</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">
                  {new Set(projects.map(p => p.category || p.track || p.theme)).size}
                </div>
                <div className="text-gray-300">Categories</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-gray-700 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-xl">
                      {project['Project Name'] || project.name || project.title || project.project || `Project ${index + 1}`}
                    </CardTitle>
                    <CardDescription className="text-gray-300 mt-1">
                      {project.tagline || project.subtitle || project.Description?.substring(0, 80)}
                    </CardDescription>
                  </div>
                  {(project.winner || project.award || project.prize) && (
                    <Award className="h-6 w-6 text-yellow-400 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.Description && (
                    <p className="text-gray-300 text-sm">
                      {project.Description.length > 150 
                        ? `${project.Description.substring(0, 150)}...` 
                        : project.Description}
                    </p>
                  )}
                  
                  {(project['Start Date'] || project['End Date']) && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      <span className="text-sm">
                        {project['Start Date']} {project['End Date'] && `- ${project['End Date']}`}
                        {project.Duration && ` (${project.Duration} days)`}
                      </span>
                    </div>
                  )}
                  
                  {project.Founder && (
                    <div className="text-gray-300 text-sm">
                      <strong>Founder:</strong> {Array.isArray(project.Founder) ? project.Founder.join(', ') : project.Founder}
                    </div>
                  )}
                  
                  {/* Tech Stack */}
                  {(project.tech || project.stack || project.technologies) && (
                    <div className="flex flex-wrap gap-1">
                      {(project.tech || project.stack || project.technologies)
                        .split(',')
                        .map((tech: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs bg-gray-800 text-gray-300">
                            {tech.trim()}
                          </Badge>
                        ))}
                    </div>
                  )}
                  
                  {/* Categories and Awards */}
                  <div className="flex flex-wrap gap-2">
                    {project.category && (
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                        {project.category}
                      </Badge>
                    )}
                    {project.track && (
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                        {project.track}
                      </Badge>
                    )}
                    {(project.winner || project.award || project.prize) && (
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                        {project.winner || project.award || project.prize}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Links */}
                  <div className="flex gap-3 pt-2">
                    {(project.github || project.repo || project.code) && (
                      <a 
                        href={project.github || project.repo || project.code} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-300 hover:text-purple-400 transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        <span className="text-sm">Code</span>
                      </a>
                    )}
                    {(project.demo || project.live || project.url) && (
                      <a 
                        href={project.demo || project.live || project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-300 hover:text-blue-400 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-sm">Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
            <CardContent className="p-12 text-center">
              <Code className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">No Projects Found</h3>
              <p className="text-gray-400">No project data is currently available.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 