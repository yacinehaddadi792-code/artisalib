'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from "next/navigation"

export default function ArtisansPage() {
  const searchParams = useSearchParams()
  const [trade, setTrade] = useState(searchParams.get("trade") || "")
  const [city, setCity] = useState(searchParams.get("city") || "")
  const [artisans, setArtisans] = useState<any[]>([])

  async function searchArtisans() {
    const params = new URLSearchParams()

    if (trade) params.set('trade', trade)
    if (city) params.set('city', city)

    const res = await fetch(`/api/artisans?${params.toString()}`)
    const data = await res.json()

    setArtisans(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    searchArtisans()
  }, [trade, city])

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px' }}>
      <h1 style={{ fontSize: 36, fontWeight: 800 }}>Trouver un artisan</h1>
      <p style={{ marginTop: 8, color: '#666' }}>
        Recherchez un artisan par métier et par ville.
      </p>

      <div style={searchBox}>
        <input
          placeholder="Métier ex : Plombier"
          value={trade}
          onChange={(e) => setTrade(e.target.value)}
          style={input}
        />

        <input
          placeholder="Ville ex : Paris"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={input}
        />

        <button onClick={searchArtisans} style={button}>
          Rechercher
        </button>
      </div>

      <div style={{ marginTop: 30 }}>
        {artisans.length === 0 ? (
          <p>Aucun artisan trouvé.</p>
        ) : (
          artisans.map((artisan) => (
            <div key={artisan.id} style={card}>
              <h2>{artisan.businessName}</h2>
              <p><strong>Métier :</strong> {artisan.trade}</p>
              <p><strong>Ville :</strong> {artisan.city}</p>
              <p><strong>Tarif :</strong> {artisan.hourlyRateCents ? `${artisan.hourlyRateCents / 100} €/h` : 'Non renseigné'}</p>
              <p><strong>Avis :</strong> {artisan.reviews?.length || 0}</p>

              <a href={`/artisans/${artisan.id}`} style={linkBtn}>
                Voir le profil
              </a>
            </div>
          ))
        )}
      </div>
    </main>
  )
}

const searchBox = {
  display: 'grid',
  gap: 12,
  marginTop: 25,
  padding: 20,
  border: '1px solid #ddd',
  borderRadius: 12,
}

const input = {
  padding: 12,
  border: '1px solid #ccc',
  borderRadius: 8,
}

const button = {
  padding: 12,
  background: '#111',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
}

const card = {
  border: '1px solid #ddd',
  borderRadius: 12,
  padding: 20,
  marginBottom: 15,
  background: '#fff',
}

const linkBtn = {
  display: 'inline-block',
  marginTop: 12,
  padding: '10px 14px',
  background: '#111',
  color: '#fff',
  borderRadius: 8,
  textDecoration: 'none',
}