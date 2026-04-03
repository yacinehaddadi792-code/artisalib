'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function HeroSearch() {
  const router = useRouter();
  const [trade, setTrade] = useState('');
  const [city, setCity] = useState('');

  return (
    <div className="rounded-3xl bg-white p-3 shadow-2xl shadow-zinc-900/10 lg:flex lg:items-center lg:gap-3">
      <input className="input mb-3 lg:mb-0" placeholder="Quel artisan recherchez-vous ?" value={trade} onChange={(e) => setTrade(e.target.value)} />
      <input className="input mb-3 lg:mb-0" placeholder="Ville ou code postal" value={city} onChange={(e) => setCity(e.target.value)} />
      <button className="btn-primary w-full lg:w-auto" onClick={() => router.push(`/?trade=${encodeURIComponent(trade)}&city=${encodeURIComponent(city)}`)}>
        Rechercher
      </button>
    </div>
  );
}
