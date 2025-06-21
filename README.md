# Hackolympics - SF Hacker House Directory

A Next.js application with Turbo monorepo structure for discovering and connecting with San Francisco's most innovative hacker houses and tech community members.

## 🏗️ Project Structure

```
Hackolympics/
├── apps/
│   ├── landing/          # Landing page (Next.js) - Port 3000
│   └── app/             # Main application (Next.js) - Port 3001
├── packages/
│   ├── ui/              # Shared UI components
│   └── types/           # Shared TypeScript types
└── turbo.json         # Turbo configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Hackolympics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   # Run all apps in development
   npm run dev
   
   # Or run specific apps
   npm run dev --filter=@hackolympics/landing
   npm run dev --filter=@hackolympics/app
   ```

### Demo Accounts

For testing the application, use these demo credentials:

- **Username**: `alex` | **Password**: `demo123` (Alex Chen - ML Engineer at OpenAI)
- **Username**: `sarah` | **Password**: `demo123` (Sarah Kim - Product Manager at Anthropic)  
- **Username**: `mike` | **Password**: `demo123` (Mike Torres - Founder at Stealth AI)

### Available Scripts

- `npm run dev` - Start all development servers
- `npm run build` - Build all applications
- `npm run lint` - Lint all packages
- `npm run type-check` - Type check all packages

## 🎯 Project Features

### 🏠 Hacker House Directory
- **House Discovery**: Browse SF hacker houses with detailed profiles
- **Member Showcases**: View house residents with their skills and achievements
- **Interactive Map**: Explore houses geographically across SF neighborhoods
- **Neighborhood Filtering**: Find houses in SOMA, Mission, Castro, Marina, Pacific Heights

### 👤 Profile Management
- **User Profiles**: Complete profiles with professional details and skills
- **Social Integration**: Link Partiful and Luma profiles for event connectivity
- **Badge System**: Earn and display achievement badges (AI Pioneer, Hackathon Winner, etc.)
- **Skills Tracking**: Tag-based skill system with visual badges

### 🌟 Community Features
- **Founders Directory**: Meet innovative founders building the future
- **Project Showcase**: Discover hackathon projects and demos
- **Achievement Badges**: Community recognition system with rarity levels
- **Event Integration**: Connect with Partiful and Luma for event discovery

### 🎨 Modern UI/UX
- **Partiful-Inspired Design**: Trendy, hip styling with gradients and glassmorphism
- **Responsive Design**: Mobile-first approach with smooth animations
- **Interactive Elements**: Hover effects, scaling animations, and visual feedback

## 🏛️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom gradients and animations
- **UI Components**: shadcn/ui with custom badge system
- **Authentication**: NextAuth.js with credentials provider
- **Database**: Prisma ORM with PostgreSQL schema (ready for deployment)
- **Maps**: Google Maps integration for house locations
- **Deployment**: Vercel-ready configuration
- **Monorepo**: Turbo for efficient development
- **Language**: TypeScript throughout

## 📱 Applications

### Landing Page (`apps/landing`)
- **Purpose**: Marketing site with Partiful-inspired design
- **Features**: Hero section, community showcase, feature highlights
- **URL**: http://localhost:3000
- **CTA**: Direct users to the main application

### Main App (`apps/app`)
- **Purpose**: Full hacker house directory and community platform
- **Features**: 
  - User authentication with demo accounts
  - Interactive hacker house directory with map/list views
  - Detailed house pages with member profiles and badges
  - Complete profile management system
  - Community exploration (founders, projects, badges)
- **URL**: http://localhost:3001
- **Authentication**: Username/password demo system

## 🏠 Sample Hacker Houses

The application includes 5 sample hacker houses:

1. **Hacker House SOMA** - AI/ML focus with 12 members
2. **Mission Builders** - Web3/DeFi focus with 8 members  
3. **Castro Tech Collective** - Hardware/IoT focus with 6 members
4. **Marina Code House** - Full-Stack/Cloud focus with 10 members
5. **Pac Heights Product House** - Product Design focus with 7 members

Each house includes:
- Real SF coordinates and addresses
- Member profiles with companies and roles
- Focus areas and amenities
- Achievement badges and skills

## 🎖️ Badge System

### Badge Types
- **AI Pioneer** - Leading AI/ML innovation
- **Hackathon Winner** - Competition achievements
- **Open Source Hero** - Community contributions
- **Community Builder** - Organizing and mentoring
- **Product Expert** - Shipping successful products
- **Safety Advocate** - AI safety and ethics focus
- **Founder** - Started successful companies
- **Stealth Mode** - Working on confidential projects
- **Night Owl** - Late-night coding sessions

### Rarity Levels
- **Common** - Basic achievements
- **Rare** - Notable accomplishments  
- **Epic** - Significant contributions
- **Legendary** - Exceptional achievements

## 🚢 Deployment

The project is configured for deployment on Vercel:

- **Landing Page**: Optimized for marketing and SEO
- **Main App**: Full-featured community platform
- **Environment**: Ready for production with proper configurations

## 📋 Development Status

### ✅ Completed Features
- [x] Landing page with Partiful-inspired design
- [x] User authentication system with demo accounts
- [x] Hacker house directory with detailed profiles
- [x] Interactive map integration with Google Maps
- [x] Complete profile management system
- [x] Badge system with visual rarity indicators
- [x] Community exploration features
- [x] Responsive design with modern animations
- [x] Database schema with Prisma ORM

### 🚧 Ready for Enhancement
- [ ] Real user registration and authentication
- [ ] Database integration with live data
- [ ] Event calendar integration
- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] Mobile app development

## 🤝 Contributing

1. Follow the established Partiful-inspired design patterns
2. Maintain the badge system consistency
3. Test both landing and main app functionality
4. Ensure responsive design across all devices

## 🔗 Links

- [Turbo Documentation](https://turbo.build/)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Built with ❤️ for the San Francisco hacker house community 🚀 