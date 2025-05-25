# Supabase Authentication Setup Guide

This template includes a complete authentication system with multiple auth methods. Follow this guide to configure each authentication method.

## 🚀 Quick Start

1. **Start the development server with Supabase:**
   ```bash
   pnpm dev
   ```
   This starts both Next.js and local Supabase instances.

2. **Access Supabase Studio:**
   Open http://localhost:54323 to access your local Supabase dashboard.

## 📋 Authentication Methods

### 1. Email & Password Authentication
**Status**: ✅ Ready to use (enabled by default)

No additional configuration needed for local development.

### 2. Magic Links (Passwordless Email)
**Status**: ✅ Ready to use (enabled by default)

- Users receive a login link via email
- Links expire after 1 hour
- Rate limited to 1 request per 60 seconds

**Email Template Customization:**
1. Go to Supabase Dashboard > Authentication > Email Templates
2. Customize the "Magic Link" template
3. Use `{{ .ConfirmationURL }}` for the link

### 3. Phone OTP (SMS)
**Status**: ⚠️ Requires SMS provider setup

**Setup Steps:**
1. Go to Supabase Dashboard > Authentication > Providers
2. Enable Phone provider
3. Choose SMS provider (Twilio, MessageBird, or TextLocal)
4. Add provider credentials:
   - **Twilio**: Account SID, Auth Token, Message Service SID
   - **MessageBird**: Access Key, Originator
   - **TextLocal**: API Key, Sender

**Testing locally:**
- Use Twilio test credentials for development
- Test phone number: +15555551234

### 4. Google OAuth
**Status**: ⚠️ Requires Google Cloud configuration

**Setup Steps:**
1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - Local: `http://localhost:54321/auth/v1/callback`
     - Production: `https://YOUR_SUPABASE_URL/auth/v1/callback`
4. Copy Client ID and Client Secret
5. In Supabase Dashboard > Authentication > Providers:
   - Enable Google provider
   - Add Client ID and Client Secret

## 🔧 Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 📁 File Structure

```
app/
├── auth/
│   ├── login/          # Sign in page
│   ├── signup/         # Sign up page
│   ├── verify-otp/     # OTP verification
│   ├── callback/       # OAuth callback handler
│   └── reset-password/ # Password reset flow
├── (protected)/
│   └── dashboard/      # Protected dashboard example
components/auth/
├── auth-form.tsx       # Main auth form with tabs
├── email-password-form.tsx
├── magic-link-form.tsx
├── phone-auth-form.tsx
├── social-login-buttons.tsx
└── otp-input.tsx
lib/auth/
├── actions.ts          # Server actions
└── types.ts           # TypeScript types
```

## 🛡️ Security Best Practices

1. **Always use `supabase.auth.getUser()`** for authentication checks
2. **Never trust `supabase.auth.getSession()`** in server code
3. **Middleware automatically refreshes** expired tokens
4. **Protected routes** use server-side authentication checks

## 🎨 Customization

### Email Templates
1. Go to Supabase Dashboard > Authentication > Email Templates
2. Available templates:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

### SMS Templates
1. Go to Supabase Dashboard > Authentication > SMS Templates
2. Customize the OTP message format

### Redirect URLs
Update redirect URLs in:
- `/lib/auth/actions.ts` - for OAuth and magic links
- `.env.local` - NEXT_PUBLIC_SITE_URL

## 🧪 Testing

### Test Credentials
- **Email**: Use any valid email format
- **Phone**: Use test numbers from your SMS provider
- **Google OAuth**: Use test users in Google Cloud Console

### Common Test Scenarios
1. Sign up with email/password
2. Sign in with magic link
3. Phone OTP verification
4. Google OAuth flow
5. Password reset
6. Protected route access

## 🚨 Troubleshooting

### "Auth session missing" error
- Ensure middleware is running (check `/middleware.ts`)
- Verify cookies are being set properly
- Check browser console for errors

### Magic links not working
- Check email configuration in Supabase
- Verify NEXT_PUBLIC_SITE_URL is correct
- Check spam folder

### Phone OTP not sending
- Verify SMS provider credentials
- Check phone number format (include country code)
- Review SMS provider logs

### Google OAuth redirect issues
- Verify redirect URIs in Google Cloud Console
- Ensure Supabase URL is correct
- Check for CORS issues

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js App Router Auth Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase Dashboard](http://localhost:54323) (local development)