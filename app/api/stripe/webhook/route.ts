import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe/server';
import { StripeWebhookHandlers } from '@/lib/stripe/types';
import Stripe from 'stripe';

const relevantEvents = new Set([
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
]);

const webhookHandlers: StripeWebhookHandlers = {
  'payment_intent.succeeded': async (event) => {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log(`Payment intent succeeded: ${paymentIntent.id}`);
  },
  
  'payment_intent.payment_failed': async (event) => {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log(`Payment intent failed: ${paymentIntent.id}`);
  },
  
  'checkout.session.completed': async (event) => {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`Checkout session completed: ${session.id}`);
    
    if (session.mode === 'payment') {
      console.log(`Payment successful for session: ${session.id}`);
    } else if (session.mode === 'subscription') {
      console.log(`Subscription created for session: ${session.id}`);
    }
  },
  
  'customer.subscription.created': async (event) => {
    const subscription = event.data.object as Stripe.Subscription;
    console.log(`Subscription created: ${subscription.id}`);
  },
  
  'customer.subscription.updated': async (event) => {
    const subscription = event.data.object as Stripe.Subscription;
    console.log(`Subscription updated: ${subscription.id}`);
  },
  
  'customer.subscription.deleted': async (event) => {
    const subscription = event.data.object as Stripe.Subscription;
    console.log(`Subscription cancelled: ${subscription.id}`);
  },
  
  'invoice.payment_succeeded': async (event) => {
    const invoice = event.data.object as Stripe.Invoice;
    console.log(`Invoice payment succeeded: ${invoice.id}`);
  },
  
  'invoice.payment_failed': async (event) => {
    const invoice = event.data.object as Stripe.Invoice;
    console.log(`Invoice payment failed: ${invoice.id}`);
  },
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }
  
  let event: Stripe.Event;
  
  try {
    event = await constructWebhookEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }
  
  if (relevantEvents.has(event.type)) {
    try {
      const handler = webhookHandlers[event.type];
      if (handler) {
        await handler(event);
      }
    } catch (error) {
      console.error(`Error handling webhook ${event.type}:`, error);
      return NextResponse.json(
        { error: 'Webhook handler error' },
        { status: 500 }
      );
    }
  } else {
    console.log(`Unhandled webhook event: ${event.type}`);
  }
  
  return NextResponse.json({ received: true });
}