import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/actions'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: user, error } = await getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  return <>{children}</>
}