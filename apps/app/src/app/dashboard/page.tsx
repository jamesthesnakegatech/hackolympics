'use client'

import { useSession, signIn } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, Users, MapPin, ExternalLink, Calendar, Map, List, Home, LogIn, Edit } from 'lucide-react'
import { Navigation } from '@/components/ui/navigation'
import Link from 'next/link'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import { useState, useEffect, useRef } from 'react'

// Enhanced hacker houses data with real SF coordinates
const sampleHouses = [
  {
    id: '1',
    name: 'Hacker House SOMA',
    neighborhood: 'SOMA',
    description: 'Premier AI/ML focused house in the heart of SF tech scene. Weekly demo days, 24/7 workspace, and direct connections to top VCs.',
    memberCount: 12,
    focusAreas: ['AI/ML', 'Startups', 'Deep Tech'],
    coordinates: { lat: 37.7849, lng: -122.4094 }, // SOMA coordinates
    address: '850 Bryant St, San Francisco, CA 94103',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    amenities: ['Co-working Space', 'High-speed Internet', 'Weekly Demo Days', 'Mentorship Program'],
    members: [
      { name: 'Alex Chen', title: 'ML Engineer', company: 'OpenAI', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
      { name: 'Sarah Kim', title: 'Product Manager', company: 'Anthropic', image: 'https://images.unsplash.com/photo-1494790108755-2616b885e592?w=40&h=40&fit=crop&crop=face' },
      { name: 'Mike Torres', title: 'Founder', company: 'Stealth AI', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
      { name: 'Emma Rodriguez', title: 'Research Scientist', company: 'Meta', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' }
    ]
  },
  {
    id: '2',
    name: 'Mission Builders',
    neighborhood: 'Mission',  
    description: 'Web3 and crypto-focused collaborative living space. Building the future of decentralized finance with daily standups and weekend hackathons.',
    memberCount: 8,
    focusAreas: ['Web3', 'DeFi', 'Blockchain'],
    coordinates: { lat: 37.7599, lng: -122.4148 }, // Mission coordinates
    address: '3200 16th St, San Francisco, CA 94103',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    amenities: ['Trading Setup', 'Ethereum Node', 'Security Audits', 'Legal Support'],
    members: [
      { name: 'Jamie Rodriguez', title: 'Smart Contract Dev', company: 'Uniswap', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face' },
      { name: 'Emma Liu', title: 'Protocol Engineer', company: 'Coinbase', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
      { name: 'David Chen', title: 'DeFi Researcher', company: 'Compound', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=40&h=40&fit=crop&crop=face' }
    ]
  },
  {
    id: '3',
    name: 'Castro Tech Collective',
    neighborhood: 'Castro',
    description: 'Hardware and IoT innovation hub with a fully equipped lab. From wearables to smart city solutions, we build the physical layer of tech.',
    memberCount: 6,
    focusAreas: ['Hardware', 'IoT', 'Robotics'],
    coordinates: { lat: 37.7609, lng: -122.4350 }, // Castro coordinates
    address: '2200 Market St, San Francisco, CA 94114',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    amenities: ['Electronics Lab', '3D Printers', 'PCB Assembly', 'Testing Equipment'],
    members: [
      { name: 'David Park', title: 'Hardware Engineer', company: 'Apple', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=40&h=40&fit=crop&crop=face' },
      { name: 'Lisa Wang', title: 'Robotics Engineer', company: 'Boston Dynamics', image: 'https://images.unsplash.com/photo-1494790108755-2616b885e592?w=40&h=40&fit=crop&crop=face' }
    ]
  },
  {
    id: '4',
    name: 'Marina Code House',
    neighborhood: 'Marina',
    description: 'Full-stack development house with ocean views. Focus on scalable systems, cloud architecture, and modern web technologies.',
    memberCount: 10,
    focusAreas: ['Full-Stack', 'Cloud', 'DevOps'],
    coordinates: { lat: 37.8021, lng: -122.4086 }, // Marina coordinates
    address: '1800 Lombard St, San Francisco, CA 94123',
    image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400&h=300&fit=crop',
    amenities: ['Ocean Views', 'Kubernetes Cluster', 'Multi-Cloud Setup', 'Pair Programming Stations'],
    members: [
      { name: 'Ryan Kim', title: 'Staff Engineer', company: 'Stripe', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
      { name: 'Sophia Martinez', title: 'DevOps Engineer', company: 'Datadog', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
      { name: 'Kevin Zhang', title: 'Solutions Architect', company: 'AWS', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' }
    ]
  },
  {
    id: '5',
    name: 'Pac Heights Product House',
    neighborhood: 'Pacific Heights',
    description: 'Product-focused house where designers and PMs collaborate. We ship consumer products that millions of people use daily.',
    memberCount: 7,
    focusAreas: ['Product Design', 'UX/UI', 'Consumer Tech'],
    coordinates: { lat: 37.7886, lng: -122.4324 }, // Pacific Heights coordinates
    address: '2400 Pacific Ave, San Francisco, CA 94115',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    amenities: ['Design Studio', 'User Testing Lab', 'Prototyping Tools', 'Product Library'],
    members: [
      { name: 'Maya Patel', title: 'Senior Designer', company: 'Figma', image: 'https://images.unsplash.com/photo-1494790108755-2616b885e592?w=40&h=40&fit=crop&crop=face' },
      { name: 'James Wilson', title: 'Product Manager', company: 'Notion', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' }
    ]
  }
]

type HouseType = typeof sampleHouses[0]

// Google Maps Component
function GoogleMapComponent({ houses, onHouseSelect }: { houses: HouseType[], onHouseSelect: (house: HouseType) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map>()
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new google.maps.Map(ref.current, {
        center: { lat: 37.7749, lng: -122.4194 }, // SF center
        zoom: 13,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      })
      setMap(newMap)
    }
  }, [ref, map])

  useEffect(() => {
    if (map) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null))
      
      // Create new markers
      const newMarkers = houses.map(house => {
        const marker = new google.maps.Marker({
          position: house.coordinates,
          map,
          title: house.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="url(#gradient)" stroke="#fff" stroke-width="2"/>
                <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">🏠</text>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#9333ea"/>
                    <stop offset="100%" style="stop-color:#ec4899"/>
                  </linearGradient>
                </defs>
              </svg>
            `),
            scaledSize: new google.maps.Size(40, 40),
          }
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-3 max-w-xs">
              <h3 class="font-bold text-lg mb-2">${house.name}</h3>
              <p class="text-gray-600 mb-2">${house.description}</p>
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-sm text-gray-500">👥 ${house.memberCount} members</span>
                <span class="text-sm text-gray-500">📍 ${house.neighborhood}</span>
              </div>
              <div class="flex flex-wrap gap-1 mb-3">
                ${house.focusAreas.map((area: string) => `<span class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">${area}</span>`).join('')}
              </div>
              <button onclick="window.location.href='/house/${house.id}'" class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 rounded text-sm font-semibold hover:from-purple-700 hover:to-pink-700">
                View Details
              </button>
            </div>
          `
        })

        marker.addListener('click', () => {
          infoWindow.open(map, marker)
          onHouseSelect(house)
        })

        return marker
      })
      
      setMarkers(newMarkers)
    }
  }, [map, houses, onHouseSelect])

  return <div ref={ref} className="w-full h-full" />
}

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    case Status.FAILURE:
      return <div className="flex items-center justify-center h-96 text-red-600">
        Failed to load Google Maps
      </div>
    case Status.SUCCESS:
      return <GoogleMapComponent houses={sampleHouses} onHouseSelect={() => {}} />
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Home className="w-6 h-6" />
              <span>SF Hacker House Directory</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">Connect with the SF hacker house community. Create your profile and explore houses.</p>
            <div className="space-y-3">
              <Button 
                onClick={() => signIn()} 
                className="w-full"
                variant="default"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Link href="http://localhost:3000">
                <Button variant="outline" className="w-full">
                  Back to Landing Page
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Status */}
        <Card className="mb-8 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Hey {session.user?.name || 'New User'}! 👋</h3>
                  <p className="text-gray-600">Complete your profile to connect with amazing hacker houses</p>
                </div>
              </div>
              <Link href="/profile">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold">
                  <Edit className="w-4 h-4 mr-2" />
                  Complete Profile ✨
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{sampleHouses.length}</p>
                  <p className="text-gray-600 font-medium">Active Houses 🏠</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {sampleHouses.reduce((acc, house) => acc + house.memberCount, 0)}
                  </p>
                  <p className="text-gray-600 font-medium">Amazing People 👥</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {new Set(sampleHouses.map(h => h.neighborhood)).size}
                  </p>
                  <p className="text-gray-600 font-medium">SF Neighborhoods 📍</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Explorer */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🌟 Explore SF Tech Community
            </CardTitle>
            <p className="text-gray-600">Discover founders, projects, houses, and achievements from the SF hackathon ecosystem</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/founders">
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Founders</h3>
                    <p className="text-sm text-gray-600">Meet brilliant founders building the future</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/projects">
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Badge className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Projects</h3>
                    <p className="text-sm text-gray-600">Innovative hackathon projects and demos</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/houses">
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">All Houses</h3>
                    <p className="text-sm text-gray-600">Comprehensive house directory</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/external-badges">
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Badge className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Community Badges</h3>
                    <p className="text-sm text-gray-600">Achievement badges from events</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-gray-200">
            <div className="flex">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : ''}
              >
                <List className="w-4 h-4 mr-2" />
                List View
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : ''}
              >
                <Map className="w-4 h-4 mr-2" />
                Map View
              </Button>
            </div>
          </div>
        </div>

        {/* Hacker Houses Directory */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Discover Amazing Hacker Houses ✨
            </CardTitle>
            <p className="text-gray-600 mt-2">Connect with brilliant minds and find your perfect hacker community</p>
          </CardHeader>
          <CardContent>
            {viewMode === 'list' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sampleHouses.map((house) => (
                  <Link key={house.id} href={`/house/${house.id}`}>
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 shadow-lg bg-white/90 backdrop-blur-sm group">
                      <div className="relative h-48">
                        <img 
                          src={house.image} 
                          alt={house.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-4 right-4">
                          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {house.neighborhood}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <p className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            📍 {house.address}
                          </p>
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{house.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{house.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {house.focusAreas.map((area) => (
                            <Badge key={area} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 hover:from-purple-200 hover:to-pink-200">
                              {area}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                          {house.amenities.slice(0, 4).map((amenity, idx) => (
                            <div key={idx} className="flex items-center space-x-1">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <Users className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{house.memberCount} amazing people</span>
                          </div>
                          
                          <div className="flex -space-x-2">
                            {house.members.slice(0, 3).map((member, idx) => (
                              <div 
                                key={idx}
                                className="w-8 h-8 rounded-full border-2 border-white overflow-hidden ring-2 ring-purple-200"
                                title={`${member.name} - ${member.title} at ${member.company}`}
                              >
                                <img 
                                  src={member.image} 
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {house.memberCount > 3 && (
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-purple-200">
                                +{house.memberCount - 3}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 font-semibold">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Explore This House ✨
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="h-96 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <Wrapper 
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                  render={render}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 