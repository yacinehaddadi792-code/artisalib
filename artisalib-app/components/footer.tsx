import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="text-2xl font-black [font-family:var(--font-playfair)]">Artisa<span className="text-brand-300">lib</span></div>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            La plateforme de mise en relation entre artisans du bâtiment et particuliers, pensée sur le modèle Doctolib.
          </p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Particuliers</h3>
          <div className="mt-4 space-y-3 text-sm text-zinc-300">
            <Link href="/signup/client">Créer un compte</Link><br />
            <Link href="/#artisans">Trouver un artisan</Link>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Artisans</h3>
          <div className="mt-4 space-y-3 text-sm text-zinc-300">
            <Link href="/signup/artisan">Créer mon profil</Link><br />
            <Link href="/#tarifs">Tarifs</Link>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Légal</h3>
          <p className="mt-4 text-sm text-zinc-400">CGU, politique de confidentialité, mentions légales à compléter avant mise en production.</p>
        </div>
      </div>
    </footer>
  );
}
