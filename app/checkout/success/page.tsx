import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

function SuccessContent() {
  return (
    <div className="container max-w-2xl mx-auto py-16">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for your purchase. Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            You will receive a confirmation email shortly with your order details.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/payments">Make Another Payment</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}