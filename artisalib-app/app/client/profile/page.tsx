import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ProfileForm from "./profile-form";

export default async function ClientProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Profil client
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Modifier mon profil
        </h1>

        <ProfileForm user={user} />
      </div>
    </main>
  );
}