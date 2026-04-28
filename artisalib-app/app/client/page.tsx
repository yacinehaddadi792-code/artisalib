'use client'

import { useState, useEffect } from 'react'

export default function ClientDashboard() {
  const [tab, setTab] = useState('home')
  const [user, setUser] = useState<any>(null)

  const [requests, setRequests] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // 🔹 récupérer user
  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => setUser(data))
  }, [])

  // 🔹 récupérer demandes
  useEffect(() => {
    fetch('/api/requests')
      .then(res => res.json())
      .then(data => setRequests(data))
  }, [])

  // 🔹 créer demande
  const createRequest = async () => {
    await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })

    setTitle('')
    setDescription('')

    // refresh des demandes
    const res = await fetch('/api/requests')
    const data = await res.json()
    setRequests(data)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '250px', background: '#111', color: '#fff', padding: '20px' }}>
        <h2>Artisalib</h2>

        <button onClick={() => setTab('home')} style={btn}>🏠 Accueil</button>
        <button onClick={() => setTab('requests')} style={btn}>📩 Mes demandes</button>
        <button onClick={() => setTab('profile')} style={btn}>👤 Profil</button>
        <button onClick={() => setTab('settings')} style={btn}>⚙️ Paramètres</button>
      </div>

      {/* CONTENU */}
      <div style={{ flex: 1, padding: '40px' }}>
        
        {tab === 'home' && (
          <div>
            <h1>Bienvenue {user?.firstName} 👋</h1>
            <p>Voici votre espace client Artisalib.</p>
          </div>
        )}

        {tab === 'requests' && (
          <div>
            <h1>📩 Mes demandes</h1>

            <input
              placeholder="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ display: 'block', marginBottom: '10px', padding: '8px' }}
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ display: 'block', marginBottom: '10px', padding: '8px' }}
            />

            <button onClick={createRequest}>Créer</button>

            <div>
              {requests.map((r) => (
                <div key={r.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                  <h3>{r.title}</h3>
                  <p>{r.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div>
            <h1>👤 Mon profil</h1>
            <p>Nom : {user?.firstName} {user?.lastName}</p>
            <p>Email : {user?.email}</p>
          </div>
        )}

        {tab === 'settings' && (
          <div>
            <h1>⚙️ Paramètres</h1>
            <button>Changer mot de passe</button>
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
  cursor: 'pointer'
}