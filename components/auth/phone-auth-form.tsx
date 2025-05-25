'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInWithOtp, verifyOtp } from '@/lib/auth/actions'
import { useToast } from '@/hooks/use-toast'
import { OTPInput } from './otp-input'
import { useRouter } from 'next/navigation'

const phoneSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
})

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

type PhoneData = z.infer<typeof phoneSchema>
type OTPData = z.infer<typeof otpSchema>

interface PhoneAuthFormProps {
  mode?: 'signin' | 'signup'
  redirectTo?: string
}

export function PhoneAuthForm({ mode = 'signin', redirectTo = '/dashboard' }: PhoneAuthFormProps) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const { toast } = useToast()
  const router = useRouter()
  
  const phoneForm = useForm<PhoneData>({
    resolver: zodResolver(phoneSchema),
  })

  const handlePhoneSubmit = async (data: PhoneData) => {
    try {
      setLoading(true)
      
      const result = await signInWithOtp({
        phone: data.phone,
        type: mode === 'signup' ? 'signup' : 'sms'
      })

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error.message,
          variant: 'destructive',
        })
        return
      }

      setPhone(data.phone)
      setStep('otp')
      toast({
        title: 'Code sent',
        description: 'Please check your phone for the verification code.',
      })
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

  const handleOtpSubmit = async () => {
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
        phone,
        token: otp,
        type: 'sms'
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

  const handleResend = async () => {
    try {
      setLoading(true)
      
      const result = await signInWithOtp({
        phone,
        type: mode === 'signup' ? 'signup' : 'sms'
      })

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error.message,
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Code resent',
        description: 'Please check your phone for the new verification code.',
      })
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

  if (step === 'otp') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Enter verification code</h3>
          <p className="text-sm text-muted-foreground">
            We sent a code to {phone}
          </p>
        </div>

        <OTPInput
          value={otp}
          onChange={setOtp}
          disabled={loading}
        />

        <div className="space-y-2">
          <Button
            onClick={handleOtpSubmit}
            className="w-full"
            disabled={loading || otp.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>

          <div className="flex justify-between text-sm">
            <Button
              variant="link"
              onClick={() => {
                setStep('phone')
                setOtp('')
              }}
              className="p-0"
            >
              Change number
            </Button>
            <Button
              variant="link"
              onClick={handleResend}
              disabled={loading}
              className="p-0"
            >
              Resend code
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1234567890"
          {...phoneForm.register('phone')}
          disabled={loading}
        />
        {phoneForm.formState.errors.phone && (
          <p className="text-sm text-red-500">{phoneForm.formState.errors.phone.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Include your country code (e.g., +1 for US)
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Sending...' : 'Send Code'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        We&apos;ll send you a 6-digit verification code via SMS.
      </p>
    </form>
  )
}