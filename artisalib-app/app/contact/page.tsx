"use client";

import { useState } from "react";

export default function ContactPage() {
  const [message, setMessage] = useState("");

  function handleSubmit(e: any) {
    e.preventDefault();
    alert("Message envoyé au support ✅");
  }

  return (
    <main className="max-w-xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-6">
        Contacter le support
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Expliquez votre problème..."
          className="w-full border rounded-xl p-4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="bg-black text-white px-6 py-3 rounded-xl">
          Envoyer
        </button>
      </form>
    </main>
  );
}