import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl gap-8 px-6 py-12 lg:grid-cols-2 lg:px-8">
      <section className="rounded-[2rem] bg-zinc-950 p-10 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-200">Connexion</p>
        <h1 className="mt-4 text-5xl font-black leading-tight [font-family:var(--font-playfair)]">Accédez à votre espace Artisalib.</h1>
        <p className="mt-4 max-w-lg text-zinc-300">Clients, artisans et administrateurs utilisent la même page de connexion. La redirection se fait selon le rôle.</p>
      </section>
      <section className="card p-8 lg:p-10">
        <LoginForm />
      </section>
    </main>
  );
}
