# AISearch Application

## Overview

AISearch is a full-stack web application designed to be a comprehensive search engine for AI tools, products, and agents. The application allows users to search through AI-related submissions, submit new AI tools for review, and provides an admin interface for managing submissions. It's built using a modern tech stack with React frontend, Express backend, and PostgreSQL database.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Component Library**: Built on shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **State Management**: TanStack Query for API state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **API Framework**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL
- **Connection Pooling**: Neon serverless database with WebSocket support
- **Middleware**: Custom logging, JSON parsing, and error handling
- **API Design**: RESTful endpoints for CRUD operations

### Database Schema
The application uses four main tables:
- **submissions**: Stores AI tool submissions with metadata, status, and ratings
- **search_queries**: Logs search queries for analytics
- **reviews**: Stores user reviews and ratings for submissions
- **users**: User management (schema defined but not fully implemented)

Key relationships:
- Submissions can have multiple reviews
- Search queries are tracked with IP addresses for analytics
- Submissions have approval workflow (pending/approved/rejected)

## Data Flow

1. **Search Flow**: Users search → query logged → results returned with pagination
2. **Submission Flow**: Users submit → validation → pending status → admin review → approval/rejection
3. **Review Flow**: Users can review approved submissions → ratings aggregated
4. **Admin Flow**: Admins view pending submissions → approve/reject → status updated

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL with WebSocket support
- **Connection**: Uses connection pooling for performance

### UI Components
- **Radix UI**: Comprehensive primitive components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety across the stack
- **ESLint/Prettier**: Code quality and formatting

## Deployment Strategy

The application is configured for deployment on Replit:
- **Build Process**: Vite builds the frontend, esbuild bundles the server
- **Production**: Node.js server serves both API and static files
- **Development**: Vite dev server with proxy for API calls
- **Database**: Environment variable for DATABASE_URL connection string

Build commands:
- `npm run dev`: Development mode with hot reloading
- `npm run build`: Production build
- `npm run start`: Production server
- `npm run db:push`: Database schema deployment

## User Preferences

Preferred communication style: Simple, everyday language.

## Admin Credentials

**Admin Access Information:**
- **Login URL:** `/admin-login`
- **Username:** `admin`
- **Password:** `aisearch2024!`
- **Session Token:** `aisearch-admin-2024`

Admin panel is hidden from public navigation and accessible only through the secure login page. All admin routes are protected with authentication middleware.

## Recent Changes

Recent Changes:
- July 08, 2025: Initial setup with basic AI search engine functionality
- July 08, 2025: Expanded categories from 3 to 37 comprehensive AI categories including:
  - Core AI categories: Large Language Models, Computer Vision, NLP, ML Platforms
  - Creative AI: Art Generators, Video Tools, Audio Tools, Design Tools, 3D Modeling, Music Generation
  - Professional AI: Writing Assistants, Code Assistants, Data Analytics, Translation, Voice Assistants
  - Industry-specific: Healthcare, Finance, Education, Marketing, Legal Tech, Real Estate, Agriculture
  - Functional: Automation, Chatbots, Research Tools, Productivity, Customer Service, HR
  - Emerging: Gaming, Robotics, Infrastructure, Cybersecurity, Environmental, E-commerce, Social Media, SEO
- Enhanced category filtering with improved visual layout and color coding
- Updated submission form with all new categories
- Applied database schema changes to support expanded categorization
- July 08, 2025: Added comprehensive data seeding with 21 popular AI tools across all categories
- Implemented secure admin authentication system with protected routes
- Hidden admin panel from public navigation, accessible only via secure login
- Created dedicated admin login page with credentials display
- Added session-based authentication for admin operations
- July 08, 2025: COMPLETE ADMIN & MONETIZATION SYSTEM IMPLEMENTED
  - Full-featured admin dashboard with 6 comprehensive tabs (Overview, Pending, All Submissions, Analytics, Monetization, Advertisements)
  - Complete CRUD operations for managing all submissions (add, edit, delete, approve/reject)
  - Advanced monetization features: Featured listings, Sponsored content (Premium/Gold/Platinum levels)
  - Revenue tracking and analytics with charts and performance metrics
  - Click tracking for all submissions with affiliate URL support
  - Enhanced database schema with monetization fields (sponsorship levels, commission rates, affiliate URLs)
  - Comprehensive admin API endpoints for all management operations
  - Beautiful admin UI with charts, badges, and professional styling
  - Featured and sponsored content prominently displayed on homepage
  - Enhanced search results with special styling for monetized content
  - Real-time analytics and performance tracking
