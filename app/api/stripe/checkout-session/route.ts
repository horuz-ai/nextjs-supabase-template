import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, createSubscriptionCheckoutSession } from '@/lib/stripe/server';
import { CreateCheckoutSessionRequest, CreateSubscriptionCheckoutRequest, CheckoutSessionResponse } from '@/lib/stripe/types';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const origin = request.headers.get('origin') || '';
    
    let session: Stripe.Checkout.Session;
    
    if ('priceId' in body && body.priceId) {
      const subscriptionRequest = body as CreateSubscriptionCheckoutRequest;
      
      session = await createSubscriptionCheckoutSession(
        subscriptionRequest.priceId,
        subscriptionRequest.successUrl || `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        subscriptionRequest.cancelUrl || `${origin}/checkout/cancel`,
        subscriptionRequest.customerId,
        subscriptionRequest.metadata
      );
    } else {
      const checkoutRequest = body as CreateCheckoutSessionRequest;
      
      if (!checkoutRequest.lineItems || checkoutRequest.lineItems.length === 0) {
        return NextResponse.json(
          { error: 'Line items are required' },
          { status: 400 }
        );
      }
      
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = checkoutRequest.lineItems.map(item => {
        if (item.priceId) {
          return {
            price: item.priceId,
            quantity: item.quantity,
          };
        } else if (item.name && item.amount) {
          return {
            price_data: {
              currency: item.currency || 'usd',
              product_data: {
                name: item.name,
              },
              unit_amount: item.amount,
            },
            quantity: item.quantity,
          };
        } else {
          throw new Error('Invalid line item: must have either priceId or name/amount');
        }
      });
      
      session = await createCheckoutSession(
        lineItems,
        checkoutRequest.successUrl || `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        checkoutRequest.cancelUrl || `${origin}/checkout/cancel`,
        checkoutRequest.metadata
      );
    }

    const response: CheckoutSessionResponse = {
      url: session.url!,
      id: session.id,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}