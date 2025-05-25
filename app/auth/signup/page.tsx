import { AuthForm } from '@/components/auth/auth-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthForm mode="signup" />
    </div>
  )
}