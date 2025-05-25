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
      const result = await signIn({ provider })
      
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
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