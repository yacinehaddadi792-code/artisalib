"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientRequestPage() {
  const router = useRouter();
  const [type, setType] = useState("devis");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [trade, setTrade] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (type === "support") {
      setMessage("Votre réclamation a bien été envoyée au support ✅");
      return;
    }

    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, trade, city, urgency: "Normal" }),
    });

    if (res.ok) router.push("/client");
    else setMessage("Erreur lors de l’envoi de la demande ❌");
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-black">Nouvelle demande</h1>

        <p className="mt-3 text-zinc-500">
          Publiez une demande de devis ou contactez le support Artisalib.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => setType("devis")}
            className={`rounded-2xl px-4 py-3 font-bold ${
              type === "devis" ? "bg-[#111] text-white" : "bg-zinc-100"
            }`}
          >
            Demande de devis
          </button>

          <button
            onClick={() => setType("support")}
            className={`rounded-2xl px-4 py-3 font-bold ${
              type === "support" ? "bg-[#111] text-white" : "bg-zinc-100"
            }`}
          >
            Réclamation
          </button>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            className="input w-full"
            placeholder={
              type === "support" ? "Sujet de la réclamation" : "Titre des travaux"
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {type === "devis" && (
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="input w-full"
                placeholder="Métier ex : plombier"
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                required
              />

              <input
                className="input w-full"
                placeholder="Ville ex : Paris"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
          )}

          <textarea
            className="input min-h-40 w-full"
            placeholder={
              type === "support"
                ? "Expliquez votre problème..."
                : "Décrivez les travaux à réaliser..."
            }
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <button className="w-full rounded-2xl bg-amber-700 px-6 py-4 font-bold text-white hover:bg-amber-800">
            {type === "support" ? "Envoyer la réclamation" : "Publier la demande"}
          </button>
        </form>

        {message && (
          <p className="mt-6 rounded-2xl bg-amber-50 p-4 text-amber-900">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}