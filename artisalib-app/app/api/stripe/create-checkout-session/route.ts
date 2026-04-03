import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { stripe, STRIPE_PRICE_MAP } from '@/lib/stripe';

async function createSession(plan: 'BASIC' | 'PREMIUM', userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { artisanProfile: true } });
  if (!user?.artisanProfile) throw new Error('Profil artisan introuvable');

  let customerId = user.artisanProfile.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      metadata: { userId: user.id, artisanId: user.artisanProfile.id },
    });
    customerId = customer.id;
    await prisma.artisanProfile.update({ where: { id: user.artisanProfile.id }, data: { stripeCustomerId: customerId } });
  }

  const price = STRIPE_PRICE_MAP[plan];
  if (!price) throw new Error(`Prix Stripe manquant pour ${plan}`);

  return stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    success_url: `${process.env.APP_URL}/artisan?subscription=success`,
    cancel_url: `${process.env.APP_URL}/artisan?subscription=cancel`,
    metadata: { artisanId: user.artisanProfile.id, plan },
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ARTISAN') return NextResponse.json({ error: 'Accès refusé' }, { status: 401 });

  const contentType = request.headers.get('content-type') || '';
  const plan = contentType.includes('application/x-www-form-urlencoded')
    ? ((await request.formData()).get('plan') as 'BASIC' | 'PREMIUM' | null)
    : ((await request.json()).plan as 'BASIC' | 'PREMIUM' | null);

  if (!plan) return NextResponse.json({ error: 'Plan manquant' }, { status: 400 });

  const session = await createSession(plan, user.id);
  return NextResponse.redirect(session.url!, { status: 303 });
}
