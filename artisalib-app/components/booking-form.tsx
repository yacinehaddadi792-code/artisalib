'use client';

import { useState } from 'react';

type Slot = { id: string; startsAt: string; endsAt: string };

export function BookingForm({ artisanId, slots }: { artisanId: string; slots: Slot[] }) {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(slots[0] ?? null);
  const [form, setForm] = useState({ address: '', city: '', postalCode: '', requestNote: '' });
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artisanId, startsAt: selectedSlot.startsAt, endsAt: selectedSlot.endsAt, ...form }),
    });
    const data = await response.json();
    setMessage(data.message || data.error);
  }

  return (
    <form className="mt-4 space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="label">Créneau</label>
        <div className="grid gap-2">
          {slots.map((slot) => (
            <button key={slot.id} type="button" className={`rounded-2xl border px-4 py-3 text-left text-sm ${selectedSlot?.id === slot.id ? 'border-brand-400 bg-brand-50 text-brand-800' : 'border-zinc-200 bg-white'}`} onClick={() => setSelectedSlot(slot)}>
              {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(slot.startsAt))}
            </button>
          ))}
        </div>
      </div>
      <div><label className="label">Adresse d’intervention</label><input className="input" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><label className="label">Ville</label><input className="input" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
        <div><label className="label">Code postal</label><input className="input" required value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} /></div>
      </div>
      <div><label className="label">Besoin / demande</label><textarea className="input min-h-28" value={form.requestNote} onChange={(e) => setForm({ ...form, requestNote: e.target.value })} /></div>
      {message && <p className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-700">{message}</p>}
      <button className="btn-primary w-full">Confirmer la réservation</button>
    </form>
  );
}
