import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Identifiants invalides.' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email }, include: { artisanProfile: true } });
  if (!user) return NextResponse.json({ error: 'Compte introuvable.' }, { status: 404 });
  if (!user.emailVerifiedAt) return NextResponse.json({ error: 'Confirmez votre email avant de vous connecter.' }, { status: 403 });

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 });

  await setSessionCookie({ userId: user.id, role: user.role });
  const redirectTo = user.role === 'ADMIN' ? '/admin' : user.role === 'ARTISAN' ? '/artisan' : '/client';
  return NextResponse.json({ ok: true, redirectTo });
}
