import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Accès refusé' }, { status: 401 });

  const [users, artisans, bookings, reviews] = await Promise.all([
    prisma.user.count(),
    prisma.artisanProfile.count(),
    prisma.booking.count(),
    prisma.review.count(),
  ]);

  return NextResponse.json({ users, artisans, bookings, reviews });
}
