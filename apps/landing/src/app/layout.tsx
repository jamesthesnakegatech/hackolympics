import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hackolympics - SF Hacker House Badge System',
  description: 'Track your hacker house journey in San Francisco with badges for every event you attend. Connect with the community and showcase your participation.',
  keywords: ['hacker house', 'san francisco', 'badges', 'tech events', 'community'],
  authors: [{ name: 'Hackolympics Team' }],
  openGraph: {
    title: 'Hackolympics - SF Hacker House Badge System',
    description: 'Track your hacker house journey in San Francisco with badges for every event you attend.',
    url: 'https://hackolympics.vercel.app',
    siteName: 'Hackolympics',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hackolympics - SF Hacker House Badge System',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hackolympics - SF Hacker House Badge System',
    description: 'Track your hacker house journey in San Francisco with badges for every event you attend.',
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
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          {children}
        </main>
      </body>
    </html>
  )
} 