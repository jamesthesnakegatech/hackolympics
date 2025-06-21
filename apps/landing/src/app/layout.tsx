import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hackolympics - SF Hacker House Directory',
  description: 'Discover and connect with San Francisco\'s most innovative hacker houses and tech community members. Find your perfect collaborative living space.',
  keywords: ['hacker house', 'san francisco', 'tech community', 'collaborative living', 'directory', 'partiful', 'luma'],
  authors: [{ name: 'Hackolympics Team' }],
  openGraph: {
    title: 'Hackolympics - SF Hacker House Directory',
    description: 'Discover and connect with San Francisco\'s most innovative hacker houses and tech community members.',
    url: 'https://hackolympics.vercel.app',
    siteName: 'Hackolympics',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hackolympics - SF Hacker House Directory',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hackolympics - SF Hacker House Directory',
    description: 'Discover and connect with San Francisco\'s most innovative hacker houses and tech community members.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
          {children}
        </main>
      </body>
    </html>
  )
} 