- July 08, 2025: COMPREHENSIVE ADVERTISEMENT SYSTEM IMPLEMENTED
  - Complete advertisement management with CRUD operations
  - Advertisement placements: header, sidebar, between-results, footer
  - Real-time click and impression tracking
  - Advertisement performance analytics and reporting
  - Budget management and cost-per-click tracking
  - Advertisement banner component for displaying ads across the platform
  - Sample advertisements seeded for demonstration
  - Admin panel with dedicated advertisements tab for full management
  - Advertisement API endpoints for public display and admin management
- July 08, 2025: NETLIFY DEPLOYMENT READY
  - Complete Netlify deployment configuration with serverless functions
  - Created netlify.toml with proper build settings and redirects
  - Implemented serverless Express app for Netlify Functions
  - Added build script for server-side code compilation
  - Created comprehensive deployment documentation (DEPLOYMENT_GUIDE.md)
  - Added environment variable configuration (.env.example)
  - Configured proper CORS headers for serverless deployment
  - Added security headers and performance optimization
  - Created README.md with deployment instructions
  - Application is now ready for production deployment on Netlify
- July 08, 2025: COMPREHENSIVE REAL-TIME DATA SYSTEM IMPLEMENTED
  - Massively expanded from 5 to 34+ comprehensive AI tools across all categories
  - Created multi-source real-time data fetcher (server/data-fetcher.ts) with 5 external APIs
  - Integrated Product Hunt, GitHub, Hugging Face, Papers with Code, and Awesome AI Lists
  - Enhanced GitHub integration with 10 different AI topic queries for maximum coverage
  - Expanded Hugging Face integration across 9 model types (text-generation, image, audio, etc.)
  - Built intelligent categorization system mapping external data to 37 AI categories
  - Comprehensive fallback dataset with 34 curated high-quality AI tools
  - Added admin "Refresh Data" button for manual real-time updates across all sources
  - Environment variables configured for 3 major API keys (GitHub, Product Hunt, Hugging Face)
  - System automatically fetches fresh data when APIs are available
  - Falls back to comprehensive curated data when API keys are not provided
  - Enhanced data quality with authentic ratings, review counts, and metadata
  - Multi-category coverage: LLMs, Art Generators, Code Assistants, Writing Tools, Computer Vision, Video/Audio Tools, etc.
- July 08, 2025: REPLIT MIGRATION COMPLETED
  - Successfully migrated project from Replit Agent to standard Replit environment
  - Fixed database setup with PostgreSQL and proper schema deployment
  - Resolved package dependencies and workflow configuration
  - Cleaned up duplicate database entries and implemented duplicate prevention
  - Massively expanded AI tools database from 60 to 114+ unique entries
  - Added comprehensive AI tool collections covering healthcare, finance, education, gaming, robotics, etc.
  - Enhanced data fetcher with 56+ additional curated AI tools across all categories
  - Fixed frontend JavaScript errors with proper null checks and safety guards
  - FIXED ADVERTISEMENT POSTING: Resolved authentication and data validation issues
  - Enhanced admin panel with working advertisement creation, editing, and management
  - Application now fully functional with search, admin panel, advertisements, and comprehensive AI tool directory
  - DEPLOYMENT READY: All core features tested and working correctly

## Changelog

Changelog:
- July 08, 2025. Initial setup
- July 08, 2025. Added 21 additional AI categories for comprehensive coverage