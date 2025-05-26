export type AuthProvider = 'email' | 'google' | 'phone'

export interface AuthError {
  message: string
  code?: string
}

export interface AuthUser {
  id: string
  email?: string
  phone?: string
  user_metadata?: Record<string, any>
  app_metadata?: Record<string, any>
  created_at?: string
}

export interface SignUpData {
  email?: string
  password?: string
  phone?: string
  options?: {
    data?: Record<string, any>
    emailRedirectTo?: string
  }
}

export interface SignInData {
  email?: string
  password?: string
  phone?: string
  provider?: 'google'
  redirectTo?: string
}

export interface OTPData {
  email?: string
  phone?: string
  token?: string
  type: 'signup' | 'magiclink' | 'sms' | 'email'
}

export interface AuthResponse<T = any> {
  data?: T
  error?: AuthError
}