'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setMessage(data.error || 'Connexion impossible');
    router.push(data.redirectTo || '/');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="label">Email</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" required />
      </div>
      <div>
        <label className="label">Mot de passe</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Votre mot de passe" required />
      </div>
      {message && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>}
      <button className="btn-primary w-full" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</button>
      <p className="text-sm text-zinc-500">Comptes de démonstration après seed : admin@artisalib.local, artisan@artisalib.local, client@artisalib.local / mot de passe ChangeMe123!</p>
    </form>
  );
}
