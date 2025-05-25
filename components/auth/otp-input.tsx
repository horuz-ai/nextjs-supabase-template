'use client'

import React, { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function OTPInput({ 
  length = 6, 
  value, 
  onChange, 
  disabled = false,
  className 
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Update internal state when value prop changes
    const otpArray = value.split('').slice(0, length)
    const newOtp = [...otpArray, ...new Array(length - otpArray.length).fill('')]
    setOtp(newOtp)
  }, [value, length])

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    
    if (!/^[0-9]$/.test(val) && val !== '') return

    const newOtp = [...otp]
    newOtp[index] = val
    setOtp(newOtp)
    onChange(newOtp.join(''))

    // Move to next input if current field is filled
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('').filter(char => /^[0-9]$/.test(char)).slice(0, length)
    
    if (pasteArray.length === 0) return
    
    const newOtp = [...pasteArray, ...new Array(length - pasteArray.length).fill('')]
    setOtp(newOtp)
    onChange(newOtp.join(''))
    
    // Focus the input after the last pasted digit
    const focusIndex = Math.min(pasteArray.length, length - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref
          }}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-semibold",
            "border rounded-md",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200"
          )}
          inputMode="numeric"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  )
}