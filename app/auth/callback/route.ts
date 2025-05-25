import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  console.log('next: ',next);
  // Handle OAuth errors from provider
  if (error) {
    console.error('OAuth provider error:', { error, errorDescription })
    const errorMessage = errorDescription || error || 'Authentication failed'
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorMessage)}`, requestUrl.origin)
    )
  }

  if (code) {
    const supabase = await createClient()
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!sessionError) {
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
    
    // Log the error for debugging
    console.error('Session exchange error:', sessionError)
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(sessionError.message || 'Could not complete authentication')}`, requestUrl.origin)
    )
  }

  // No code or error provided
  return NextResponse.redirect(
    new URL(`/auth/login?error=Invalid authentication request`, requestUrl.origin)
  )
}