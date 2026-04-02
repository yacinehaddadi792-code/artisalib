import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatCurrency, initials } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth';
import { BookingForm } from '@/components/booking-form';

export default async function ArtisanProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artisan = await prisma.artisanProfile.findUnique({
    where: { slug },
    include: { user: true, reviews: { include: { author: true } }, availabilitySlots: { where: { isBooked: false }, orderBy: { startsAt: 'asc' }, take: 8 } },
  });
  if (!artisan) notFound();

  const user = await getCurrentUser();
  const average = artisan.reviews.length ? artisan.reviews.reduce((a, r) => a + r.rating, 0) / artisan.reviews.length : null;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <section className="rounded-[2rem] bg-zinc-950 p-8 text-white lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-400 text-2xl font-black [font-family:var(--font-playfair)]">{initials(artisan.user.firstName, artisan.user.lastName)}</div>
            <div>
              <h1 className="text-4xl font-black [font-family:var(--font-playfair)]">{artisan.businessName}</h1>
              <p className="mt-2 text-brand-200">{artisan.trade} · {artisan.city}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-zinc-300">
                <span>{artisan.yearsExperience} ans d’expérience</span>
                <span>·</span>
                <span>{average ? `${average.toFixed(1)}/5` : 'Nouveau profil'}</span>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-white/10 p-5 text-sm text-zinc-200">
            <p><strong className="text-white">Tarif horaire :</strong> {formatCurrency(artisan.hourlyRateCents)}</p>
            <p className="mt-2"><strong className="text-white">Tarif forfait :</strong> {formatCurrency(artisan.fixedRateCents)}</p>
            <p className="mt-2"><strong className="text-white">Téléphone :</strong> {artisan.phonePublic ?? 'Affiché après réservation'}</p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <section className="space-y-6">
          <div className="card p-6">
            <h2 className="text-2xl font-bold">À propos</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">{artisan.bio}</p>
          </div>
          <div className="card p-6">
            <h2 className="text-2xl font-bold">Avis clients</h2>
            <div className="mt-4 space-y-4">
              {artisan.reviews.map((review) => (
                <div key={review.id} className="rounded-2xl bg-zinc-50 p-4 text-sm">
                  <p className="font-semibold">{review.author.firstName} {review.author.lastName} — {review.rating}/5</p>
                  <p className="mt-2 text-zinc-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <aside className="card p-6">
          <h2 className="text-2xl font-bold">Réserver un créneau</h2>
          {user?.role === 'CLIENT' ? (
            <BookingForm artisanId={artisan.id} slots={artisan.availabilitySlots.map((slot) => ({ id: slot.id, startsAt: slot.startsAt.toISOString(), endsAt: slot.endsAt.toISOString() }))} />
          ) : (
            <div className="mt-4 rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600">
              Connectez-vous en tant que particulier pour réserver.
              <div className="mt-4 flex gap-3">
                <a className="btn-primary" href="/login">Connexion</a>
                <a className="btn-secondary" href="/signup/client">Compte client</a>
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
