import { AuthForm } from '@/components/auth/auth-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthForm mode="signin" />
    </div>
  )
}