'use client'

import { Zap, Home, Users, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold">Hackolympics</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Discover and connect with San Francisco's most innovative hacker houses and tech community members. Find your perfect collaborative living space.
            </p>
            <div className="flex space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Home className="w-4 h-4" />
                <span>5+ Houses</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>50+ Members</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>5 Neighborhoods</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="http://localhost:3001/houses" className="hover:text-white transition-colors">Hacker Houses</a></li>
              <li><a href="http://localhost:3001/founders" className="hover:text-white transition-colors">Founders</a></li>
              <li><a href="http://localhost:3001/projects" className="hover:text-white transition-colors">Projects</a></li>
              <li><a href="http://localhost:3001/external-badges" className="hover:text-white transition-colors">Badges</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="http://localhost:3001/auth/signin" className="hover:text-white transition-colors">Join Now</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#badges" className="hover:text-white transition-colors">Badge System</a></li>
              <li><a href="http://localhost:3001/profile" className="hover:text-white transition-colors">Create Profile</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Hackolympics. Built with ❤️ for the San Francisco hacker house community 🚀
          </p>
        </div>
      </div>
    </footer>
  )
} 