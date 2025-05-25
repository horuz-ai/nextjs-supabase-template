'use server'

import { createClient } from '@/utils/supabase/server'
import { AuthError, SignInData, SignUpData, OTPData, AuthResponse } from './types'
import { redirect } from 'next/navigation'

export async function signUp({ email, password, phone, options }: SignUpData): Promise<AuthResponse> {
  const supabase = await createClient()
  
  try {
    if (email && password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options
      })
      
      if (error) throw error
      return { data }
    } else if (phone) {
      // Phone signup uses OTP, redirect to signInWithOtp
      return signInWithOtp({ phone, type: 'signup' })
    }
    
    return { error: { message: 'Invalid sign up data' } }
  } catch (error) {
    return { error: error as AuthError }
  }
}

export async function signIn({ email, password, phone, provider }: SignInData): Promise<AuthResponse> {
  const supabase = await createClient()
  
  try {
    if (provider === 'google') {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
        }
      })
      
      if (error) throw error
      if (data.url) {
        redirect(data.url)
      }
      return { data }
    } else if (email && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { data }
    } else if (phone) {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone
      })
      
      if (error) throw error
      return { data }
    }
    
    return { error: { message: 'Invalid sign in data' } }
  } catch (error) {
    return { error: error as AuthError }
  }
}

export async function signInWithOtp({ email, phone, type }: OTPData): Promise<AuthResponse> {
  const supabase = await createClient()
  
  try {
    if (email) {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: type === 'signup',
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
        }
      })
      
      if (error) throw error
      return { data }
    } else if (phone) {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: type === 'signup'
        }
      })
      
      if (error) throw error
      return { data }
    }
    
    return { error: { message: 'Email or phone is required' } }
  } catch (error) {
    return { error: error as AuthError }
  }
}

export async function verifyOtp({ email, phone, token, type }: OTPData): Promise<AuthResponse> {
  const supabase = await createClient()
  
  try {
    if (!token) {
      return { error: { message: 'Verification code is required' } }
    }
    
    if (email) {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: type === 'magiclink' ? 'magiclink' : 'email'
      })
      
      if (error) throw error
      return { data }
    } else if (phone) {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      })
      
      if (error) throw error
      return { data }
    }
    
    return { error: { message: 'Email or phone is required' } }
  } catch (error) {
    return { error: error as AuthError }
  }
}

export async function signOut(): Promise<AuthResponse> {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { data: { success: true } }
  } catch (error) {
    return { error: error as AuthError }
  }
}

export async function resetPassword(email: string): Promise<AuthResponse> {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`
    })
    
    if (error) throw error
    return { data }
  } catch (error) {
    return { error: error as AuthError }
  }
}

export async function updatePassword(password: string): Promise<AuthResponse> {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    
    if (error) throw error
    return { data }
  } catch (error) {
    return { error: error as AuthError }
  }
}

export async function getUser() {
  const supabase = await createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error
    return { data: user }
  } catch (error) {
    return { error: error as AuthError }
  }
}