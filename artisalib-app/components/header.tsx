import Link from "next/link";
import { User } from "@prisma/client";
import LogoutButton from "./logout-button";

type HeaderUser =
  | (User & { artisanProfile?: { slug: string } | null })
  | null;

export async function Header({ user }: { user: HeaderUser }) {
  const dashboardHref =
    user?.role === "ARTISAN"
      ? "/artisan"
      : user?.role === "ADMIN"
      ? "/admin"
      : "/client";

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-400 text-white">
            A
          </div>

          <div className="text-2xl font-black [font-family:var(--font-playfair)]">
            Artisa<span className="text-brand-500">lib</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          <Link
            href="/#fonctionnement"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-950"
          >
            Comment ça marche
          </Link>

          <Link
            href="/artisans"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-950"
          >
            Artisans
          </Link>

          {user ? (
            <>
              <Link href={dashboardHref} className="btn-primary">
                Mon espace
              </Link>

              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn-muted">
                Connexion
              </Link>

              <Link href="/register" className="btn-primary">
                Créer un compte
              </Link>
            </>
          )}
        </nav>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-xl border px-4 py-2 font-bold">
            ☰
          </summary>

          <div className="absolute right-0 mt-3 flex w-56 flex-col gap-3 rounded-2xl border bg-white p-4 shadow-xl">
            <Link href="/#fonctionnement">Comment ça marche</Link>
            <Link href="/artisans">Artisans</Link>

            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="btn-primary text-center"
                >
                  Mon espace
                </Link>

                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login" className="btn-muted text-center">
                  Connexion
                </Link>

                <Link href="/register" className="btn-primary text-center">
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </details>
      </div>
    </header>
  );
}