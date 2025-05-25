import { getUser, signOut } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { Icons } from '@/components/ui/icons'

export default async function DashboardPage() {
  const { data: user } = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  async function handleSignOut() {
    'use server'
    await signOut()
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <form action={handleSignOut}>
            <Button variant="outline" type="submit">
              <Icons.logout className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>
                You&apos;re successfully authenticated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icons.user className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">User ID: {user.id}</span>
                </div>
                {user.email && (
                  <div className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Email: {user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Phone: {user.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication Methods</CardTitle>
              <CardDescription>
                Available auth methods in this template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Icons.check className="h-4 w-4 text-green-500" />
                  Email & Password
                </li>
                <li className="flex items-center gap-2">
                  <Icons.check className="h-4 w-4 text-green-500" />
                  Magic Links (Email OTP)
                </li>
                <li className="flex items-center gap-2">
                  <Icons.check className="h-4 w-4 text-green-500" />
                  Phone OTP (SMS)
                </li>
                <li className="flex items-center gap-2">
                  <Icons.check className="h-4 w-4 text-green-500" />
                  Google OAuth
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>
                Customize this template for your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Configure Supabase Dashboard</li>
                <li>Set up OAuth providers</li>
                <li>Configure SMS provider (Twilio)</li>
                <li>Customize email templates</li>
                <li>Add user profile management</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}