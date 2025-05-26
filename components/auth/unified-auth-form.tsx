"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { EmailPasswordForm } from "./email-password-form"
import { PhoneAuthForm } from "./phone-auth-form"
import { EmailOtpForm } from "./email-otp-form"
import { OtpVerificationForm } from "./otp-verification-form"
import { AuthMethodButtons } from "./auth-method-buttons"

export type AuthMethod = 'email-password' | 'phone' | 'email-otp' | 'verify-otp'

export interface AuthState {
  method: AuthMethod
  email?: string
  phone?: string
  verificationTarget?: string
  otpType?: 'email' | 'phone'
}

export function UnifiedAuthForm() {
  const { toast } = useToast()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  
  const [authState, setAuthState] = useState<AuthState>({
    method: 'email-password'
  })

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast({
          title: "Authentication failed",
          description: error.message,
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMethodChange = (newMethod: AuthMethod) => {
    setAuthState(prev => ({
      ...prev,
      method: newMethod
    }))
  }

  const handleOtpRequest = (target: string, type: 'email' | 'phone') => {
    setAuthState(prev => ({
      ...prev,
      method: 'verify-otp',
      verificationTarget: target,
      otpType: type
    }))
  }

  const handleBack = () => {
    if (authState.otpType === 'email') {
      setAuthState(prev => ({ ...prev, method: 'email-otp' }))
    } else if (authState.otpType === 'phone') {
      setAuthState(prev => ({ ...prev, method: 'phone' }))
    }
  }

  const renderForm = () => {
    switch (authState.method) {
      case 'email-password':
        return (
          <EmailPasswordForm 
            savedEmail={authState.email}
            onEmailChange={(email) => setAuthState(prev => ({ ...prev, email }))}
          />
        )
      case 'phone':
        return (
          <PhoneAuthForm 
            savedPhone={authState.phone}
            onPhoneChange={(phone) => setAuthState(prev => ({ ...prev, phone }))}
            onOtpRequest={(phone) => handleOtpRequest(phone, 'phone')}
          />
        )
      case 'email-otp':
        return (
          <EmailOtpForm 
            savedEmail={authState.email}
            onEmailChange={(email) => setAuthState(prev => ({ ...prev, email }))}
            onOtpRequest={(email) => handleOtpRequest(email, 'email')}
          />
        )
      case 'verify-otp':
        return (
          <OtpVerificationForm 
            target={authState.verificationTarget || ''}
            type={authState.otpType || 'email'}
            onBack={handleBack}
          />
        )
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {authState.method === 'verify-otp' ? 'Verify your code' : 'Welcome'}
        </CardTitle>
        {authState.method === 'verify-otp' && authState.verificationTarget && (
          <CardDescription className="text-center">
            Sent to: {authState.verificationTarget}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {renderForm()}
        
        {authState.method !== 'verify-otp' && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <AuthMethodButtons
              currentMethod={authState.method}
              onMethodChange={handleMethodChange}
              onGoogleAuth={handleGoogleAuth}
              isLoading={isLoading}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}