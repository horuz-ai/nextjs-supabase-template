import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Next.js Template</CardTitle>
          <CardDescription>
            Complete authentication system with Supabase and Stripe payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">🔐 Authentication</CardTitle>
                <CardDescription>
                  Multiple auth methods ready to use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-green-500" />
                    Email & Password
                  </li>
                  <li className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-green-500" />
                    Magic Links
                  </li>
                  <li className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-green-500" />
                    Phone OTP
                  </li>
                  <li className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-green-500" />
                    Google OAuth
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Link href="/auth/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="flex-1">
                    <Button className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">💳 Payments</CardTitle>
                <CardDescription>
                  Stripe integration with multiple options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-green-500" />
                    Checkout Session
                  </li>
                  <li className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-green-500" />
                    Payment Element
                  </li>
                  <li className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-green-500" />
                    Embedded Checkout
                  </li>
                  <li className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-green-500" />
                    Webhook handling
                  </li>
                </ul>
                <Link href="/payments">
                  <Button variant="outline" className="w-full">
                    View Demo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">🚀 Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Set up environment variables</h4>
                <code className="text-sm bg-muted p-2 rounded block">
                  cp .env.local.example .env.local
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. Start development server</h4>
                <code className="text-sm bg-muted p-2 rounded block">
                  pnpm dev
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. Configure Supabase</h4>
                <p className="text-sm text-muted-foreground">
                  Update auth providers and email templates in your Supabase dashboard
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}