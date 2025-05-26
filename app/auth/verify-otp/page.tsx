'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OTPInput } from '@/components/auth/otp-input'
import { Button } from '@/components/ui/button'
import { verifyOtp } from '@/lib/auth/actions'
import { useToast } from '@/hooks/use-toast'

export default function VerifyOTPPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  
  const email = searchParams.get('email')
  const phone = searchParams.get('phone')
  const type = searchParams.get('type') as 'email' | 'magiclink' | 'sms' | 'signup'
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  
  useEffect(() => {
    if (!email && !phone) {
      router.push('/auth/login')
    }
  }, [email, phone, router])
  
  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter a 6-digit code',
        variant: 'destructive',
      })
      return
    }
    
    try {
      setLoading(true)
      
      const result = await verifyOtp({
        email: email || undefined,
        phone: phone || undefined,
        token: otp,
        type: type || 'email'
      })
      
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error.message,
          variant: 'destructive',
        })
        return
      }
      
      router.push(redirectTo)
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }
  
  if (!email && !phone) {
    return null
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify your {email ? 'email' : 'phone'}</CardTitle>
          <CardDescription>
            Enter the 6-digit code we sent to {email || phone}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <OTPInput
            value={otp}
            onChange={setOtp}
            disabled={loading}
          />
          
          <Button
            onClick={handleVerify}
            className="w-full"
            disabled={loading || otp.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
          
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => router.push('/auth/login')}
              className="text-sm"
            >
              Back to login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}