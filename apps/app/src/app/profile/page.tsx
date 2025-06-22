'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/ui/navigation'
import { User, Briefcase, Globe, Save, MapPin, ExternalLink } from 'lucide-react'
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navigation 
        title="✨ Edit Your Profile"
        subtitle="Complete your profile to connect with amazing hacker houses and the SF tech community"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Save Button - Floating */}
        <div className="mb-6 text-center">
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-xl"
            size="lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Profile ✨
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Preview */}
          <Card className="lg:col-span-1 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Profile Preview 👀
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                {profile.name?.[0] || session.user?.email?.[0] || 'U'}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {profile.name || 'Your Name'}
              </h3>
              {profile.jobTitle && profile.company && (
                <p className="text-gray-600 mb-2 font-medium">{profile.jobTitle} at {profile.company}</p>
              )}
              {profile.location && (
                <p className="text-sm text-gray-500 flex items-center justify-center mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profile.location}
                </p>
              )}
              {profile.bio && (
                <p className="text-sm text-gray-600 mb-4 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">{profile.bio}</p>
              )}
              
              {/* Skills */}
              {profile.skills.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 hover:from-purple-200 hover:to-pink-200">
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
                     className="flex items-center justify-center text-sm text-purple-600 hover:text-purple-800 font-medium">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    🎉 Partiful Profile
                  </a>
                )}
                {profile.luma && (
                  <a href={profile.luma} target="_blank" rel="noopener noreferrer"
                     className="flex items-center justify-center text-sm text-purple-600 hover:text-purple-800 font-medium">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    📅 Luma Profile
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    placeholder="Your full name"
                    className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    className="w-full min-h-[100px] px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    placeholder="Tell the community about yourself... What are you building? What excites you? 🚀"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <Input
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    placeholder="San Francisco, CA"
                    className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  <Briefcase className="w-5 h-5 text-green-600" />
                  <span>Professional Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Job Title
                    </label>
                    <Input
                      value={profile.jobTitle}
                      onChange={(e) => setProfile({...profile, jobTitle: e.target.value})}
                      placeholder="Software Engineer, Product Manager, etc."
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company
                    </label>
                    <Input
                      value={profile.company}
                      onChange={(e) => setProfile({...profile, company: e.target.value})}
                      placeholder="OpenAI, Anthropic, etc."
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Skills & Interests
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      placeholder="Add a skill (React, AI/ML, Web3, etc.)"
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <Button 
                      type="button" 
                      onClick={addSkill}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge 
                        key={skill} 
                        className="cursor-pointer bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 hover:from-purple-200 hover:to-pink-200"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                  {profile.skills.length === 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Add skills to help others find you! Try: JavaScript, Python, React, AI/ML, Blockchain, etc.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <span>Social Links</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🎉 Partiful Profile URL
                    </label>
                    <Input
                      value={profile.partiful}
                      onChange={(e) => setProfile({...profile, partiful: e.target.value})}
                      placeholder="https://partiful.com/u/yourname"
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Connect your Partiful profile to show your event history
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📅 Luma Profile URL
                    </label>
                    <Input
                      value={profile.luma}
                      onChange={(e) => setProfile({...profile, luma: e.target.value})}
                      placeholder="https://lu.ma/yourname"
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Link your Luma profile to showcase events you've organized
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🌐 Website
                    </label>
                    <Input
                      value={profile.website}
                      onChange={(e) => setProfile({...profile, website: e.target.value})}
                      placeholder="https://yourwebsite.com"
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🐦 Twitter
                    </label>
                    <Input
                      value={profile.twitter}
                      onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                      placeholder="@yourusername"
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💻 GitHub
                    </label>
                    <Input
                      value={profile.github}
                      onChange={(e) => setProfile({...profile, github: e.target.value})}
                      placeholder="yourusername"
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💼 LinkedIn
                    </label>
                    <Input
                      value={profile.linkedin}
                      onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                      placeholder="linkedin.com/in/yourname"
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
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