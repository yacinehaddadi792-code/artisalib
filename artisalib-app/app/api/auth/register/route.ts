import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { registerSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides.' }, { status: 400 });
  }

  const { email, password, role, firstName, lastName, phone, businessName, trade, city, subscriptionPlan } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: 'Cet email est déjà utilisé.' }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      phone,
      role,
      ...(role === 'ARTISAN'
        ? {
            artisanProfile: {
              create: {
                slug: `${businessName || `${firstName}-${lastName}`}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                businessName: businessName || `${firstName} ${lastName}`,
                trade: trade || 'Artisan',
                city: city || 'À compléter',
                visible: false,
                subscriptionPlan: subscriptionPlan || 'BASIC',
                subscriptionStatus: 'INCOMPLETE',
              },
            },
          }
        : {}),
    },
  });

  const token = crypto.randomBytes(32).toString('hex');
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  const verificationLink = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;
  
  await sendVerificationEmail(email, verificationLink);

  return NextResponse.json({ message: 'Compte créé. Vérifiez votre email pour activer votre compte.' });
}
