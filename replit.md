# Leaderboard Application

## Overview

This is a full-stack web application that displays a competitive leaderboard for gambling wagering data sourced from the Roobet API. The application features a modern React frontend with a professional blue metallic theme, an Express.js backend, and PostgreSQL database integration using Drizzle ORM. The leaderboard runs monthly competitions from the 25th of each month to the 25th of the following month, displaying player rankings based on weighted wager amounts with corresponding prize structures.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom professional blue metallic theme
- **Build Tool**: Vite with custom configuration for multi-directory setup

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling
- **External Integration**: Rainbet API for wagering data fetching
- **Session Management**: Built-in session handling with timeout controls

### Database Architecture
- **Database**: PostgreSQL (configured for use but can be provisioned later)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for database schema management
- **Connection**: Neon Database serverless driver for PostgreSQL connections

## Key Components

### Data Models
- **Leaderboard Entries**: Stores player usernames, total wager amounts, ranks, and timestamps
- **Competitions**: Manages competition periods with start/end dates, prize pools, and active status
- **API Response Types**: Structured interfaces for external API integration

### Frontend Components
- **LeaderboardPage**: Main application view displaying ranked players with countdown timer
- **CountdownTimer**: Real-time countdown to next competition reset (23rd of each month)
- **LeaderboardCard**: Individual player card with rank-specific styling and prize information
- **UI Components**: Complete shadcn/ui component library for consistent design system

### Backend Services
- **Storage Interface**: Abstracted storage layer supporting both memory and database implementations
- **API Routes**: RESTful endpoints for leaderboard data and competition management
- **External API Integration**: Rainbet API client with error handling and timeout controls

## Data Flow

1. **Competition Management**: System automatically determines active competition periods based on monthly cycles (25th to 25th)  
2. **Data Fetching**: Backend periodically fetches wagering data from Roobet API using date range parameters
3. **Data Processing**: Raw API data is transformed, ranked, and stored with prize calculations
4. **Frontend Updates**: React Query manages real-time data synchronization with 30-second refresh intervals
5. **User Interface**: Leaderboard displays with rank-specific styling, countdown timers, and responsive design

## External Dependencies

### API Integration
- **Roobet API**: External gambling platform API for wagering data  
  - Endpoint: `https://api.roobet.com/v1/affiliate/stats`
  - Authentication: JWT token-based authentication
  - Rate Limiting: Built-in timeout controls (10-second limit)

### Third-Party Services
- **Neon Database**: Serverless PostgreSQL hosting solution
- **Replit**: Development and deployment platform with autoscale deployment target

### NPM Dependencies
- **Core**: React, Express.js, TypeScript, Drizzle ORM
- **UI**: Radix UI components, Tailwind CSS, Lucide React icons
- **Utilities**: TanStack Query, date-fns, class-variance-authority, clsx

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit development environment
- **Database**: PostgreSQL 16 module pre-configured
- **Development Server**: Vite dev server with HMR and error overlay
- **Port Configuration**: Application runs on port 5000 with external port 80 mapping

### Production Deployment
- **Target**: Replit autoscale deployment
- **Build Process**: Vite frontend build + esbuild backend bundling
- **Start Command**: Production Node.js server with optimized bundle
- **Environment**: Production environment variables with database URL configuration

### Build Configuration
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: esbuild bundles server to `dist/index.js` with external packages
- **Static Assets**: Served through Express static middleware in production

## Changelog

```
Changelog:
- June 25, 2025. Initial setup with Rainbet API
- June 25, 2025. Switched to Roobet API integration
- June 25, 2025. Updated prize structure: $1000 total pool (400/200/150/100/50/40/20/20/10/10)
- June 25, 2025. Added weighted wager system based on RTP percentages
- June 25, 2025. Competition dates changed to 25th-25th monthly cycle
- June 25, 2025. Added comprehensive rules section
- June 25, 2025. Updated API integration to use axios with new roobetconnect.com endpoint
- June 25, 2025. Implemented 15-minute cache refresh and automatic date setup
- June 25, 2025. Successfully integrated live Roobet affiliate data with weighted wagering
- June 25, 2025. Limited leaderboard display to exactly top 10 players maximum
- June 25, 2025. Implemented comprehensive responsive design for mobile, tablet, and desktop
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```