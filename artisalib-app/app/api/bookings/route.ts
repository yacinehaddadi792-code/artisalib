import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { bookingSchema } from '@/lib/validations';

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'CLIENT') return NextResponse.json({ error: 'Connexion client requise.' }, { status: 401 });

  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Données de réservation invalides.' }, { status: 400 });

  const booking = await prisma.booking.create({
    data: {
      clientId: user.id,
      artisanId: parsed.data.artisanId,
      startsAt: new Date(parsed.data.startsAt),
      endsAt: new Date(parsed.data.endsAt),
      address: parsed.data.address,
      city: parsed.data.city,
      postalCode: parsed.data.postalCode,
      requestNote: parsed.data.requestNote,
    },
  });

  await prisma.availabilitySlot.updateMany({
    where: { artisanId: parsed.data.artisanId, startsAt: new Date(parsed.data.startsAt), endsAt: new Date(parsed.data.endsAt) },
    data: { isBooked: true },
  });

  return NextResponse.json({ message: `Réservation enregistrée (${booking.id}). L’artisan peut maintenant confirmer et envoyer un devis.` });
}
