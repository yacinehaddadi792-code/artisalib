import Link from 'next/link'

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <div className="text-center">
        <h1 className="text-5xl font-black [font-family:var(--font-playfair)]">
          Créer un compte Artisalib
        </h1>
        <p className="mt-4 text-zinc-600">
          Choisissez le type de compte que vous souhaitez créer.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Link href="/signup/client" className="card p-8 hover:shadow-xl">
          <h2 className="text-2xl font-bold">Je suis un client</h2>
          <p className="mt-3 text-zinc-600">
            Créez une demande, trouvez un artisan et discutez avec lui.
          </p>
          <span className="btn-primary mt-6 inline-block">
            Créer un compte client
          </span>
        </Link>

        <Link href="/signup/artisan" className="card p-8 hover:shadow-xl">
          <h2 className="text-2xl font-bold">Je suis un artisan</h2>
          <p className="mt-3 text-zinc-600">
            Recevez des demandes, répondez aux clients et développez votre activité.
          </p>
          <span className="btn-primary mt-6 inline-block">
            Créer un compte artisan
          </span>
        </Link>
      </div>
    </main>
  )
}