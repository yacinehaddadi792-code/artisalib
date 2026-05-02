export default function HomePage() {
  return (
    <main>
      <section className="bg-zinc-950 px-6 py-24 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
              Artisalib · Trouvez ou recevez des devis
            </p>

            <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl [font-family:var(--font-playfair)]">
              Trouvez un artisan fiable près de chez vous.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
              Recherchez directement un artisan ou publiez une demande pour recevoir des réponses ciblées.
            </p>

            <form
              action="/artisans"
              method="GET"
              className="mt-8 flex max-w-3xl flex-col gap-3 rounded-2xl bg-white p-3 md:flex-row"
            >
              <input
                name="trade"
                placeholder="Métier : plombier, peintre..."
                className="input flex-1 text-zinc-900"
              />

              <input
                name="city"
                placeholder="Ville"
                className="input flex-1 text-zinc-900"
              />

              <button type="submit" className="btn-primary">
                Rechercher
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/client" className="btn-primary">
                📩 Faire une demande
              </a>
              <a href="/register" className="rounded-full border border-white/20 px-5 py-3 font-semibold text-white">
                Je suis artisan
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white/10 p-8">
            <h2 className="text-2xl font-bold">Comment ça marche ?</h2>

            <div className="mt-6 space-y-5">
              <div className="rounded-2xl bg-white p-5 text-zinc-900">
                <h3 className="font-bold">1. Cherchez un artisan</h3>
                <p className="mt-2 text-sm text-zinc-600">Trouvez un profil par métier et ville.</p>
              </div>

              <div className="rounded-2xl bg-white p-5 text-zinc-900">
                <h3 className="font-bold">2. Publiez une demande</h3>
                <p className="mt-2 text-sm text-zinc-600">Les artisans concernés peuvent vous répondre.</p>
              </div>

              <div className="rounded-2xl bg-white p-5 text-zinc-900">
                <h3 className="font-bold">3. Échangez avec l’artisan</h3>
                <p className="mt-2 text-sm text-zinc-600">Comparez les réponses et discutez directement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-50 px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="card p-6">
            <h2 className="text-xl font-bold">Recherche directe</h2>
            <p className="mt-3 text-zinc-600">
              Trouvez un artisan comme sur Doctolib : métier, ville, profil, contact.
            </p>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold">Demandes ciblées</h2>
            <p className="mt-3 text-zinc-600">
              Publiez une demande et recevez des réponses d’artisans adaptés.
            </p>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold">Espace sécurisé</h2>
            <p className="mt-3 text-zinc-600">
              Clients et artisans disposent chacun d’un dashboard dédié.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}