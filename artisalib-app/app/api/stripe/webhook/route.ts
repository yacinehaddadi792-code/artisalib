import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature');
  if (!signature) return new Response('Missing signature', { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    return new Response(`Webhook error: ${(error as Error).message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const artisanId = session.metadata?.artisanId;
    const plan = session.metadata?.plan as 'BASIC' | 'PREMIUM' | undefined;
    if (artisanId && plan && session.subscription) {
      await prisma.artisanProfile.update({
        where: { id: artisanId },
        data: {
          stripeSubscriptionId: String(session.subscription),
          subscriptionPlan: plan,
          subscriptionStatus: 'ACTIVE',
          visible: true,
          isPremium: plan === 'PREMIUM',
          stripePriceId: session.metadata?.plan,
        },
      });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    await prisma.artisanProfile.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { subscriptionStatus: 'CANCELED', visible: false, isPremium: false },
    });
  }

  return new Response('ok');
}
