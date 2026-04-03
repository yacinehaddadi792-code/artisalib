import Link from 'next/link';
import { User } from '@prisma/client';

export async function Header({ user }: { user: (User & { artisanProfile?: { slug: string } | null }) | null }) {
  const dashboardHref = user?.role === 'ARTISAN' ? '/artisan' : user?.role === 'ADMIN' ? '/admin' : '/client';

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-400 text-white">A</div>
          <div className="text-2xl font-black [font-family:var(--font-playfair)]">Artisa<span className="text-brand-500">lib</span></div>
        </Link>
        <nav className="hidden items-center gap-3 md:flex">
          <Link href="/#fonctionnement" className="text-sm font-medium text-zinc-700 hover:text-zinc-950">Comment ça marche</Link>
          <Link href="/#tarifs" className="text-sm font-medium text-zinc-700 hover:text-zinc-950">Tarifs</Link>
          <Link href="/#artisans" className="text-sm font-medium text-zinc-700 hover:text-zinc-950">Artisans</Link>
          {user ? (
            <Link href={dashboardHref} className="btn-primary">Mon espace</Link>
          ) : (
            <>
              <Link href="/login" className="btn-muted">Connexion</Link>
              <Link href="/signup/artisan" className="btn-primary">Espace artisan</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
