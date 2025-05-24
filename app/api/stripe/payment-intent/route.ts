import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe/server';
import { CreatePaymentIntentRequest, PaymentIntentResponse } from '@/lib/stripe/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreatePaymentIntentRequest = await request.json();
    
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const paymentIntent = await createPaymentIntent(
      body.amount,
      body.currency || 'usd',
      body.metadata
    );

    const response: PaymentIntentResponse = {
      clientSecret: paymentIntent.client_secret!,
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}