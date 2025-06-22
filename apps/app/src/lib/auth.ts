import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Demo users for testing - in a real app, these would be in the database with hashed passwords
const demoUsers = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex@demo.com",
    username: "alex",
    password: "demo123", // In real app, this would be hashed
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "2", 
    name: "Sarah Kim",
    email: "sarah@demo.com",
    username: "sarah",
    password: "demo123",
    image: "https://images.unsplash.com/photo-1494790108755-2616b885e592?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Mike Torres", 
    email: "mike@demo.com",
    username: "mike",
    password: "demo123",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  }
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // Find demo user
        const user = demoUsers.find(
          u => u.username === credentials.username && u.password === credentials.password
        )

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        (session.user as any).id = token.sub
      }
      return session
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id
      }
      return token
    },
    redirect: async ({ url, baseUrl }) => {
      // Handle sign out redirect
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return 'http://localhost:3000' // Redirect to landing page after sign out
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "http://localhost:3000", // Redirect to landing page
  },
}