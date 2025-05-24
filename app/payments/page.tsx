'use client';

import { useState } from 'react';
import { StripeProvider } from '@/components/stripe/stripe-provider';
import { PaymentElementForm } from '@/components/stripe/payment-element';
import { CheckoutForm } from '@/components/stripe/checkout-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatAmountForDisplay, formatAmountForStripe, getTestCardInfo } from '@/utils/stripe/helpers';
import { InfoIcon } from 'lucide-react';

export default function PaymentsPage() {
  const [amount, setAmount] = useState(50);
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const testCardInfo = getTestCardInfo();

  const createPaymentIntent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: formatAmountForStripe(amount),
          currency: 'usd',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-16">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Stripe Payment Examples</h1>
        <p className="text-muted-foreground">
          Test different Stripe payment integration methods
        </p>
      </div>

      <Alert className="mb-8">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Test Mode:</strong> {testCardInfo.message}
          <div className="mt-2 space-y-1">
            <div>Success: {testCardInfo.cards.success.number}</div>
            <div>3D Secure: {testCardInfo.cards.requiresAuth.number}</div>
            <div>Declined: {testCardInfo.cards.declined.number}</div>
          </div>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="checkout" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="checkout">Checkout Session</TabsTrigger>
          <TabsTrigger value="payment-element">Payment Element</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="checkout">
          <Card>
            <CardHeader>
              <CardTitle>Checkout Session</CardTitle>
              <CardDescription>
                Redirect to Stripe-hosted checkout page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="checkout-amount">Amount</Label>
                <Input
                  id="checkout-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min={1}
                />
                <p className="text-sm text-muted-foreground">
                  Total: {formatAmountForDisplay(amount)}
                </p>
              </div>
              
              <CheckoutForm
                lineItems={[
                  {
                    name: 'Sample Product',
                    amount: formatAmountForStripe(amount),
                    quantity: 1,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-element">
          <Card>
            <CardHeader>
              <CardTitle>Payment Element</CardTitle>
              <CardDescription>
                Custom payment form with Stripe Elements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!clientSecret ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="element-amount">Amount</Label>
                    <Input
                      id="element-amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      min={1}
                    />
                    <p className="text-sm text-muted-foreground">
                      Total: {formatAmountForDisplay(amount)}
                    </p>
                  </div>
                  
                  <Button
                    onClick={createPaymentIntent}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Creating...' : 'Continue to Payment'}
                  </Button>
                </>
              ) : (
                <StripeProvider clientSecret={clientSecret}>
                  <PaymentElementForm />
                </StripeProvider>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Set up recurring payments with Stripe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  To test subscriptions, create a product with recurring pricing in your Stripe Dashboard,
                  then add the price ID to your environment variables.
                </AlertDescription>
              </Alert>
              
              <div className="mt-4">
                <CheckoutForm
                  mode="subscription"
                  priceId={process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}