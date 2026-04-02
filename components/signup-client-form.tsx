'use client';

import { useState } from 'react';

export function SignupClientForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role: 'CLIENT' }),
    });

    const data = await response.json();
    setLoading(false);
    setMessage(data.message || data.error);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div><label className="label">Prénom</label><input className="input" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
        <div><label className="label">Nom</label><input className="input" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
      </div>
      <div><label className="label">Email</label><input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
      <div><label className="label">Mot de passe</label><input className="input" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
      {message && <p className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-700">{message}</p>}
      <button className="btn-primary w-full" disabled={loading}>{loading ? 'Création...' : 'Créer mon compte gratuitement'}</button>
    </form>
  );
}
