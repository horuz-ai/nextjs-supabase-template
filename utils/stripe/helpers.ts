export function formatAmountForDisplay(
  amount: number,
  currency: string = 'usd'
): string {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  
  const displayAmount = zeroDecimalCurrency ? amount : amount / 100;
  
  return numberFormat.format(displayAmount);
}

export function formatAmountForStripe(
  amount: number,
  currency: string = 'usd'
): number {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

export const CURRENCY_MAP: Record<string, { symbol: string; name: string }> = {
  usd: { symbol: '$', name: 'US Dollar' },
  eur: { symbol: '€', name: 'Euro' },
  gbp: { symbol: '£', name: 'British Pound' },
  jpy: { symbol: '¥', name: 'Japanese Yen' },
  cad: { symbol: 'C$', name: 'Canadian Dollar' },
  aud: { symbol: 'A$', name: 'Australian Dollar' },
};

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_MAP[currency.toLowerCase()]?.symbol || currency.toUpperCase();
}

export const TEST_CARDS = {
  success: {
    number: '4242424242424242',
    description: 'Succeeds and immediately processes the payment.',
  },
  requiresAuth: {
    number: '4000002500003155',
    description: 'Requires 3D Secure 2 authentication.',
  },
  declined: {
    number: '4000000000000002',
    description: 'Always declines with a generic decline code.',
  },
  insufficientFunds: {
    number: '4000000000009995',
    description: 'Always fails with insufficient funds.',
  },
};

export function getTestCardInfo() {
  return {
    message: 'Use any of these test card numbers with any CVC and future expiration date.',
    cards: TEST_CARDS,
  };
}