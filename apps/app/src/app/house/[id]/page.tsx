'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, MapPin, Users, Calendar, MessageCircle, Heart, Share, 
  ExternalLink, Instagram, Twitter, Linkedin, Globe, Github,
  Star, Award, Coffee, Zap, Code, Rocket, Brain, Sparkles, Trophy, Shield
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

export default function HouseDetailPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const houseId = params.id as string

  // Extended sample data with more details
  const sampleHouses = {
    '1': {
      id: '1',
      name: 'Hacker House SOMA',
      neighborhood: 'SOMA',
      tagline: 'Where AI Dreams Come to Life ✨',
      description: 'The premier AI/ML hacker house in the heart of SF\'s tech scene. We\'re building the future of artificial intelligence, one late-night coding session at a time.',
      longDescription: 'Welcome to the most vibrant AI/ML community in San Francisco! Our house is where brilliant minds gather to push the boundaries of what\'s possible with artificial intelligence. From early morning coffee chats about neural architectures to late-night hackathons that birth the next unicorn, we\'re all about that collaborative energy. 🚀',
      memberCount: 8,
      focusAreas: ['AI/ML', 'Startups', 'Deep Learning', 'Computer Vision'],
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&h=200&fit=crop'
      ],
      amenities: ['High-speed WiFi', 'GPU Clusters', 'Standing Desks', 'Coffee Bar', '3D Printer', 'Whiteboard Walls'],
      vibe: 'Intense but fun, collaborative, late-night energy',
      founded: '2023',
      monthlyRent: '$1,800',
      location: {
        address: '123 Startup St, SOMA, SF',
        coordinates: { lat: 37.7749, lng: -122.4094 }
      },
      socialMedia: {
        instagram: '@hackerhousesoma',
        twitter: '@soma_hackers',
        website: 'hackersoma.com'
      },
      members: [
        { 
          id: '1',
          name: 'Alex Chen', 
          title: 'ML Engineer', 
          company: 'OpenAI', 
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          role: 'Founder',
          joinedDate: '2023-01',
          bio: 'Building the future of language models. Previously at Google Brain.',
          skills: ['PyTorch', 'Transformers', 'MLOps'],
          badges: ['ai-pioneer', 'hackathon-winner', 'open-source-contributor'],
          partifulUrl: 'partiful.com/alex',
          social: { twitter: '@alexchen_ai', github: 'alexchen' }
        },
        { 
          id: '2',
          name: 'Sarah Kim', 
          title: 'Product Manager', 
          company: 'Anthropic', 
          image: 'https://images.unsplash.com/photo-1494790108755-2616b885e592?w=100&h=100&fit=crop&crop=face',
          role: 'Resident',
          joinedDate: '2023-03',
          bio: 'Making AI safe and beneficial for everyone. Love organizing house events!',
          skills: ['Product Strategy', 'AI Safety', 'Community Building'],
          badges: ['community-builder', 'product-expert', 'safety-advocate'],
          partifulUrl: 'partiful.com/sarah',
          social: { linkedin: 'sarahkim', instagram: '@sarahk_ai' }
        },
        { 
          id: '3',
          name: 'Mike Torres', 
          title: 'Founder', 
          company: 'Stealth AI', 
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          role: 'Resident',
          joinedDate: '2023-02',
          bio: 'Currently in stealth mode building the next big thing in AI. Always down for late-night brainstorming sessions.',
          skills: ['Entrepreneurship', 'Full-Stack', 'AI Research'],
          badges: ['founder', 'stealth-mode', 'night-owl'],
          partifulUrl: 'partiful.com/mike',
          social: { twitter: '@miket_builds' }
        }
      ],
      recentEvents: [
        { name: 'AI Paper Reading Club', date: '2024-01-15', attendees: 12 },
        { name: 'Weekend Hackathon', date: '2024-01-08', attendees: 8 },
        { name: 'House Dinner & Demo Night', date: '2024-01-01', attendees: 15 }
      ]
    }
  }

  const house = sampleHouses[houseId as keyof typeof sampleHouses]

  if (!house) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">House not found 😔</h1>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Back to Directory
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const badgeIcons = {
    'ai-pioneer': Brain,
    'hackathon-winner': Trophy,
    'open-source-contributor': Github,
    'community-builder': Users,
    'product-expert': Rocket,
    'safety-advocate': Shield,
    'founder': Star,
    'stealth-mode': Zap,
    'night-owl': Coffee
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-purple-100">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Directory</span>
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="border-pink-300 hover:bg-pink-50">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="border-purple-300 hover:bg-purple-50">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-8 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{house.name}</h1>
                <p className="text-xl opacity-90 mb-4">{house.tagline}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{house.neighborhood}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{house.memberCount} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Est. {house.founded}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">${house.monthlyRent}</div>
                <div className="text-sm opacity-80">per month</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {house.focusAreas.map((area, index) => (
                <Badge key={index} className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  {area}
                </Badge>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message House
              </Button>
              <Button variant="outline" className="border-white/50 text-white hover:bg-white/10">
                Schedule Visit
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  About This House ✨
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{house.longDescription}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-purple-600">Vibe:</strong>
                    <p className="text-gray-600">{house.vibe}</p>
                  </div>
                  <div>
                    <strong className="text-purple-600">Founded:</strong>
                    <p className="text-gray-600">{house.founded}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Members */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Meet the Squad 👥
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {house.members.map((member) => (
                    <div key={member.id} className="p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                      <div className="flex items-start space-x-4">
                                                 <div className="w-16 h-16 ring-4 ring-purple-200 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center">
                           <img src={member.image} alt={member.name} className="w-full h-full object-cover" 
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling!.classList.remove('hidden');
                                }} />
                           <div className="hidden text-white font-bold text-lg">
                             {member.name.split(' ').map(n => n[0]).join('')}
                           </div>
                         </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                              <p className="text-purple-600 font-medium">{member.title} at {member.company}</p>
                              <Badge variant="outline" className="mt-1 border-purple-300 text-purple-700">
                                {member.role}
                              </Badge>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                              Joined {member.joinedDate}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{member.bio}</p>
                          
                          {/* Skills */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {member.skills.map((skill, index) => (
                              <Badge key={index} className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          
                          {/* Badges */}
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-sm font-medium text-gray-700">Badges:</span>
                            {member.badges.map((badge, index) => {
                              const IconComponent = badgeIcons[badge as keyof typeof badgeIcons] || Award
                              return (
                                <div key={index} className="flex items-center space-x-1 bg-gradient-to-r from-orange-100 to-pink-100 px-2 py-1 rounded-full">
                                  <IconComponent className="w-4 h-4 text-orange-600" />
                                  <span className="text-xs font-medium text-orange-700 capitalize">
                                    {badge.replace('-', ' ')}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                          
                          {/* Social Links */}
                          <div className="flex items-center space-x-3">
                            {member.partifulUrl && (
                              <a href={`https://${member.partifulUrl}`} target="_blank" rel="noopener noreferrer"
                                 className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-800">
                                <Sparkles className="w-4 h-4" />
                                <span>Partiful</span>
                              </a>
                            )}
                            {member.social.twitter && (
                              <a href={`https://twitter.com/${member.social.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                                 className="text-blue-500 hover:text-blue-700">
                                <Twitter className="w-4 h-4" />
                              </a>
                            )}
                            {member.social.github && (
                              <a href={`https://github.com/${member.social.github}`} target="_blank" rel="noopener noreferrer"
                                 className="text-gray-700 hover:text-gray-900">
                                <Github className="w-4 h-4" />
                              </a>
                            )}
                            {member.social.linkedin && (
                              <a href={`https://linkedin.com/in/${member.social.linkedin}`} target="_blank" rel="noopener noreferrer"
                                 className="text-blue-600 hover:text-blue-800">
                                <Linkedin className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Recent House Events 🎉
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {house.recentEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                      <div>
                        <h4 className="font-semibold text-gray-900">{event.name}</h4>
                        <p className="text-sm text-blue-600">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">{event.attendees}</div>
                        <div className="text-xs text-gray-500">attendees</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-purple-600">House Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong className="text-gray-700">Address:</strong>
                  <p className="text-gray-600">{house.location.address}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Monthly Rent:</strong>
                  <p className="text-2xl font-bold text-green-600">${house.monthlyRent}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Amenities:</strong>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {house.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-gray-300">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-purple-600">Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {house.socialMedia.website && (
                    <a href={`https://${house.socialMedia.website}`} target="_blank" rel="noopener noreferrer"
                       className="flex items-center space-x-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Globe className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{house.socialMedia.website}</span>
                    </a>
                  )}
                  {house.socialMedia.instagram && (
                    <a href={`https://instagram.com/${house.socialMedia.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                       className="flex items-center space-x-2 p-3 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors">
                      <Instagram className="w-5 h-5 text-pink-600" />
                      <span className="font-medium">{house.socialMedia.instagram}</span>
                    </a>
                  )}
                  {house.socialMedia.twitter && (
                    <a href={`https://twitter.com/${house.socialMedia.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                       className="flex items-center space-x-2 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                      <Twitter className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{house.socialMedia.twitter}</span>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-purple-600">House Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {house.gallery.map((photo, index) => (
                    <img key={index} src={photo} alt={`House photo ${index + 1}`} 
                         className="rounded-lg aspect-square object-cover hover:scale-105 transition-transform cursor-pointer" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 