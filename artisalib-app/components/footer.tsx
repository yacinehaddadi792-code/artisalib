import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t py-6 text-center text-sm text-zinc-500">
      <div className="flex justify-center gap-6">
        <Link href="/cgu">CGU</Link>
        <Link href="/mentions-legales">Mentions légales</Link>
        <Link href="/confidentialite">Confidentialité</Link>
      </div>
    </footer>
  );
}