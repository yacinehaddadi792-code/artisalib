import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'

export default async function ArtisanPage({ params, }: { params: Promise<{id: string}> }) {
  const { id } = await params 
  const artisan = await prisma.artisanProfile.findUnique ({
    where: { id },
    include: {
      user: true,
      reviews: {
        include: { author: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!artisan) { notFound() }

  const contactUrl = `/client?trade=${encodeURIComponent(artisan.trade)}&city=${encodeURIComponent(artisan.city)}&artisan=${encodeURIComponent(artisan.businessName)}`

  const averageRating =
    artisan.reviews.length > 0
      ? artisan.reviews.reduce((sum, r) => sum + r.rating, 0) / artisan.reviews.length
      : null

  return (
    <main className="bg-stone-50 px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-[2rem] bg-zinc-950 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-400">
            Profil artisan
          </p>

          <h1 className="mt-4 text-5xl font-black [font-family:var(--font-playfair)]">
            {artisan.businessName}
          </h1>

          <p className="mt-3 text-lg text-zinc-300">
            {artisan.trade} · {artisan.city}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={contactUrl} className="btn-primary">
              📩 Envoyer une demande
            </a>

            <a
              href={`mailto:${artisan.user.email}`}
              className="rounded-full border border-white/20 px-5 py-3 font-semibold text-white"
            >
              ✉️ Email direct
            </a>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="card p-6">
            <p className="text-sm text-zinc-500">Métier</p>
            <p className="mt-2 text-xl font-bold">{artisan.trade}</p>
          </div>

          <div className="card p-6">
            <p className="text-sm text-zinc-500">Ville</p>
            <p className="mt-2 text-xl font-bold">{artisan.city}</p>
          </div>

          <div className="card p-6">
            <p className="text-sm text-zinc-500">Tarif</p>
            <p className="mt-2 text-xl font-bold">
              {artisan.hourlyRateCents ? `${artisan.hourlyRateCents / 100} €/h` : 'Non renseigné'}
            </p>
          </div>
        </section>

        <section className="card mt-8 p-8">
          <h2 className="text-2xl font-bold">À propos</h2>
          <p className="mt-4 text-zinc-600">
            Artisan spécialisé en {artisan.trade} à {artisan.city}. Contactez ce professionnel pour obtenir un devis ou discuter de votre besoin.
          </p>
        </section>

        <section className="card mt-8 p-8">
          <h2 className="text-2xl font-bold">Avis clients</h2>

          <p className="mt-2 text-zinc-600">
            {averageRating ? `Note moyenne : ${averageRating.toFixed(1)}/5` : 'Aucun avis pour le moment.'}
          </p>

          <div className="mt-6 space-y-4">
            {artisan.reviews.map((review) => (
              <div key={review.id} className="rounded-2xl bg-zinc-50 p-4">
                <p className="font-semibold">
                  {review.author.firstName} {review.author.lastName} — {review.rating}/5
                </p>
                <p className="mt-2 text-zinc-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}