# Stripe Integration Guide

This Next.js template includes a complete Stripe integration setup that you can use as a foundation for your projects.

## Setup Instructions

### 1. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Stripe credentials:

```bash
cp .env.local.example .env.local
```

Required environment variables:
- `STRIPE_SECRET_KEY`: Your Stripe secret key (starts with `sk_`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (starts with `pk_`)
- `STRIPE_WEBHOOK_SECRET`: Your webhook endpoint secret (starts with `whsec_`)

### 2. Stripe Dashboard Setup

1. **API Keys**: Get your keys from [Stripe Dashboard > API Keys](https://dashboard.stripe.com/apikeys)
2. **Webhook Endpoint**: 
   - Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events to listen for (see webhook handler for supported events)
   - Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

### 3. Local Development with Stripe CLI

For testing webhooks locally:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Features Included

### 1. Payment Methods

#### Checkout Session (Redirect)
- Pre-built Stripe-hosted checkout page
- Supports one-time payments and subscriptions
- Handles all payment methods automatically
- Usage: See `/app/payments/page.tsx`

#### Payment Element (Custom Form)
- Embedded payment form in your app
- Supports 40+ payment methods
- Customizable appearance
- Usage: See `components/stripe/payment-element.tsx`

#### Embedded Checkout
- Stripe checkout embedded in an iframe
- Seamless integration without redirects
- Usage: See `components/stripe/embedded-checkout.tsx`

### 2. API Routes

- `/api/stripe/payment-intent` - Create payment intents for custom forms
- `/api/stripe/checkout-session` - Create checkout sessions
- `/api/stripe/webhook` - Handle Stripe webhook events

### 3. Components

All Stripe components are in `/components/stripe/`:
- `stripe-provider.tsx` - Stripe Elements provider wrapper
- `payment-element.tsx` - Payment form using Payment Element
- `checkout-form.tsx` - Checkout session trigger component
- `embedded-checkout.tsx` - Embedded checkout component

### 4. Utilities

Helper functions in `/utils/stripe/helpers.ts`:
- `formatAmountForDisplay()` - Format amounts for display
- `formatAmountForStripe()` - Convert amounts to Stripe format
- `getTestCardInfo()` - Get test card numbers

## Usage Examples

### One-time Payment with Checkout Session

```tsx
import { CheckoutForm } from '@/components/stripe/checkout-form';

<CheckoutForm
  lineItems={[
    {
      name: 'Product Name',
      amount: 2000, // $20.00
      quantity: 1,
    }
  ]}
/>
```

### Custom Payment Form

```tsx
import { StripeProvider } from '@/components/stripe/stripe-provider';
import { PaymentElementForm } from '@/components/stripe/payment-element';

// First create a payment intent and get clientSecret
<StripeProvider clientSecret={clientSecret}>
  <PaymentElementForm />
</StripeProvider>
```

### Subscription Checkout

```tsx
<CheckoutForm
  mode="subscription"
  priceId="price_xxx" // Your subscription price ID
/>
```

## Testing

Use these test card numbers in test mode:
- Success: `4242 4242 4242 4242`
- 3D Secure: `4000 0025 0000 3155`
- Declined: `4000 0000 0000 0002`

Use any future expiration date and any 3-digit CVC.

## Webhook Events

The webhook handler supports these events:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Modify `/app/api/stripe/webhook/route.ts` to handle these events according to your business logic.

## Security Best Practices

1. **Never expose your secret key** - Only use it in server-side code
2. **Verify webhook signatures** - Already implemented in the webhook handler
3. **Use HTTPS in production** - Required for PCI compliance
4. **Validate amounts server-side** - Never trust client-side amounts
5. **Store sensitive data in Stripe** - Don't store card details in your database

## Next Steps

1. Replace the example payment page with your actual products/services
2. Implement proper error handling and user feedback
3. Add customer management features if needed
4. Set up proper webhook event handling for your business logic
5. Consider adding features like:
   - Customer portal for subscription management
   - Invoice generation
   - Payment method management
   - Refund handling

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Next.js Documentation](https://nextjs.org/docs)
- [Testing Guide](https://stripe.com/docs/testing)