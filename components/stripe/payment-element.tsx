'use client';

import { useState, FormEvent } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentElementFormProps {
  returnUrl?: string;
}

export function PaymentElementForm({ 
  returnUrl = `${window.location.origin}/checkout/success` 
}: PaymentElementFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    if (error) {
      setError(error.message || 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full"
      >
        {isLoading ? 'Processing...' : 'Pay now'}
      </Button>
    </form>
  );
}