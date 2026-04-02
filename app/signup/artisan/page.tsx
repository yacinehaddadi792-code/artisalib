import { SignupArtisanForm } from '@/components/signup-artisan-form';

export default async function SignupArtisanPage({ searchParams }: { searchParams?: Promise<{ plan?: 'BASIC' | 'PREMIUM' }> }) {
  const params = (await searchParams) || {};
  const defaultPlan = params.plan === 'PREMIUM' ? 'PREMIUM' : 'BASIC';

  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl gap-8 px-6 py-12 lg:grid-cols-2 lg:px-8">
      <section className="rounded-[2rem] bg-zinc-950 p-10 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-200">Artisans</p>
        <h1 className="mt-4 text-5xl font-black leading-tight [font-family:var(--font-playfair)]">Rejoignez Artisalib et développez votre clientèle.</h1>
        <ul className="mt-8 space-y-4 text-zinc-300">
          <li>Profil public complet</li>
          <li>Agenda et réservations</li>
          <li>Devis, avis, historique clients</li>
          <li>Abonnement Basic ou Premium</li>
        </ul>
      </section>
      <section className="card p-8 lg:p-10">
        <SignupArtisanForm defaultPlan={defaultPlan} />
      </section>
    </main>
  );
}
