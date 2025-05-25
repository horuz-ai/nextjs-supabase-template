'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInWithOtp } from '@/lib/auth/actions'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type FormData = z.infer<typeof formSchema>

export function MagicLinkForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()
  
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
        type: 'magiclink'
      })

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error.message,
          variant: 'destructive',
        })
        return
      }

      setSubmitted(true)
      toast({
        title: 'Check your email',
        description: 'We sent you a login link. Be sure to check your spam too.',
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

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <div className="text-2xl">📧</div>
        <h3 className="text-lg font-semibold">Check your email</h3>
        <p className="text-sm text-muted-foreground">
          We sent a magic link to {getValues('email')}
        </p>
        <Button
          variant="outline"
          onClick={() => setSubmitted(false)}
          className="mt-4"
        >
          Try another email
        </Button>
      </div>
    )
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
        {loading ? 'Sending...' : 'Send Magic Link'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        We&apos;ll email you a magic link for a password-free sign in.
      </p>
    </form>
  )
}