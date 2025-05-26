'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPassword, updatePassword } from '@/lib/auth/actions'
import { useToast } from '@/hooks/use-toast'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const passwordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type EmailData = z.infer<typeof emailSchema>
type PasswordData = z.infer<typeof passwordSchema>

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  
  // Check if we have a recovery token (user clicked link from email)
  const isRecoveryMode = searchParams.has('code')
  
  const emailForm = useForm<EmailData>({
    resolver: zodResolver(emailSchema),
  })
  
  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  })
  
  const handleEmailSubmit = async (data: EmailData) => {
    try {
      setLoading(true)
      
      const result = await resetPassword(data.email)
      
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error.message,
          variant: 'destructive',
        })
        return
      }
      
      setEmailSent(true)
      toast({
        title: 'Check your email',
        description: 'We sent you a password reset link.',
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
  
  const handlePasswordSubmit = async (data: PasswordData) => {
    try {
      setLoading(true)
      
      const result = await updatePassword(data.password)
      
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error.message,
          variant: 'destructive',
        })
        return
      }
      
      toast({
        title: 'Success',
        description: 'Your password has been updated.',
      })
      
      router.push('/dashboard')
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {isRecoveryMode ? (
          <>
            <CardHeader>
              <CardTitle>Set new password</CardTitle>
              <CardDescription>
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...passwordForm.register('password')}
                    disabled={loading}
                  />
                  {passwordForm.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {passwordForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                    disabled={loading}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </>
        ) : emailSent ? (
          <>
            <CardHeader>
              <CardTitle>Check your email</CardTitle>
              <CardDescription>
                We sent a password reset link to {emailForm.getValues('email')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-6xl">📧</div>
                <p className="text-sm text-muted-foreground text-center">
                  Click the link in the email to reset your password. 
                  Be sure to check your spam folder too.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setEmailSent(false)}
                  className="w-full"
                >
                  Try another email
                </Button>
                <div className="text-center">
                  <Link href="/auth" className="text-sm text-primary hover:underline">
                    Back to login
                  </Link>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Reset password</CardTitle>
              <CardDescription>
                Enter your email and we&apos;ll send you a reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...emailForm.register('email')}
                    disabled={loading}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                
                <div className="text-center">
                  <Link href="/auth" className="text-sm text-primary hover:underline">
                    Back to login
                  </Link>
                </div>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}