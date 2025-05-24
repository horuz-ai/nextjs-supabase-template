import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

export default function CancelPage() {
  return (
    <div className="container max-w-2xl mx-auto py-16">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
          <CardDescription>
            Your payment was cancelled and no charges were made.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            If you experienced any issues during checkout, please contact our support team.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/payments">Try Again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}