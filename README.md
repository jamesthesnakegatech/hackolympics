# Hackolympics - SF Hacker House Badge System

A Next.js application with Turbo monorepo structure for tracking hacker house events in San Francisco through a badge system similar to Partiful profiles.

## 🏗️ Project Structure

```
Hackolympics/
├── apps/
│   ├── landing/          # Landing page (Next.js)
│   └── app/             # Main application (Next.js)
├── packages/
│   ├── ui/              # Shared UI components
│   └── types/           # Shared TypeScript types
├── tasks.md            # Project task tracking
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

### Available Scripts

- `npm run dev` - Start all development servers
- `npm run build` - Build all applications
- `npm run lint` - Lint all packages
- `npm run type-check` - Type check all packages

## 🎯 Project Goals

### Badge System Features
- **Event Tracking**: Automatically track attendance at SF hacker house events
- **Badge Collection**: Earn unique badges for different types of participation
- **Profile Showcase**: Display earned badges on user profiles
- **Community Building**: Connect with other builders in the SF tech scene

### Target Users
- Developers, designers, and entrepreneurs in San Francisco
- Hacker house residents and visitors
- Tech event organizers and attendees

## 🏛️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Airtable integration
- **Authentication**: NextAuth.js
- **Deployment**: Vercel
- **Monorepo**: Turbo
- **Language**: TypeScript

## 📱 Applications

### Landing Page (`apps/landing`)
- Marketing site explaining the badge system
- Early access signup
- Community showcase
- **Port**: 3000

### Main App (`apps/app`)
- User authentication and profiles
- Badge management system
- Event discovery and tracking
- Social features
- **Port**: 3001

## 🚢 Deployment

The project is configured for deployment on Vercel with separate deployments for each app:

- **Landing Page**: `hackolympics.vercel.app`
- **Main App**: `hackolympics-app.vercel.app`

## 📋 Development Status

See `tasks.md` for detailed project progress and task tracking.

### Current Phase: Landing Page ✅
- [x] Project infrastructure setup
- [x] Landing page development
- [x] Responsive design with animations
- [ ] Vercel deployment configuration

### Next Phase: Main Application
- [ ] Authentication system
- [ ] Database setup
- [ ] Badge system implementation
- [ ] Event integration

## 🤝 Contributing

1. Check `tasks.md` for current priorities
2. Create feature branches from `main`
3. Follow the established code structure and conventions
4. Test both landing and main app functionality

## 🔗 Links

- [Tasks & Progress](./tasks.md)
- [Turbo Documentation](https://turbo.build/)
- [Next.js Documentation](https://nextjs.org/docs)

---

Built with ❤️ for the San Francisco hacker house community 