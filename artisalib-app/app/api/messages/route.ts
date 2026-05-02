import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
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

  let conversationId = ""
  let content = ""

  const contentType = request.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    const body = await request.json()
    conversationId = body.conversationId
    content = body.content
  } else {
    const formData = await request.formData()
    conversationId = formData.get("conversationId")?.toString() || ""
    content = formData.get("content")?.toString() || ""
  }

  if (!conversationId || !content) {
    return NextResponse.json({ error: "Message vide" }, { status: 400 })
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  })

  if (!conversation) {
    return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 })
  }

  const isClient = conversation.clientId === user.id
  const isArtisan = user.artisanProfile?.id === conversation.artisanId

  if (!isClient && !isArtisan) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  await prisma.message.create({
    data: {
      conversationId,
      content,
      senderRole: isClient ? "CLIENT" : "ARTISAN",
    },
  })

  return NextResponse.json({ success: true })
}