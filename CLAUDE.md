# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a production-ready Next.js 15 template with:
- **Authentication**: Supabase (Email/Password, Magic Links, Phone/SMS via Twilio, Google OAuth)
- **Payments**: Stripe (Checkout Sessions, Payment Elements, Embedded Checkout)
- **UI Components**: shadcn/ui (40+ components, New York style)
- **Styling**: Tailwind CSS with dark mode support
- **Type Safety**: TypeScript with strict mode

## Commands

```bash
# Development (starts Next.js + local Supabase)
pnpm dev

# Production build
pnpm build

# Linting
pnpm lint

# Run a specific test (when tests are added)
pnpm test [test-file-path]
```

## Architecture

### Route Structure
- `/app/(protected)/` - Routes requiring authentication (dashboard, etc.)
- `/app/auth/` - Authentication pages (login, signup, etc.)
- `/app/api/stripe/` - Stripe webhook and API endpoints

### Key Patterns
1. **Server/Client Separation**: Utilities are split (e.g., `utils/supabase/server.ts` vs `client.ts`)
2. **Server Actions**: Authentication logic in `lib/auth/actions.ts` using Next.js server actions
3. **Middleware**: Session refresh and protected route handling in `middleware.ts`
4. **Environment Variables**: All required vars documented in `.env.local.example`

### Authentication Flow
1. User actions trigger server actions in `lib/auth/actions.ts`
2. Supabase client utilities in `utils/supabase/` handle auth operations
3. Middleware refreshes sessions and protects routes
4. Auth state accessed via `useAuth()` hook

### Payment Flow
1. Client components in `components/stripe/` handle UI
2. API routes in `app/api/stripe/` manage server-side operations
3. Webhook at `/api/stripe/webhook` processes Stripe events
4. Helper functions in `utils/stripe/helpers.ts` for common operations

### Navigation System
- Configuration in `lib/navigation-config.ts`
- Sidebar navigation with team/workspace switcher
- Breadcrumb support throughout the app
- Mobile responsive with drawer navigation

## Development Guidelines

### When adding new features:
1. Follow existing patterns for server/client separation
2. Use server actions for data mutations
3. Place API routes under `/app/api/`
4. Add UI components to appropriate subdirectory in `/components/`
5. Use TypeScript strict mode - no `any` types

### When working with authentication:
1. Use server utilities from `utils/supabase/server.ts` in server components/actions
2. Use client utilities from `utils/supabase/client.ts` in client components
3. Protected routes go under `app/(protected)/`
4. Always handle auth errors gracefully

### When working with payments:
1. Test with Stripe test keys (already configured in .env.local.example)
2. Use webhook CLI for local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
3. Handle all webhook events in `app/api/stripe/webhook/route.ts`

### When adding UI components:
1. Use existing shadcn/ui components from `/components/ui/`
2. Follow the established Tailwind patterns
3. Support dark mode using CSS variables
4. Components should be composable and follow shadcn/ui patterns

### When working with database migrations:
- Always use 'supabase migration new migration_name' when creating new things in the database. never edit those files, if a change is needed in the database create a new migration
- Always use 'supabase gen types --local' when a new migration is done so we can have the latest typescript types