import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ClientDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [requests, conversations] = await Promise.all([
    prisma.request.findMany({
      where: { userId: user.id },
      include: {
        responses: {
          include: { artisan: true },
        },
        requestQuotes: {
          include: { artisan: true },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),

    prisma.conversation.findMany({
      where: { clientId: user.id },
      include: {
        artisan: true,
        request: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const responseCount = requests.reduce(
    (total, request) => total + request.responses.length,
    0
  );

  const quoteCount = requests.reduce(
    (total, request) => total + request.requestQuotes.length,
    0
  );

  const pendingQuotes = requests.reduce(
    (total, request) =>
      total +
      request.requestQuotes.filter((quote) => quote.status === "SENT").length,
    0
  );

  const latestQuotes = requests.flatMap((request) =>
    request.requestQuotes.map((quote) => ({
      ...quote,
      requestTitle: request.title,
    }))
  );

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl bg-[#111] p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-500">
                Espace client
              </p>

              <h1 className="mt-3 text-4xl font-black">
                Bonjour {user.firstName || "👋"}
              </h1>

              <p className="mt-3 max-w-2xl text-zinc-300">
                Suivez vos demandes, consultez les devis reçus et échangez avec
                les artisans.
              </p>
            </div>

            <Link
              href="/client/request"
              className="rounded-2xl bg-amber-700 px-6 py-4 text-center font-bold text-white hover:bg-amber-800"
            >
              Publier une demande
            </Link>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-4">
          <StatCard
            title="Demandes envoyées"
            value={requests.length.toString()}
          />
          <StatCard title="Réponses reçues" value={responseCount.toString()} />
          <StatCard title="Devis en attente" value={pendingQuotes.toString()} />
          <StatCard
            title="Conversations"
            value={conversations.length.toString()}
          />
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl border bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mes dernières demandes</h2>
            </div>

            {requests.length === 0 ? (
              <EmptyState
                title="Aucune demande pour le moment"
                text="Publiez une demande et recevez des réponses d’artisans qualifiés."
                href="/client/request"
                button="Créer une demande"
              />
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-2xl border bg-zinc-50 p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-bold">{request.title}</h3>

                        <p className="mt-1 text-sm text-zinc-500">
                          {request.trade} · {request.city} · Urgence :{" "}
                          {request.urgency}
                        </p>

                        <p className="mt-3 text-zinc-700">
                          {request.description}
                        </p>
                      </div>

                      <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900">
                        {request.requestQuotes.length} devis
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Accès rapides</h2>

            <div className="mt-6 space-y-3">
              <QuickLink href="/artisans" title="Trouver un artisan" />
              <QuickLink href="/client/request" title="Faire une demande" />
              <QuickLink href="/client/profile" title="Modifier mon profil" />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Devis reçus</h2>

            <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800">
              {quoteCount} devis
            </span>
          </div>

          {latestQuotes.length === 0 ? (
            <EmptyState
              title="Aucun devis reçu"
              text="Les devis des artisans apparaîtront ici dès qu’ils auront répondu à vos demandes."
              href="/artisans"
              button="Chercher un artisan"
            />
          ) : (
            <div className="space-y-4">
              {latestQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="rounded-2xl border bg-zinc-50 p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-bold">
                        {quote.artisan.businessName}
                      </p>

                      <p className="text-sm text-zinc-500">
                        Demande : {quote.requestTitle}
                      </p>

                      <p className="mt-2 text-zinc-700">
                        Montant : <strong>{quote.amount} €</strong>
                      </p>

                      <p className="text-sm text-zinc-500">
                        Statut : {quote.status}
                      </p>
                    </div>

                    <Link
                      href="/client"
                      className="rounded-2xl bg-[#111] px-5 py-3 text-center font-bold text-white hover:bg-amber-800"
                    >
                      Voir le devis
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Conversations</h2>

          {conversations.length === 0 ? (
            <p className="mt-4 text-zinc-500">
              Aucune conversation pour le moment.
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {conversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/chat/${conversation.id}`}
                  className="flex items-center justify-between rounded-2xl border bg-zinc-50 px-4 py-4 font-semibold hover:bg-amber-50 hover:text-amber-800"
                >
                  <span>{conversation.request.title}</span>
                  <span>→</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">{title}</p>
      <p className="mt-3 text-4xl font-black text-zinc-900">{value}</p>
    </div>
  );
}

function QuickLink({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border bg-zinc-50 px-4 py-4 font-semibold hover:bg-amber-50 hover:text-amber-800"
    >
      {title}
      <span>→</span>
    </Link>
  );
}

function EmptyState({
  title,
  text,
  href,
  button,
}: {
  title: string;
  text: string;
  href: string;
  button: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed bg-zinc-50 p-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
        📩
      </div>

      <h3 className="text-xl font-bold">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-zinc-500">{text}</p>

      <Link
        href={href}
        className="mt-6 inline-flex rounded-2xl bg-[#111] px-5 py-3 font-bold text-white hover:bg-amber-800"
      >
        {button}
      </Link>
    </div>
  );
}