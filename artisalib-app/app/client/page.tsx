'use client'

import { useState, useEffect } from 'react'

export default function ClientDashboard() {
  const [tab, setTab] = useState('home')
  const [user, setUser] = useState<any>(null)

  const [requests, setRequests] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [trade, setTrade] = useState('')
  const [city, setCity] = useState('')
  const [urgency, setUrgency] = useState('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => setUser(data))
  }, [])

  useEffect(() => {
    fetch('/api/requests')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRequests(data)
        } else {
          setRequests([])
        }
      })
  }, [])

  const refreshRequests = async () => {
    const res = await fetch('/api/requests')
    const data = await res.json()

    if (Array.isArray(data)) {
      setRequests(data)
    } else {
      setRequests([])
    }
  }

  const createRequest = async () => {
    setMessage(null)

    if (!title || !description || !trade || !city || !urgency) {
      setMessage('Veuillez remplir tous les champs obligatoires.')
      return
    }

    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, trade, city, urgency, budget }),
    })

    const data = await res.json()

    if (!res.ok) {
      setMessage(data.error || 'Erreur lors de la création de la demande.')
      return
    }

    setTitle('')
    setDescription('')
    setTrade('')
    setCity('')
    setUrgency('')
    setBudget('')
    setMessage('Demande créée avec succès.')

    await refreshRequests()
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: '250px', background: '#111', color: '#fff', padding: '20px' }}>
        <h2>Artisalib</h2>

        <button onClick={() => setTab('home')} style={btn}>🏠 Accueil</button>
        <button onClick={() => setTab('requests')} style={btn}>📩 Mes demandes</button>
        <button onClick={() => setTab('profile')} style={btn}>👤 Profil</button>
        <button onClick={() => setTab('settings')} style={btn}>⚙️ Paramètres</button>
      </div>

      <div style={{ flex: 1, padding: '40px' }}>
        {tab === 'home' && (
          <div>
            <h1>Bienvenue {user?.firstName} 👋</h1>
            <p>Voici votre espace client Artisalib.</p>

            <div style={card}>
              <h2>Résumé</h2>
              <p>Demandes créées : {requests.length}</p>
              <p>Compte : {user?.email}</p>
            </div>
          </div>
        )}

        {tab === 'requests' && (
          <div>
            <h1>📩 Mes demandes</h1>

            <div style={card}>
              <h2>Créer une demande</h2>

              <input
                placeholder="Titre de la demande"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={input}
              />

              <input
                placeholder="Métier recherché ex : Plombier, Électricien, Peintre"
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                style={input}
              />

              <input
                placeholder="Ville"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={input}
              />

              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                style={input}
              >
                <option value="">Niveau d’urgence</option>
                <option value="Faible">Faible</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Urgente">Urgente</option>
              </select>

              <input
                placeholder="Budget estimé (€) - optionnel"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                style={input}
              />

              <textarea
                placeholder="Décrivez votre besoin"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ ...input, minHeight: '120px' }}
              />

              {message && <p>{message}</p>}

              <button onClick={createRequest} style={primaryBtn}>
                Créer la demande
              </button>
            </div>

            <div style={{ marginTop: '25px' }}>
              <h2>Demandes envoyées</h2>

              {requests.length === 0 ? (
                <p>Aucune demande pour le moment.</p>
              ) : (
                requests.map((r) => (
                  <div key={r.id} style={card}>
                    <h3>{r.title}</h3>
                    <p>{r.description}</p>
                    <p><strong>Métier :</strong> {r.trade}</p>
                    <p><strong>Ville :</strong> {r.city}</p>
                    <p><strong>Urgence :</strong> {r.urgency}</p>
                    {r.budget && <p><strong>Budget :</strong> {r.budget} €</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div>
            <h1>👤 Mon profil</h1>
            <div style={card}>
              <p>Nom : {user?.firstName} {user?.lastName}</p>
              <p>Email : {user?.email}</p>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div>
            <h1>⚙️ Paramètres</h1>
            <div style={card}>
              <button style={primaryBtn}>Changer mot de passe</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const btn = {
  display: 'block',
  margin: '10px 0',
  padding: '10px',
  width: '100%',
  background: 'none',
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
  borderRadius: '8px',
  border: '1px solid #ccc',
}

const primaryBtn = {
  padding: '12px 18px',
  background: '#111',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
}