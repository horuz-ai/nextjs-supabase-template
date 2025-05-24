import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
  appInfo: {
    name: 'nextjs-template',
    version: '1.0.0',
  },
});

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata?: Stripe.MetadataParam
): Promise<Stripe.PaymentIntent> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata,
  });

  return paymentIntent;
}

export async function createCheckoutSession(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  successUrl: string,
  cancelUrl: string,
  metadata?: Stripe.MetadataParam
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  });

  return session;
}

export async function createSubscriptionCheckoutSession(
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  customerId?: string,
  metadata?: Stripe.MetadataParam
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer: customerId,
    metadata,
  });

  return session;
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Promise<Stripe.Event> {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}