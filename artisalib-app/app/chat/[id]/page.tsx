'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ChatPage() {
  const params = useParams()
  const conversationId = params.id as string

  const [conversation, setConversation] = useState<any>(null)
  const [currentRole, setCurrentRole] = useState<string>('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadChat() {
    const res = await fetch(`/api/chat/${conversationId}`)
    const data = await res.json()

    if (res.ok) {
      setConversation(data.conversation)
      setCurrentRole(data.currentRole)
    }
  }

  useEffect(() => {
    loadChat()

    const interval = setInterval(() => {
      loadChat()
    }, 2000)

    return () => clearInterval(interval)
  }, [conversationId])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()

    if (!content.trim()) return

    setLoading(true)

    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, content }),
    })

    setContent('')
    setLoading(false)
    await loadChat()
  }

  if (!conversation) {
    return (
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 40 }}>
        Chargement...
      </main>
    )
  }

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>
        Discussion
      </h1>

      <p style={{ marginTop: 8, color: '#666' }}>
        Demande : {conversation.request.title}
      </p>

      <div style={card}>
        <p><strong>Client :</strong> {conversation.client.firstName} {conversation.client.lastName}</p>
        <p><strong>Artisan :</strong> {conversation.artisan.businessName}</p>
      </div>

      <div style={messagesBox}>
        {conversation.messages.map((message: any) => {
          const isMine = message.senderRole === currentRole

          return (
            <div
              key={message.id}
              style={{
                ...bubble,
                alignSelf: isMine ? 'flex-end' : 'flex-start',
                background: isMine ? '#111' : '#f1f1f1',
                color: isMine ? '#fff' : '#111',
              }}
            >
              <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
              <small>{message.senderRole}</small>
            </div>
          )
        })}
      </div>

      <form onSubmit={sendMessage} style={form}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrire un message..."
          required
          style={textarea}
        />

        <button style={button} disabled={loading}>
          {loading ? 'Envoi...' : 'Envoyer'}
        </button>
      </form>
    </main>
  )
}

const card = {
  border: '1px solid #ddd',
  borderRadius: 12,
  padding: 20,
  marginTop: 20,
}

const messagesBox = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 12,
  border: '1px solid #ddd',
  borderRadius: 12,
  padding: 20,
  marginTop: 20,
  minHeight: 300,
}

const bubble = {
  maxWidth: '70%',
  padding: 12,
  borderRadius: 12,
}

const form = {
  marginTop: 20,
  display: 'grid',
  gap: 10,
}

const textarea = {
  minHeight: 100,
  padding: 12,
  borderRadius: 8,
  border: '1px solid #ccc',
}

const button = {
  padding: 12,
  background: '#111',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
}