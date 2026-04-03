import { SignupClientForm } from '@/components/signup-client-form';

export default function SignupClientPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl gap-8 px-6 py-12 lg:grid-cols-2 lg:px-8">
      <section className="rounded-[2rem] bg-white p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">Particuliers</p>
        <h1 className="mt-4 text-5xl font-black leading-tight [font-family:var(--font-playfair)]">Créer un compte gratuit.</h1>
        <p className="mt-4 max-w-lg text-zinc-600">Recherche d’artisans, devis et gestion des rendez-vous sans aucun paiement côté client.</p>
      </section>
      <section className="card p-8 lg:p-10">
        <SignupClientForm />
      </section>
    </main>
  );
}
