'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmailPasswordForm } from './email-password-form'
import { MagicLinkForm } from './magic-link-form'
import { PhoneAuthForm } from './phone-auth-form'
import { SocialLoginButtons } from './social-login-buttons'
import { Separator } from '@/components/ui/separator'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  redirectTo?: string
}

export function AuthForm({ mode, redirectTo }: AuthFormProps) {
  const title = mode === 'signin' ? 'Welcome back' : 'Create an account'
  const description = mode === 'signin' 
    ? 'Sign in to your account to continue'
    : 'Enter your details to get started'

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <SocialLoginButtons redirectTo={redirectTo} />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="magic">Magic Link</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="mt-4">
              <EmailPasswordForm mode={mode} redirectTo={redirectTo} />
            </TabsContent>
            
            <TabsContent value="magic" className="mt-4">
              <MagicLinkForm />
            </TabsContent>
            
            <TabsContent value="phone" className="mt-4">
              <PhoneAuthForm redirectTo={redirectTo} />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}