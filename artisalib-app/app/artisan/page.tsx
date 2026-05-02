import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'

export default async function ArtisanDashboard({
  searchParams,
}: {
  searchParams: Promise<{ upgrade?: string; error?: string }>
}) {
  const params = await searchParams
  const user = await getCurrentUser()

  if (!user || user.role !== 'ARTISAN' || !user.artisanProfile) {
    redirect('/login')
  }

  const artisan = user.artisanProfile

  const [bookings, reviews, quotes, requests, conversations, responseCount] =
    await Promise.all([
      prisma.booking.findMany({
        where: { artisanId: artisan.id },
        include: { client: true },
        orderBy: { startsAt: 'asc' },
        take: 10,
      }),

      prisma.review.findMany({
        where: { artisanId: artisan.id },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      prisma.quote.findMany({
        where: { artisanId: artisan.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      prisma.request.findMany({
        where: {
          trade: artisan.trade.trim(),
          city: artisan.city.trim(),
        },
        include: {
          user: true,
          responses: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),

      prisma.conversation.findMany({
        where: { artisanId: artisan.id },
        include: {
          client: true,
          request: true,
        },
        orderBy: { createdAt: 'desc' },
      }),

      prisma.requestResponse.count({
        where: { artisanId: artisan.id },
      }),
    ])

  const plan = artisan.subscriptionPlan || 'FREE'
  const status = artisan.subscriptionStatus || 'INACTIVE'

  const isPaid =
    (plan === 'BASIC' || plan === 'PREMIUM') &&
    (status === 'ACTIVE' || status === 'TRIAL')

  const freeLimit = 3
  const remainingResponses = Math.max(0, freeLimit - responseCount)

  const monthlyRevenue = quotes
    .filter((q) => q.status === 'ACCEPTED' || q.status === 'SENT')
    .reduce((sum, q) => sum + q.amountCents, 0)

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">
            Tableau de bord artisan
          </p>

          <h1 className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">
            {artisan.businessName}

            {artisan.subscriptionPlan === "PREMIUM" && (
              <span 
                 style={{
                   marginLeft: 10,
                   background: "gold",
                   padding: "4px 8px",
                   borderRadius: 6,
                   fontSize: 12
                }}
               >
            ⭐ Premium
            </span>
              )}
            </h1>
    

          <p className="mt-2 text-zinc-600">
            {artisan.trade.trim()} · {artisan.city.trim()}
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Plan actuel : <strong>{plan}</strong> · statut : <strong>{status}</strong>
          </p>
        </div>

        <a href="#abonnements" className="btn-primary">
          Gérer mon abonnement
        </a>
      </div>

      {params?.upgrade === 'limit' && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
          <h2 className="font-bold">Limite gratuite atteinte</h2>
          <p className="mt-2">
            Vous avez utilisé vos 3 réponses gratuites. Passez à Basic ou Premium
            pour répondre à toutes les demandes.
          </p>
        </div>
      )}

      {params?.error === 'already-answered' && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
          Vous avez déjà répondu à cette demande.
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-6">
        <div className="card p-6">
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Demandes ciblées</p>
          <p className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">{requests.length}</p>
        </div>

        <div className="card p-6">
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Réponses envoyées</p>
          <p className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">{responseCount}</p>
        </div>

        <div className="card p-6">
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Restantes gratuites</p>
          <p className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">
            {isPaid ? '∞' : remainingResponses}
          </p>
        </div>

        <div className="card p-6">
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Conversations</p>
          <p className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">{conversations.length}</p>
        </div>

        <div className="card p-6">
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Avis</p>
          <p className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">{reviews.length}</p>
        </div>

        <div className="card p-6">
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">CA potentiel</p>
          <p className="mt-2 text-3xl font-black [font-family:var(--font-playfair)]">
            {formatCurrency(monthlyRevenue)}
          </p>
        </div>
      </div>

      <section id="abonnements" className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">
            Basic
          </p>
          <h2 className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">
            25,99€ / mois
          </h2>
          <p className="mt-2 text-zinc-600">7 jours gratuits</p>

          <ul className="mt-5 space-y-2 text-sm text-zinc-700">
            <li>✅ Réponses illimitées aux demandes</li>
            <li>✅ Chat illimité avec les clients</li>
            <li>✅ Profil visible dans la recherche</li>
            <li>✅ Accès aux demandes métier + ville</li>
          </ul>

          <form action="/api/stripe/create-checkout-session" method="POST" className="mt-6">
            <input type="hidden" name="plan" value="BASIC" />
            <button className="btn-primary w-full">Activer Basic</button>
          </form>
        </div>

        <div className="card border-2 border-amber-400 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-600">
            Premium recommandé
          </p>
          <h2 className="mt-2 text-4xl font-black [font-family:var(--font-playfair)]">
            45,95€ / mois
          </h2>
          <p className="mt-2 text-zinc-600">Pour obtenir plus de clients</p>

          <ul className="mt-5 space-y-2 text-sm text-zinc-700">
            <li>✅ Tout le Basic</li>
            <li>🔥 Priorité dans les résultats</li>
            <li>⭐ Badge Premium</li>
            <li>📈 Meilleure visibilité</li>
            <li>📩 Notifications prioritaires</li>
          </ul>

          <form action="/api/stripe/create-checkout-session" method="POST" className="mt-6">
            <input type="hidden" name="plan" value="PREMIUM" />
            <button className="btn-primary w-full">Activer Premium</button>
          </form>
        </div>
      </section>

      <section className="card mt-8 overflow-hidden">
        <div className="border-b border-zinc-200 px-6 py-4">
          <h2 className="text-xl font-bold">Conversations</h2>
        </div>

        <div className="divide-y divide-zinc-200">
          {conversations.length === 0 ? (
            <p className="px-6 py-6 text-zinc-500">Aucune conversation.</p>
          ) : (
            conversations.map((c) => (
              <a key={c.id} href={`/chat/${c.id}`} className="block px-6 py-5 hover:bg-zinc-50">
                <p className="font-semibold">{c.request.title}</p>
                <p className="text-sm text-zinc-500">
                  Client : {c.client.firstName} {c.client.lastName}
                </p>
              </a>
            ))
          )}
        </div>
      </section>

      <section className="card mt-8 overflow-hidden">
        <div className="border-b border-zinc-200 px-6 py-4">
          <h2 className="text-xl font-bold">Demandes adaptées à votre activité</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Vous pouvez répondre gratuitement à 3 demandes. Ensuite, un abonnement est requis.
          </p>
        </div>

        <div className="divide-y divide-zinc-200">
          {requests.length === 0 ? (
            <p className="px-6 py-6 text-zinc-500">
              Aucune demande correspondant à votre profil pour le moment.
            </p>
          ) : (
            requests.map((r) => {
              const alreadyAnswered = r.responses?.some(
                (response) => response.artisanId === artisan.id
              )

              return (
                <div key={r.id} className="px-6 py-5">
                  <h3 className="text-lg font-bold">{r.title}</h3>
                  <p className="mt-2 text-zinc-700">{r.description}</p>

                  <div className="mt-4 grid gap-2 text-sm text-zinc-600 md:grid-cols-2">
                    <p><strong>Métier :</strong> {r.trade}</p>
                    <p><strong>Ville :</strong> {r.city}</p>
                    <p><strong>Urgence :</strong> {r.urgency}</p>
                    {r.budget && <p><strong>Budget :</strong> {r.budget} €</p>}
                  </div>

                  <div className="mt-4 text-sm text-zinc-500">
                    <p>Client : {r.user.firstName} {r.user.lastName}</p>
                    <p>Email : {r.user.email}</p>
                    {r.user.phone && <p>Téléphone : {r.user.phone}</p>}
                  </div>

                  {alreadyAnswered ? (
                    <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">
                      Vous avez déjà répondu à cette demande.
                    </p>
                  ) : !isPaid && responseCount >= freeLimit ? (
                    <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                      <p className="font-semibold">Limite gratuite atteinte.</p>
                      <p>Passez à Basic ou Premium pour répondre à cette demande.</p>
                      <a href="#abonnements" className="btn-primary mt-3 inline-block">
                        Voir les abonnements
                      </a>
                    </div>
                  ) : (
                    <form action="/api/request-quotes" method="POST" className="mt-4 space-y-3">
  <input type="hidden" name="requestId" value={r.id} />

  <input
    name="amount"
    placeholder="Montant du devis (€)"
    className="input"
    required
  />

  <textarea
    name="workDescription"
    placeholder="Description précise des travaux"
    className="input min-h-28"
    required
  />

  <input
    name="estimatedDelay"
    placeholder="Délai estimé ex : 2 jours, 1 semaine"
    className="input"
  />

  <input
    name="validUntil"
    placeholder="Devis valable jusqu’au ex : 30/06/2026"
    className="input"
  />

  <textarea
    name="message"
    placeholder="Message complémentaire au client"
    className="input min-h-24"
  />

  <button className="btn-primary">Envoyer le devis</button>
</form>                 

 )}
                </div>
              )
            })
          )}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <section className="card overflow-hidden">
          <div className="border-b border-zinc-200 px-6 py-4">
            <h2 className="text-xl font-bold">Réservations</h2>
          </div>

          <div className="divide-y divide-zinc-200">
            {bookings.length === 0 ? (
              <p className="px-6 py-6 text-zinc-500">Aucune réservation.</p>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="px-6 py-4">
                  <p className="font-semibold">
                    {booking.client.firstName} {booking.client.lastName}
                  </p>
                  <p className="text-sm text-zinc-600">
                    {new Intl.DateTimeFormat('fr-FR', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(booking.startsAt)} · {booking.city}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold">Profil public</h2>
            <div className="mt-4 space-y-2 text-sm text-zinc-700">
              <p><strong>Métier :</strong> {artisan.trade.trim()}</p>
              <p><strong>Ville :</strong> {artisan.city.trim()}</p>
              <p><strong>Tarif horaire :</strong> {formatCurrency(artisan.hourlyRateCents)}</p>
              <p><strong>Visible :</strong> {artisan.visible ? 'Oui' : 'Non'}</p>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold">Derniers avis</h2>
            {reviews.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-500">Aucun avis.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="mt-4 rounded-2xl bg-zinc-50 p-4 text-sm">
                  <p className="font-semibold">
                    {review.author.firstName} {review.author.lastName} — {review.rating}/5
                  </p>
                  <p className="mt-2 text-zinc-600">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  )
}