# AuditProp - 360° Property Due-Diligence Platform

## Overview

AuditProp is an enterprise-grade property audit platform designed for the Indian real estate market. The application provides comprehensive 360° property due-diligence by aggregating data from multiple sources including ownership records, legal cases, financial encumbrances, and regulatory databases. Users can search properties by name, survey number, or owner details to receive verified risk scores and downloadable audit reports.

The platform is built as a full-stack TypeScript application with a React frontend and Express backend, currently using in-memory storage with planned PostgreSQL integration via Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript using Vite as the build tool and development server
- Client-side routing via Wouter (lightweight React router)
- State management through TanStack Query v5 for server state and React Context for authentication

**UI Component System**
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS v4 with custom design tokens for styling
- shadcn/ui component library (New York style variant) with extensive customization
- Custom theme system supporting light/dark modes via CSS variables

**Key Design Decisions**
- Component aliases configured for clean imports (`@/components`, `@/lib`, `@/hooks`)
- Monospace fonts (JetBrains Mono) for displaying financial/technical data
- Custom hover elevation effects and animation utilities
- Responsive design with mobile-first approach using Sheet components for navigation

**Page Structure**
- Landing page with hero section and property search
- Dashboard for property listings and search results
- Property details page with comprehensive audit information
- Review queue for manual verification workflows
- Audit reports archive and download interface
- Settings page for workspace configuration
- Dedicated marketing pages (Solutions, Data Sources, Pricing, API)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for REST API endpoints
- Separate development (Vite SSR middleware) and production (static file serving) server configurations
- Custom request logging middleware with duration tracking and JSON response capture

**Development vs Production**
- Development: Hot module replacement via Vite middleware, dynamic HTML template loading
- Production: Pre-built static assets served from `dist/public`, optimized bundle output via esbuild

**API Design Pattern**
- All application routes prefixed with `/api`
- Route registration centralized in `server/routes.ts`
- HTTP server creation integrated with route setup

**Storage Layer Abstraction**
- `IStorage` interface defining CRUD operations for data entities
- `MemStorage` in-memory implementation for development/testing
- Designed to be swapped with PostgreSQL implementation via Drizzle ORM

### Data Storage Solutions

**Planned Database: PostgreSQL**
- Drizzle ORM configured as the database toolkit
- Schema defined in `shared/schema.ts` with type-safe query builders
- Migration output directory: `./migrations`
- Connection via `@neondatabase/serverless` driver (serverless-compatible)

**Current State**
- In-memory storage implementation active for rapid prototyping
- Database schema includes user table with UUID primary keys
- Zod schema validation integrated via `drizzle-zod` for runtime type checking

**Schema Architecture**
- Users table with username/password authentication fields
- UUID generation via PostgreSQL's `gen_random_uuid()`
- Insert schemas auto-generated from Drizzle table definitions

### Authentication and Authorization

**Current Implementation**
- Mock authentication system via React Context (`AuthContext`)
- User state persisted in localStorage
- Role-based access control (admin/user roles defined)
- Session management handled client-side

**Planned Enhancements**
- Server-side session management via `connect-pg-simple` (PostgreSQL session store)
- Secure password hashing (bcrypt/argon2)
- JWT or session-based authentication
- RBAC enforcement on API endpoints

**Security Considerations**
- Environment variable validation for database credentials
- Separation of development and production configurations
- CORS and security headers to be implemented

### External Dependencies

**Core Runtime Dependencies**
- **React Ecosystem**: React 18, React DOM, TanStack Query for data fetching
- **UI Components**: Extensive Radix UI library (~25 primitive components)
- **Form Handling**: React Hook Form with Hookform Resolvers, Zod for validation
- **Styling**: Tailwind CSS, class-variance-authority for variant management, clsx for class merging
- **Utilities**: date-fns for date formatting, nanoid for ID generation, Lucide React for icons

**Backend Dependencies**
- **Database**: Drizzle ORM, Neon serverless PostgreSQL driver
- **Session**: connect-pg-simple for PostgreSQL-backed sessions
- **Server**: Express.js with TypeScript support via tsx

**Development Tools**
- **Vite Plugins**: Replit-specific plugins (runtime error modal, cartographer, dev banner)
- **Build Tools**: esbuild for server bundling, TypeScript compiler for type checking
- **Database Tools**: Drizzle Kit for schema migrations and push operations

**Third-Party Integrations (Planned)**
- Ministry of Corporate Affairs (MCA) API
- RERA (Real Estate Regulatory Authority) databases
- Court case databases (district and high courts)
- Revenue department records and sub-registrar data
- RBI CIBIL integration for financial history
- Bank loan records and cheque bounce databases

**Asset Management**
- Custom Vite plugin (`vite-plugin-meta-images`) for OpenGraph image URL management
- Static assets served from `client/public` directory
- Support for PNG/JPG/JPEG opengraph images with automatic Replit domain injection