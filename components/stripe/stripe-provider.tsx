'use client';

import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe/client';
import { ReactNode } from 'react';

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const stripePromise = getStripe();
  
  const options = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'stripe' as const,
          variables: {
            colorPrimary: '#0F172A',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '2px',
            borderRadius: '4px',
          },
        },
      }
    : undefined;

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}