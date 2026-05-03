export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-8 text-4xl font-bold">Mentions légales</h1>

      <div className="space-y-6 text-zinc-700">
        <h2 className="text-2xl font-bold text-zinc-900">
          Éditeur du site
        </h2>
        <p>Le site Artisalib est édité par Yacine Haddadi.</p>
        <p>Contact : contact@artisalib.com</p>

        <h2 className="text-2xl font-bold text-zinc-900">
          Site internet
        </h2>
        <p>Adresse du site : www.artisalib.com</p>

        <h2 className="text-2xl font-bold text-zinc-900">
          Hébergement
        </h2>
        <p>Le site est hébergé par Vercel Inc.</p>
        <p>
          Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723,
          États-Unis.
        </p>

        <h2 className="text-2xl font-bold text-zinc-900">
          Propriété intellectuelle
        </h2>
        <p>
          Toute reproduction, représentation, modification ou exploitation
          totale ou partielle du site sans autorisation préalable est
          interdite.
        </p>

        <h2 className="text-2xl font-bold text-zinc-900">
          Responsabilité
        </h2>
        <p>
          Artisalib met tout en œuvre pour assurer l’exactitude des
          informations présentes sur le site, mais ne peut garantir
          l’absence d’erreurs ou d’interruptions.
        </p>
      </div>
    </main>
  );
}