# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Start development server with local Supabase
pnpm dev

# Start only Next.js dev server (without Supabase)
pnpm next dev

# Build for production
pnpm build

# Run production server
pnpm start

# Lint code
pnpm lint
```

### Package Management
- **IMPORTANT**: This project enforces pnpm. Running `npm install` or `yarn` will fail.
- Install dependencies: `pnpm install`
- Add new dependency: `pnpm add package-name`

## Architecture Overview

This is a Next.js 15 application with App Router, featuring:

1. **Payment Processing**: Full Stripe integration with three payment methods:
   - Checkout Session API (`/api/stripe/checkout-session`)
   - Payment Element with custom UI (`/api/stripe/payment-intent`)
   - Embedded Checkout iframe
   - Webhook handler for 8 payment events (`/api/stripe/webhook`)

2. **Authentication**: Supabase SSR setup with:
   - Cookie-based session management via middleware
   - Client/server utilities in `/utils/supabase/`
   - Automatic session refresh
   - Local Supabase instance for development
   - Multiple auth methods: Email/Password, Magic Link, Phone/SMS, Google OAuth
   - OAuth callback handler at `/auth/callback`

3. **UI Components**: Complete shadcn/ui library (40+ components) using:
   - Radix UI primitives
   - Tailwind CSS styling
   - React Hook Form + Zod for forms
   - New York theme style

## Key Integration Points

### Stripe Configuration
- Server client: `/lib/stripe/server.ts`
- Client utilities: `/lib/stripe/client.ts`
- Test environment uses test keys from `.env.local`
- All amounts are in cents (multiply by 100)
- Webhook endpoint must be configured for production

### Supabase Setup
- Requires local Supabase running (`pnpm dev` starts it automatically)
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Middleware runs on all routes for session management
- Configuration in `/supabase/config.toml`

### Google OAuth Setup
- Requires Google Cloud Console configuration (see `GOOGLE_OAUTH_SETUP.md`)
- Environment variables: `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` and `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET`
- OAuth provider enabled in `/supabase/config.toml`
- Callback URL: `http://localhost:54321/auth/v1/callback` (local)
- Social login button component at `/components/auth/social-login-buttons.tsx`

### Component Usage
- Import from `@/components/ui/` for shadcn components
- All components support className prop for styling
- Forms use React Hook Form patterns with Zod schemas
- Dark mode ready but requires next-themes setup

## Testing Payments

Use Stripe test cards:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- See `/utils/stripe/helpers.ts` for more test scenarios