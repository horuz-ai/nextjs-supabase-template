'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';

interface EmbeddedCheckoutFormProps {
  priceId?: string;
  lineItems?: {
    name: string;
    amount: number;
    quantity: number;
  }[];
}

export function EmbeddedCheckoutForm({ priceId, lineItems }: EmbeddedCheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch('/api/stripe/checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        lineItems,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setClientSecret(data.id);
        }
      })
      .catch((error) => {
        console.error('Error creating checkout session:', error);
      });
  }, [priceId, lineItems]);

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return <div>Stripe is not configured</div>;
  }

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  return (
    <div id="checkout">
      {clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
}