import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export default async function ClientDashboard() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'CLIENT') redirect('/login');

  const bookings = await prisma.booking.findMany({
    where: { clientId: user.id },
    include: { artisan: true, quote: true },
    orderBy: { startsAt: 'asc' },
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">Espace particulier</p>
      <h1 className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">Bonjour {user.firstName}</h1>
      <div className="mt-8 space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="card p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-lg font-semibold">{booking.artisan.businessName}</p>
                <p className="text-sm text-zinc-600">{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'short' }).format(booking.startsAt)} · {booking.city}</p>
                <p className="mt-2 text-sm text-zinc-600">{booking.requestNote}</p>
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-700">{booking.status}</span>
            </div>
            {booking.quote && (
              <div className="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-brand-900">
                Devis : {(booking.quote.amountCents / 100).toFixed(2)}€ — {booking.quote.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
