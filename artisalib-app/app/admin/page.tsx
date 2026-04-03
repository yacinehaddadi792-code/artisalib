import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') redirect('/login');

  const [users, artisans, bookings] = await Promise.all([
    prisma.user.count(),
    prisma.artisanProfile.count(),
    prisma.booking.count(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">Administration</p>
      <h1 className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">Pilotage plateforme</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="card p-6"><div className="text-xs uppercase tracking-[0.15em] text-zinc-500">Utilisateurs</div><div className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">{users}</div></div>
        <div className="card p-6"><div className="text-xs uppercase tracking-[0.15em] text-zinc-500">Artisans</div><div className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">{artisans}</div></div>
        <div className="card p-6"><div className="text-xs uppercase tracking-[0.15em] text-zinc-500">Réservations</div><div className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">{bookings}</div></div>
      </div>
    </main>
  );
}
