'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { AuthUser } from '@/lib/auth/types'
import { User } from '@supabase/supabase-js'

interface UseAuthReturn {
  user: AuthUser | null
  loading: boolean
  error: Error | null
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    const supabase = createClient()
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) throw error
        
        if (user) {
          setUser(transformUser(user))
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    
    getInitialSession()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(transformUser(session.user))
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  return { user, loading, error }
}

function transformUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    user_metadata: user.user_metadata,
    app_metadata: user.app_metadata,
    created_at: user.created_at
  }
}