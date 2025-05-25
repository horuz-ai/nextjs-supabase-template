'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn, signUp } from '@/lib/auth/actions'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof formSchema>

interface EmailPasswordFormProps {
  mode: 'signin' | 'signup'
  redirectTo?: string
}

export function EmailPasswordForm({ mode, redirectTo = '/dashboard' }: EmailPasswordFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      
      const result = mode === 'signin' 
        ? await signIn({ email: data.email, password: data.password })
        : await signUp({ email: data.email, password: data.password })

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error.message,
          variant: 'destructive',
        })
        return
      }

      if (mode === 'signup') {
        toast({
          title: 'Success',
          description: 'Please check your email to confirm your account.',
        })
      } else {
        router.push(redirectTo)
        router.refresh()
      }
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

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          disabled={loading}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {mode === 'signin' && (
        <div className="text-sm">
          <Link
            href="/auth/reset-password"
            className="text-primary hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </Button>

      <div className="text-center text-sm">
        {mode === 'signin' ? (
          <>
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </>
        )}
      </div>
    </form>
  )
}