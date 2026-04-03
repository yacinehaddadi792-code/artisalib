import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';

export default async function ArtisanDashboard() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ARTISAN' || !user.artisanProfile) redirect('/login');

  const [bookings, reviews, quotes] = await Promise.all([
    prisma.booking.findMany({ where: { artisanId: user.artisanProfile.id }, include: { client: true }, orderBy: { startsAt: 'asc' }, take: 10 }),
    prisma.review.findMany({ where: { artisanId: user.artisanProfile.id }, include: { author: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.quote.findMany({ where: { artisanId: user.artisanProfile.id }, orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  const monthlyRevenue = quotes.filter((q) => q.status === 'ACCEPTED' || q.status === 'SENT').reduce((sum, q) => sum + q.amountCents, 0);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">Tableau de bord artisan</p>
          <h1 className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">{user.artisanProfile.businessName}</h1>
          <p className="mt-2 text-zinc-600">Plan {user.artisanProfile.subscriptionPlan ?? 'BASIC'} · statut {user.artisanProfile.subscriptionStatus ?? 'INCOMPLETE'}</p>
        </div>
        <form action="/api/stripe/create-checkout-session" method="POST">
          <input type="hidden" name="plan" value={user.artisanProfile.subscriptionPlan ?? 'BASIC'} />
          <button className="btn-primary">Activer / gérer mon abonnement Stripe</button>
        </form>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="card p-6"><p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Rendez-vous</p><p className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">{bookings.length}</p></div>
        <div className="card p-6"><p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Devis</p><p className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">{quotes.length}</p></div>
        <div className="card p-6"><p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Avis</p><p className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">{reviews.length}</p></div>
        <div className="card p-6"><p className="text-xs uppercase tracking-[0.15em] text-zinc-500">CA potentiel</p><p className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">{formatCurrency(monthlyRevenue)}</p></div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <section className="card overflow-hidden">
          <div className="border-b border-zinc-200 px-6 py-4"><h2 className="text-xl font-bold">Réservations</h2></div>
          <div className="divide-y divide-zinc-200">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-semibold">{booking.client.firstName} {booking.client.lastName}</p>
                  <p className="text-sm text-zinc-600">{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(booking.startsAt)} · {booking.city}</p>
                </div>
                <span className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-700">{booking.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold">Profil public</h2>
            <div className="mt-4 space-y-2 text-sm text-zinc-700">
              <p><strong>Métier :</strong> {user.artisanProfile.trade}</p>
              <p><strong>Ville :</strong> {user.artisanProfile.city}</p>
              <p><strong>Tarif horaire :</strong> {formatCurrency(user.artisanProfile.hourlyRateCents)}</p>
              <p><strong>Visible :</strong> {user.artisanProfile.visible ? 'Oui' : 'Non'}</p>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-bold">Derniers avis</h2>
            <div className="mt-4 space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl bg-zinc-50 p-4 text-sm">
                  <p className="font-semibold">{review.author.firstName} {review.author.lastName} — {review.rating}/5</p>
                  <p className="mt-2 text-zinc-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
