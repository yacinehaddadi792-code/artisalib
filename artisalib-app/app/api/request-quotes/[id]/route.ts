import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
export async function PATCH(
  request : Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
  }

  const body = await request.json()

  if (body.status !== "ACCEPTED" && body.status !== "REFUSED") {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
  }

  const quote = await prisma.requestQuote.findUnique({
    where: { id },
    include: {
      request: true,
      artisan: true,
    },
  })

  if (!quote) {
    return NextResponse.json({ error: "Devis introuvable" }, { status: 404 })
  }

  if (quote.clientId !== user.id) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  const updatedQuote = await prisma.requestQuote.update({
    where: { id: params.id },
    data: {
      status: body.status,
    },
  })

  let conversation = await prisma.conversation.findFirst({
    where: {
      requestId: quote.requestId,
      clientId: quote.clientId,
      artisanId: quote.artisanId,
    },
  })

  if (conversation) {
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderRole: "CLIENT",
        content:
          body.status === "ACCEPTED"
            ? "✅ Le client a accepté le devis."
            : "❌ Le client a refusé le devis.",
      },
    })
  }

  return NextResponse.json(updatedQuote)
}