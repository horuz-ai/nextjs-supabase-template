'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInWithOtp } from '@/lib/auth/actions'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type FormData = z.infer<typeof formSchema>

interface EmailOtpFormProps {
  redirectTo?: string
}

export function EmailOtpForm({ redirectTo = '/dashboard' }: EmailOtpFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      
      const result = await signInWithOtp({
        email: data.email,
        type: 'email'
      })

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error.message,
          variant: 'destructive',
        })
        return
      }

      // Redirect to OTP verification page
      const params = new URLSearchParams({
        email: data.email,
        type: 'email',
        redirectTo
      })
      
      router.push(`/auth/verify-otp?${params.toString()}`)
      
      toast({
        title: 'Check your email',
        description: 'We sent you a 6-digit verification code.',
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          disabled={loading}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Sending code...' : 'Send Verification Code'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        We&apos;ll email you a 6-digit code to verify your identity.
      </p>
    </form>
  )
}