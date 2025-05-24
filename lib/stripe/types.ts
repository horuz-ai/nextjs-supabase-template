import Stripe from 'stripe';

export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}

export interface CreateCheckoutSessionRequest {
  lineItems: {
    priceId?: string;
    name?: string;
    amount?: number;
    currency?: string;
    quantity: number;
  }[];
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}

export interface CreateSubscriptionCheckoutRequest {
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  id: string;
  amount: number;
  currency: string;
}

export interface CheckoutSessionResponse {
  url: string;
  id: string;
}

export interface WebhookEvent {
  type: string;
  data: {
    object: any;
  };
}

export type StripeWebhookHandler = (
  event: Stripe.Event
) => Promise<void> | void;

export interface StripeWebhookHandlers {
  'payment_intent.succeeded'?: StripeWebhookHandler;
  'payment_intent.payment_failed'?: StripeWebhookHandler;
  'checkout.session.completed'?: StripeWebhookHandler;
  'customer.subscription.created'?: StripeWebhookHandler;
  'customer.subscription.updated'?: StripeWebhookHandler;
  'customer.subscription.deleted'?: StripeWebhookHandler;
  'invoice.payment_succeeded'?: StripeWebhookHandler;
  'invoice.payment_failed'?: StripeWebhookHandler;
  [key: string]: StripeWebhookHandler | undefined;
}