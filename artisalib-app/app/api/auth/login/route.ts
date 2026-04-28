import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Utilise NextAuth pour la connexion.' },
    { status: 400 }
  )
}