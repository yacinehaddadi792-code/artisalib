import Link from 'next/link';
import { Footer } from '@/components/footer';
import { HeroSearch } from '@/components/hero-search';
import { prisma } from '@/lib/db';
import { formatCurrency, initials } from '@/lib/utils';
import { Star } from 'lucide-react';

export default async function HomePage({ searchParams }: { searchParams?: Promise<{ trade?: string; city?: string }> }) {
  const params = (await searchParams) || {};
  const artisans = await prisma.artisanProfile.findMany({
    where: {
      visible: true,
      ...(params.trade ? { trade: { contains: params.trade, mode: 'insensitive' } } : {}),
      ...(params.city ? { city: { contains: params.city, mode: 'insensitive' } } : {}),
    },
    include: {
      user: true,
      reviews: true,
      availabilitySlots: {
        where: { isBooked: false },
        orderBy: { startsAt: 'asc' },
        take: 3,
      },
    },
    orderBy: [{ isPremium: 'desc' }, { createdAt: 'desc' }],
    take: 12,
  });

  return (
    <main>
      <section className="relative overflow-hidden bg-zinc-950 px-6 py-20 text-white lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-brand-300/20 bg-brand-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-200">
              Réservation instantanée · abonnements artisans Basic 40€ / Premium 90€
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-tight [font-family:var(--font-playfair)] lg:text-7xl">
              Trouvez votre artisan de confiance, <span className="text-brand-300">réservez en ligne</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Artisalib connecte particuliers et artisans du bâtiment : recherche par métier et localisation, prise de rendez-vous, devis, avis, agenda et abonnements pro.
            </p>
            <div className="mt-8 max-w-4xl">
              <HeroSearch />
            </div>
            <div className="mt-10 flex flex-wrap gap-8 text-sm text-zinc-300">
              <div><strong className="block text-3xl text-brand-300">12 400+</strong> artisans inscrits</div>
              <div><strong className="block text-3xl text-brand-300">340 000+</strong> rendez-vous gérés</div>
              <div><strong className="block text-3xl text-brand-300">4,8/5</strong> note moyenne</div>
            </div>
          </div>
        </div>
      </section>

      <section id="fonctionnement" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">Comment ça marche</p>
          <h2 className="mt-3 text-4xl font-black [font-family:var(--font-playfair)]">Une logique simple, côté client comme côté artisan</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            ['1', 'Le particulier cherche', 'Métier, localisation, profil complet, tarifs, horaires, avis et disponibilité.'],
            ['2', 'Il réserve un créneau', 'La demande crée un rendez-vous et peut déboucher sur un devis dans son espace.'],
            ['3', 'L’artisan gère tout', 'Agenda, confirmations, devis, abonnements, avis et visibilité depuis son tableau de bord.'],
          ].map(([n, t, d]) => (
            <div key={n} className="card p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-400 text-2xl font-black text-white [font-family:var(--font-playfair)]">{n}</div>
              <h3 className="mt-5 text-xl font-bold">{t}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="artisans" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">Artisans</p>
              <h2 className="mt-3 text-4xl font-black [font-family:var(--font-playfair)]">Profils visibles sur la plateforme</h2>
            </div>
            <Link href="/signup/artisan" className="btn-secondary hidden lg:inline-flex">Créer mon profil</Link>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {artisans.map((artisan) => {
              const avg = artisan.reviews.length
                ? artisan.reviews.reduce((acc, review) => acc + review.rating, 0) / artisan.reviews.length
                : 0;

              return (
                <div key={artisan.id} className="card overflow-hidden">
                  <div className="bg-zinc-950 p-6 text-white">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-400 text-lg font-black text-white [font-family:var(--font-playfair)]">
                          {initials(artisan.user.firstName, artisan.user.lastName)}
                        </div>
                        <div>
                          <div className="font-bold">{artisan.businessName}</div>
                          <div className="text-sm text-brand-200">{artisan.trade} · {artisan.city}</div>
                        </div>
                      </div>
                      {artisan.isPremium && <span className="rounded-full bg-brand-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">Premium</span>}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1 text-brand-500">
                      {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                      <span className="ml-2 text-sm text-zinc-600">{avg ? avg.toFixed(1) : 'Nouveau'} {artisan.reviews.length ? `(${artisan.reviews.length} avis)` : ''}</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-zinc-600">{artisan.bio}</p>
                    <div className="mt-4 space-y-1 text-sm text-zinc-700">
                      <div><strong>Expérience :</strong> {artisan.yearsExperience} ans</div>
                      <div><strong>Tarif horaire :</strong> {formatCurrency(artisan.hourlyRateCents)}</div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {artisan.availabilitySlots.map((slot) => (
                        <span key={slot.id} className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-700">
                          {new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(slot.startsAt)}
                        </span>
                      ))}
                    </div>
                    <Link href={`/artisan/${artisan.slug}`} className="btn-primary mt-6 w-full">Voir le profil</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="tarifs" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">Abonnements artisans</p>
          <h2 className="mt-3 text-4xl font-black [font-family:var(--font-playfair)]">Un modèle simple : seuls les artisans paient</h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-600">Les particuliers n’ont jamais rien à payer. Le business model repose uniquement sur les abonnements Basic et Premium.</p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="card p-8">
            <h3 className="text-2xl font-black [font-family:var(--font-playfair)]">Basic</h3>
            <p className="mt-2 text-zinc-600">Pour démarrer sur la plateforme</p>
            <div className="mt-4 text-5xl font-black [font-family:var(--font-playfair)]">40€<span className="text-lg font-medium text-zinc-500">/mois HT</span></div>
            <ul className="mt-6 space-y-3 text-sm text-zinc-700">
              <li>Profil artisan visible</li>
              <li>Jusqu’à 20 rendez-vous / mois</li>
              <li>Agenda basique</li>
              <li>Avis clients vérifiés</li>
              <li>Notifications email</li>
            </ul>
            <Link href="/signup/artisan?plan=BASIC" className="btn-secondary mt-8 w-full">Choisir Basic</Link>
          </div>
          <div className="card border-brand-300 p-8 ring-2 ring-brand-200">
            <div className="inline-flex rounded-full bg-brand-400 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">Le plus populaire</div>
            <h3 className="mt-4 text-2xl font-black [font-family:var(--font-playfair)]">Premium</h3>
            <p className="mt-2 text-zinc-600">Pour maximiser la visibilité et les rendez-vous</p>
            <div className="mt-4 text-5xl font-black [font-family:var(--font-playfair)]">90€<span className="text-lg font-medium text-zinc-500">/mois HT</span></div>
            <ul className="mt-6 space-y-3 text-sm text-zinc-700">
              <li>Profil mis en avant</li>
              <li>Rendez-vous illimités</li>
              <li>Agenda avancé</li>
              <li>Badge Premium et statistiques</li>
              <li>Support prioritaire</li>
            </ul>
            <Link href="/signup/artisan?plan=PREMIUM" className="btn-primary mt-8 w-full">Choisir Premium</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
