"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { OTPInput } from "./otp-input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"

interface OtpVerificationFormProps {
  target: string
  type: 'email' | 'phone'
  onBack: () => void
}

export function OtpVerificationForm({ target, type, onBack }: OtpVerificationFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [otp, setOtp] = useState("")
  const [resendTimer, setResendTimer] = useState(0)

  const startResendTimer = () => {
    setResendTimer(60)
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      
      const verifyData = type === 'email' 
        ? { email: target, token: otp, type: 'email' as const }
        : { phone: target, token: otp, type: 'sms' as const }

      const { error } = await supabase.auth.verifyOtp(verifyData)

      if (error) {
        toast({
          title: "Verification failed",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success!",
        description: "You have been successfully authenticated",
      })
      
      router.push("/dashboard")
      router.refresh()
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      setIsResending(true)
      
      if (type === 'email') {
        const { error } = await supabase.auth.signInWithOtp({
          email: target,
          options: {
            shouldCreateUser: true,
          },
        })
        
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          phone: target,
        })
        
        if (error) throw error
      }

      toast({
        title: "Code resent!",
        description: `Check your ${type === 'email' ? 'email' : 'phone'} for the new code`,
      })
      
      startResendTimer()
      setOtp("")
    } catch (error) {
      toast({
        title: "Failed to resend code",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="space-y-4">
      <OTPInput value={otp} onChange={setOtp} />
      
      <Button
        onClick={handleVerify}
        className="w-full"
        disabled={isLoading || otp.length !== 6}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify"
        )}
      </Button>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResend}
          disabled={isResending || resendTimer > 0}
        >
          {isResending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : resendTimer > 0 ? (
            `Resend in ${resendTimer}s`
          ) : (
            "Resend Code"
          )}
        </Button>
      </div>
    </div>
  )
}