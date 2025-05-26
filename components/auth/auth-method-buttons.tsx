"use client"

import { Button } from "@/components/ui/button"
import { AuthMethod } from "./unified-auth-form"
import { Mail, Phone, KeyRound, Loader2 } from "lucide-react"

interface AuthMethodButtonsProps {
  currentMethod: AuthMethod
  onMethodChange: (method: AuthMethod) => void
  onGoogleAuth: () => void
  isLoading: boolean
}

export function AuthMethodButtons({ 
  currentMethod, 
  onMethodChange, 
  onGoogleAuth,
  isLoading 
}: AuthMethodButtonsProps) {
  const buttons = [
    {
      method: 'google' as const,
      label: 'Continue with Google',
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      ),
      onClick: onGoogleAuth,
    },
    {
      method: 'phone' as AuthMethod,
      label: 'Continue with Phone',
      icon: <Phone className="h-4 w-4" />,
      onClick: () => onMethodChange('phone'),
    },
    {
      method: 'email-otp' as AuthMethod,
      label: 'Continue with Email OTP',
      icon: <Mail className="h-4 w-4" />,
      onClick: () => onMethodChange('email-otp'),
    },
    {
      method: 'email-password' as AuthMethod,
      label: 'Continue with Email & Password',
      icon: <KeyRound className="h-4 w-4" />,
      onClick: () => onMethodChange('email-password'),
    },
  ]

  const visibleButtons = buttons.filter(button => {
    if (button.method === 'google') return true
    return button.method !== currentMethod
  })

  return (
    <div className="space-y-2">
      {visibleButtons.map((button) => (
        <Button
          key={button.method}
          variant="outline"
          className="w-full"
          onClick={button.onClick}
          disabled={isLoading}
        >
          {isLoading && button.method === 'google' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <span className="mr-2">{button.icon}</span>
          )}
          {button.label}
        </Button>
      ))}
    </div>
  )
}