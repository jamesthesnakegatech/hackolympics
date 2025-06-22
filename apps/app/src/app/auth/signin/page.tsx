'use client'

import { signIn, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Home, LogIn, User, Lock, Sparkles, Users, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid username or password')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoUsername: string) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        username: demoUsername,
        password: 'demo123',
        redirect: false,
      })

      if (result?.error) {
        setError('Demo login failed')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const demoAccounts = [
    {
      username: 'alex',
      name: 'Alex Chen',
      title: 'ML Engineer @ OpenAI',
      gradient: 'from-blue-500 to-purple-600',
      emoji: '🤖'
    },
    {
      username: 'sarah',
      name: 'Sarah Kim',
      title: 'Product Manager @ Anthropic',
      gradient: 'from-purple-500 to-pink-600',
      emoji: '🚀'
    },
    {
      username: 'mike',
      name: 'Mike Torres',
      title: 'Founder @ Stealth AI',
      gradient: 'from-pink-500 to-orange-600',
      emoji: '⚡'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl">
            <Home className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="mt-6 text-center text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          Hey there! 👋
        </h1>
        <p className="mt-3 text-center text-xl text-gray-700 font-medium">
          Ready to explore SF's coolest hacker houses? ✨
        </p>
        
        {/* Stats */}
        <div className="mt-6 flex justify-center space-x-8 text-sm text-gray-600">
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

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white pb-8">
            <CardTitle className="text-center text-3xl font-bold flex items-center justify-center space-x-2">
              <Sparkles className="w-8 h-8" />
              <span>Demo Access</span>
              <Sparkles className="w-8 h-8" />
            </CardTitle>
            <p className="text-center text-purple-100 mt-2">
              No signup needed - just pick an account and dive in! 🏊‍♀️
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Demo Accounts Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                Choose Your Demo Identity 🎭
              </h3>
              <div className="space-y-3">
                {demoAccounts.map((account) => (
                  <button
                    key={account.username}
                    onClick={() => handleDemoLogin(account.username)}
                    disabled={isLoading}
                    className="w-full p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-purple-50 hover:to-pink-50 border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${account.gradient} rounded-full flex items-center justify-center text-xl shadow-lg`}>
                        {account.emoji}
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                          {account.name}
                        </div>
                        <div className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors">
                          {account.title}
                        </div>
                      </div>
                      <div className="text-sm font-mono text-gray-500 bg-gray-200 px-3 py-1 rounded-full group-hover:bg-purple-200 group-hover:text-purple-700 transition-colors">
                        {account.username}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-purple-200 to-pink-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">or enter manually</span>
              </div>
            </div>

            {/* Manual Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-pulse">
                  <p className="text-sm text-red-800 text-center font-medium">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300"
                    placeholder="alex, sarah, or mike"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300"
                    placeholder="demo123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0 font-bold text-lg py-4 h-12 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Getting you in...
                  </div>
                ) : (
                  <>
                    Let's Explore SF! 🚀
                    <LogIn className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Back to Landing */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link href="http://localhost:3000">
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold h-12 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  ← Back to Landing Page
                </Button>
              </Link>
            </div>

            {/* Fun Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                🏠 Find your tribe • 🚀 Build cool stuff • ✨ Have fun
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 