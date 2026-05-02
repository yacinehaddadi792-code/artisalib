import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { artisanProfile: true },
  })

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      request: true,
      client: true,
      artisan: {
        include: { user: true },
      },
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!conversation) {
    return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 })
  }

  const isClient = conversation.clientId === user.id
  const isArtisan = user.artisanProfile?.id === conversation.artisanId

  if (!isClient && !isArtisan) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  return NextResponse.json({
    conversation,
    currentRole: isClient ? "CLIENT" : "ARTISAN",
  })
}