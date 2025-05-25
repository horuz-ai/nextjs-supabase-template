'use client'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { signIn } from '@/lib/auth/actions'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface SocialLoginButtonsProps {
  redirectTo?: string
}

export function SocialLoginButtons({ redirectTo }: SocialLoginButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSocialLogin = async (provider: 'google') => {
    try {
      setLoading(provider)
      const result = await signIn({ provider, redirectTo })
      
      if (result.error) {
        // Handle specific OAuth errors
        let errorMessage = result.error.message
        
        if (result.error.message?.includes('invalid_request')) {
          errorMessage = 'OAuth configuration error. Please check your Google OAuth settings.'
        } else if (result.error.message?.includes('access_denied')) {
          errorMessage = 'Access was denied. Please try again.'
        } else if (result.error.message?.includes('temporarily_unavailable')) {
          errorMessage = 'Google sign in is temporarily unavailable. Please try again later.'
        }
        
        toast({
          title: 'Authentication Failed',
          description: errorMessage,
          variant: 'destructive'
        })
      } else if (result.data && 'needsRedirect' in result.data && 'url' in result.data) {
        // Handle OAuth redirect
        window.location.href = result.data.url
      }
    } catch (error) {
      console.error('OAuth error:', error)
      
      // Check if it's a NEXT_REDIRECT error (shouldn't happen with our fix, but just in case)
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        // Extract URL from the error if possible
        const match = error.message.match(/NEXT_REDIRECT;(.+)/)
        if (match && match[1]) {
          window.location.href = match[1]
          return
        }
      }
      
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to authentication service. Please check your internet connection and try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid gap-2">
      <Button
        variant="outline"
        type="button"
        disabled={loading !== null}
        onClick={() => handleSocialLogin('google')}
      >
        {loading === 'google' ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{' '}
        Continue with Google
      </Button>
    </div>
  )
}