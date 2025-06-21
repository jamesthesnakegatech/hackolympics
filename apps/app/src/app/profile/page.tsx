'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, User, Briefcase, MapPin, Globe, Twitter, Github, Linkedin, ExternalLink, Save } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  
  const [profile, setProfile] = useState({
    name: session?.user?.name || '',
    bio: '',
    location: 'San Francisco, CA',
    jobTitle: '',
    company: '',
    website: '',
    twitter: '',
    github: '',
    linkedin: '',
    partiful: '',
    luma: '',
    skills: [] as string[]
  })

  const [newSkill, setNewSkill] = useState('')

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleSave = () => {
    // TODO: Implement save to database
    console.log('Saving profile:', profile)
    alert('Profile saved! (Demo - not yet connected to database)')
  }

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Directory
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Edit Profile</h1>
            </div>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Preview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Preview</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold mx-auto mb-4">
                {profile.name?.[0] || session.user?.email?.[0] || 'U'}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {profile.name || 'Your Name'}
              </h3>
              {profile.jobTitle && profile.company && (
                <p className="text-gray-600 mb-2">{profile.jobTitle} at {profile.company}</p>
              )}
              {profile.location && (
                <p className="text-sm text-gray-500 flex items-center justify-center mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profile.location}
                </p>
              )}
              {profile.bio && (
                <p className="text-sm text-gray-600 mb-4">{profile.bio}</p>
              )}
              
              {/* Skills */}
              {profile.skills.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="space-y-2">
                {profile.partiful && (
                  <a href={profile.partiful} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-800">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Partiful Profile
                  </a>
                )}
                {profile.luma && (
                  <a href={profile.luma} target="_blank" rel="noopener noreferrer"
                     className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-800">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Luma Profile
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    placeholder="Tell the community about yourself..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5" />
                  <span>Professional Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <Input
                    value={profile.jobTitle}
                    onChange={(e) => setProfile({...profile, jobTitle: e.target.value})}
                    placeholder="Software Engineer, Product Manager, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <Input
                    value={profile.company}
                    onChange={(e) => setProfile({...profile, company: e.target.value})}
                    placeholder="OpenAI, Anthropic, etc."
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills & Interests
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      placeholder="Add a skill (React, AI/ML, etc.)"
                    />
                    <Button type="button" onClick={addSkill}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="cursor-pointer"
                             onClick={() => removeSkill(skill)}>
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Social Links</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🎉 Partiful Profile URL
                  </label>
                  <Input
                    value={profile.partiful}
                    onChange={(e) => setProfile({...profile, partiful: e.target.value})}
                    placeholder="https://partiful.com/u/yourname"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Connect your Partiful profile to show your event history
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    📅 Luma Profile URL
                  </label>
                  <Input
                    value={profile.luma}
                    onChange={(e) => setProfile({...profile, luma: e.target.value})}
                    placeholder="https://lu.ma/yourname"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Link your Luma profile to showcase events you've organized
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <Input
                      value={profile.website}
                      onChange={(e) => setProfile({...profile, website: e.target.value})}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter
                    </label>
                    <Input
                      value={profile.twitter}
                      onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                      placeholder="@yourusername"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub
                    </label>
                    <Input
                      value={profile.github}
                      onChange={(e) => setProfile({...profile, github: e.target.value})}
                      placeholder="yourusername"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <Input
                      value={profile.linkedin}
                      onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                      placeholder="linkedin.com/in/yourname"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 