import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-11-20.acacia',
});

export const STRIPE_PRICE_MAP = {
  BASIC: process.env.STRIPE_PRICE_BASIC,
  PREMIUM: process.env.STRIPE_PRICE_PREMIUM,
} as const;
