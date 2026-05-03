"use client";

import { useState } from "react";

export default function ProfileForm({ user }: { user: any }) {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/client/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, phone }),
    });

    if (res.ok) {
      setMessage("Profil mis à jour ✅");
    } else {
      setMessage("Erreur lors de la mise à jour ❌");
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="input w-full"
          placeholder="Prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          className="input w-full"
          placeholder="Nom"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <input
        className="input w-full"
        placeholder="Téléphone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <p className="rounded-2xl bg-zinc-50 p-4 text-zinc-600">
        Email : <strong>{user.email}</strong>
      </p>

      <button className="w-full rounded-2xl bg-[#111] px-6 py-4 font-bold text-white hover:bg-amber-800">
        Enregistrer les modifications
      </button>

      {message && (
        <p className="rounded-2xl bg-amber-50 p-4 text-amber-900">
          {message}
        </p>
      )}
    </form>
  );
}