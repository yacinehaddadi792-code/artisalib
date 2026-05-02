'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ClientDashboard() {
  const searchParams = useSearchParams()

  const [tab, setTab] = useState('home')
  const [user, setUser] = useState<any>(null)
  const [requests, setRequests] = useState<any[]>([])
  const [conversations, setConversations] = useState<any[]>([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [trade, setTrade] = useState('')
  const [city, setCity] = useState('')
  const [urgency, setUrgency] = useState('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  async function loadRequests() {
    const res = await fetch('/api/requests')
    const data = await res.json()
    setRequests(Array.isArray(data) ? data : [])
  }

  async function loadConversations() {
    const res = await fetch('/api/conversations')
    const data = await res.json()
    setConversations(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    fetch('/api/me')
      .then((res) => res.json())
      .then((data) => setUser(data))

    loadRequests()
    loadConversations()
  }, [])

  useEffect(() => {
    const urlTrade = searchParams.get('trade')
    const urlCity = searchParams.get('city')
    const urlArtisan = searchParams.get('artisan')

    if (urlTrade) setTrade(urlTrade)
    if (urlCity) setCity(urlCity)
    if (urlArtisan) {
      setTitle(`Demande pour ${urlArtisan}`)
      setTab('requests')
    }
  }, [searchParams])

  async function createRequest() {
    setMessage(null)

    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, trade, city, urgency, budget }),
    })

    const data = await res.json()

    if (!res.ok) {
      setMessage(data.error || 'Erreur lors de la création.')
      return
    }

    setTitle('')
    setDescription('')
    setTrade('')
    setCity('')
    setUrgency('')
    setBudget('')
    setMessage('Demande créée avec succès.')

    await loadRequests()
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={sidebar}>
        <h2>Artisalib</h2>
        <button style={btn} onClick={() => setTab('home')}>🏠 Accueil</button>
        <button style={btn} onClick={() => setTab('requests')}>📩 Mes demandes</button>
        <button style={btn} onClick={() => setTab('conversations')}>💬 Conversations</button>
        <button style={btn} onClick={() => setTab('profile')}>👤 Profil</button>
        <button style={btn} onClick={() => setTab('settings')}>⚙️ Paramètres</button>
      </aside>

      <main style={{ flex: 1, padding: '40px' }}>
        {tab === 'home' && (
          <>
            <h1>Bienvenue {user?.firstName} 👋</h1>
            <p>Voici votre espace client Artisalib.</p>

            <div style={card}>
              <h2>Résumé</h2>
              <p>Demandes créées : {requests.length}</p>
              <p>Conversations : {conversations.length}</p>
              <p>Email : {user?.email}</p>
            </div>
          </>
        )}

        {tab === 'requests' && (
          <>
            <h1>📩 Mes demandes</h1>

            <div style={card}>
              <h2>Créer une demande</h2>

              <input style={input} placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
              <input style={input} placeholder="Métier recherché" value={trade} onChange={(e) => setTrade(e.target.value)} />
              <input style={input} placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} />

              <select style={input} value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                <option value="">Urgence</option>
                <option value="Faible">Faible</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Urgente">Urgente</option>
              </select>

              <input style={input} placeholder="Budget estimé (€)" value={budget} onChange={(e) => setBudget(e.target.value)} />

              <textarea
                style={{ ...input, minHeight: 120 }}
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {message && <p>{message}</p>}

              <button style={primaryBtn} onClick={createRequest}>Créer la demande</button>
            </div>

            <h2 style={{ marginTop: 30 }}>Demandes envoyées</h2>

            {requests.length === 0 ? (
              <p>Aucune demande.</p>
            ) : (
              requests.map((r) => (
                <div key={r.id} style={card}>
                  <h3>{r.title}</h3>
                  <p>{r.description}</p>
                  <p><strong>Métier :</strong> {r.trade}</p>
                  <p><strong>Ville :</strong> {r.city}</p>
                  <p><strong>Urgence :</strong> {r.urgency}</p>
                  {r.budget && <p><strong>Budget :</strong> {r.budget} €</p>}

                  <hr style={{ margin: '16px 0' }} />

                  <h4>Réponses reçues</h4>
                  <hr style={{ margin: '16px 0' }} />

<h4>Devis reçus</h4>

{!r.requestQuotes || r.requestQuotes.length === 0 ? (
  <p>Aucun devis pour le moment.</p>
) : (
  r.requestQuotes.map((quote: any) => (
    <div key={quote.id} style={responseBox}>
      <p><strong>{quote.artisan.businessName}</strong></p>
      <p><strong>Montant :</strong> {quote.amount} €</p>
      <p><strong>Travaux :</strong> {quote.workDescription}</p>
      {quote.estimatedDelay && <p><strong>Délai :</strong> {quote.estimatedDelay}</p>}
      {quote.validUntil && <p><strong>Valable jusqu’au :</strong> {quote.validUntil}</p>}
      {quote.message && <p><strong>Message :</strong> {quote.message}</p>}
      <p><strong>Statut :</strong> {quote.status}</p>
      {quote.status === 'SENT' && (
  <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
    <button
      style={primaryBtn}
      onClick={async () => {
        await fetch(`/api/request-quotes/${quote.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'ACCEPTED' }),
        })

        await loadRequests()
      }}
    >
      Accepter le devis
    </button>

    <button
      style={{
        ...primaryBtn,
        background: '#777',
      }}
      onClick={async () => {
        await fetch(`/api/request-quotes/${quote.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'REFUSED' }),
        })

        await loadRequests()
      }}
    >
      Refuser
    </button>
  </div>
)}

{quote.status === 'ACCEPTED' && (
  <p style={{ marginTop: 12, color: 'green', fontWeight: 'bold' }}>
    ✅ Devis accepté
  </p>
)}

{quote.status === 'REFUSED' && (
  <p style={{ marginTop: 12, color: 'red', fontWeight: 'bold' }}>
    ❌ Devis refusé
  </p>
)}
    </div>
  ))
)}
                  {!r.responses || r.responses.length === 0 ? (
                    <p>Aucune réponse pour le moment.</p>
                  ) : (
                    r.responses.map((res: any) => (
                      <div key={res.id} style={responseBox}>
                        <p><strong>{res.artisan.businessName}</strong></p>
                        {res.amount && <p>Prix proposé : {res.amount} €</p>}
                        <p>{res.message}</p>
                      </div>
                    ))
                  )}
                </div>
              ))
            )}
          </>
        )}

        {tab === 'conversations' && (
          <>
            <h1>💬 Mes conversations</h1>

            {conversations.length === 0 ? (
              <p>Aucune conversation.</p>
            ) : (
              conversations.map((c) => (
                <a key={c.id} href={`/chat/${c.id}`} style={conversationCard}>
                  <strong>{c.request?.title}</strong>
                  <p>Artisan : {c.artisan?.businessName}</p>
                </a>
              ))
            )}
          </>
        )}

        {tab === 'profile' && (
          <>
            <h1>👤 Mon profil</h1>
            <div style={card}>
              <p>Nom : {user?.firstName} {user?.lastName}</p>
              <p>Email : {user?.email}</p>
            </div>
          </>
        )}

        {tab === 'settings' && (
          <>
            <h1>⚙️ Paramètres</h1>
            <div style={card}>
              <button style={primaryBtn}>Changer mot de passe</button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

const sidebar = {
  width: '250px',
  background: '#111',
  color: '#fff',
  padding: '20px',
}

const btn = {
  display: 'block',
  width: '100%',
  margin: '10px 0',
  padding: '10px',
  background: 'transparent',
  color: '#fff',
  border: '1px solid #333',
  cursor: 'pointer',
  textAlign: 'left' as const,
}

const card = {
  border: '1px solid #ddd',
  borderRadius: '12px',
  padding: '20px',
  marginTop: '15px',
  background: '#fff',
}

const input = {
  display: 'block',
  width: '100%',
  marginBottom: '12px',
  padding: '12px',
  border: '1px solid #ccc',
  borderRadius: '8px',
}

const primaryBtn = {
  padding: '12px 18px',
  background: '#111',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
}

const responseBox = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '12px',
  marginTop: '10px',
  background: '#fafafa',
}

const conversationCard = {
  display: 'block',
  border: '1px solid #ddd',
  borderRadius: '12px',
  padding: '16px',
  marginTop: '12px',
  textDecoration: 'none',
  color: '#111',
  background: '#fff',
}