# Google OAuth Setup Guide

This guide walks you through setting up Google OAuth authentication for your Next.js application with Supabase.

## Prerequisites

- Google account
- Access to Google Cloud Console
- Local Supabase instance running

## Setup Steps

### 1. Google Cloud Console Configuration

1. **Go to Google Cloud Console**
   - Navigate to [https://console.cloud.google.com](https://console.cloud.google.com)
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click on the project dropdown in the top navigation
   - Either select an existing project or click "New Project"
   - Give your project a name (e.g., "My Next.js App")
   - Click "Create"

3. **Enable Required APIs**
   - In the left sidebar, go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click on it and press "Enable"
   - Note: Google+ API is being deprecated, but it's still required for basic OAuth

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - Choose "External" user type
     - Fill in the required fields:
       - App name: Your app name
       - User support email: Your email
       - Developer contact: Your email
     - Add scopes: `email` and `profile`
     - Add test users if in development
     - Save and continue

5. **Configure OAuth Client**
   - Application type: "Web application"
   - Name: "Supabase Auth" (or any name you prefer)
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     http://localhost:54321
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:54321/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
   - For production, add:
     ```
     https://your-project.supabase.co/auth/v1/callback
     https://your-domain.com/auth/callback
     ```
   - Click "Create"

6. **Save Your Credentials**
   - After creation, you'll see your Client ID and Client Secret
   - Copy these values - you'll need them for your `.env.local` file

### 2. Environment Configuration

1. **Create `.env.local` file** (if it doesn't exist)
   ```bash
   cp .env.local.example .env.local
   ```

2. **Add Google OAuth credentials** to `.env.local`:
   ```env
   SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-client-secret
   ```

### 3. Restart Supabase

After adding the environment variables, restart your local Supabase instance:

```bash
# Stop Supabase
pnpm supabase stop

# Start Supabase (or use pnpm dev which starts both Next.js and Supabase)
pnpm supabase start
```

### 4. Test the Integration

1. Start your Next.js development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `http://localhost:3000/auth/login`

3. Click "Continue with Google"

4. You should be redirected to Google's OAuth consent screen

5. After authorizing, you'll be redirected back to your app and logged in

## Troubleshooting

### Common Issues

1. **"Error 400: redirect_uri_mismatch"**
   - Make sure the redirect URI in Google Cloud Console exactly matches what Supabase uses
   - Check both localhost and production URLs

2. **"Access blocked: This app's request is invalid"**
   - Ensure you've configured the OAuth consent screen
   - Add test users if your app is in development mode

3. **Login redirects but user is not authenticated**
   - Check that environment variables are loaded correctly
   - Verify Supabase is running with the correct config
   - Check browser console for errors

4. **"Invalid client" error**
   - Double-check your Client ID and Client Secret
   - Ensure there are no extra spaces or characters

### Debug Tips

- Check Supabase logs: `pnpm supabase status`
- Verify environment variables are loaded: Add `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)` to your code
- Test with Supabase Studio: Navigate to `http://localhost:54323` and check Authentication settings

## Production Deployment

When deploying to production:

1. **Update Google Cloud Console**:
   - Add your production domain to Authorized JavaScript origins
   - Add production callback URLs to Authorized redirect URIs

2. **Update Environment Variables**:
   - Set the same Google OAuth credentials in your production environment
   - Ensure `NEXT_PUBLIC_SITE_URL` points to your production domain

3. **Update Supabase Project**:
   - In your Supabase dashboard, go to Authentication > Providers
   - Enable Google provider
   - Add your Google Client ID and Secret

## Security Best Practices

1. **Never commit secrets**: Keep your Client Secret in environment variables only
2. **Restrict domains**: In production, only allow your actual domain in Google Console
3. **Use HTTPS**: Always use HTTPS URLs in production
4. **Limit scopes**: Only request the OAuth scopes you actually need
5. **Regular audits**: Periodically review your OAuth app settings and active sessions

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication Best Practices](https://nextjs.org/docs/authentication)