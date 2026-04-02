'use client';

import { useMemo, useState } from 'react';

const plans = {
  BASIC: { label: 'Basic', price: '40€/mois HT' },
  PREMIUM: { label: 'Premium', price: '90€/mois HT' },
} as const;

export function SignupArtisanForm({ defaultPlan = 'BASIC' }: { defaultPlan?: 'BASIC' | 'PREMIUM' }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    businessName: '',
    trade: '',
    city: '',
    subscriptionPlan: defaultPlan,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedPlan = useMemo(() => plans[form.subscriptionPlan], [form.subscriptionPlan]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role: 'ARTISAN' }),
    });
    const data = await response.json();
    setLoading(false);
    setMessage(data.message || data.error);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="rounded-3xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800">
        Plan sélectionné : <strong>{selectedPlan.label}</strong> — {selectedPlan.price}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div><label className="label">Prénom</label><input className="input" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
        <div><label className="label">Nom</label><input className="input" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div><label className="label">Email professionnel</label><input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className="label">Téléphone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
      </div>
      <div><label className="label">Mot de passe</label><input className="input" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
      <div className="grid gap-5 md:grid-cols-2">
        <div><label className="label">Nom de l’entreprise</label><input className="input" required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} /></div>
        <div><label className="label">Métier</label><input className="input" required placeholder="Plombier, peintre..." value={form.trade} onChange={(e) => setForm({ ...form, trade: e.target.value })} /></div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div><label className="label">Ville</label><input className="input" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
        <div>
          <label className="label">Abonnement</label>
          <select className="input" value={form.subscriptionPlan} onChange={(e) => setForm({ ...form, subscriptionPlan: e.target.value as 'BASIC' | 'PREMIUM' })}>
            <option value="BASIC">Basic — 40€/mois HT</option>
            <option value="PREMIUM">Premium — 90€/mois HT</option>
          </select>
        </div>
      </div>
      {message && <p className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-700">{message}</p>}
      <button className="btn-primary w-full" disabled={loading}>{loading ? 'Création...' : 'Créer mon compte artisan'}</button>
      <p className="text-sm text-zinc-500">Après validation email, l’artisan pourra lancer Stripe Checkout pour activer son abonnement.</p>
    </form>
  );
}
