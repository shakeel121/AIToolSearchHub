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

## Changelog

Changelog:
- July 08, 2025. Initial setup