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

  if (!user || user.role !== "ARTISAN" || !user.artisanProfile) {
    return NextResponse.json({ error: "Compte artisan requis" }, { status: 403 })
  }

  const artisan = user.artisanProfile

  const formData = await request.formData()
  const requestId = formData.get("requestId")?.toString()
  const message = formData.get("message")?.toString()
  const amount = formData.get("amount")?.toString()

  if (!requestId || !message) {
    return NextResponse.json({ error: "Message obligatoire" }, { status: 400 })
  }

  const plan = artisan.subscriptionPlan || "FREE"
  const status = artisan.subscriptionStatus || "INACTIVE"
  const isPaid =
    (plan === "BASIC" || plan === "PREMIUM") &&
    (status === "ACTIVE" || status === "TRIAL")

  if (!isPaid) {
    const responseCount = await prisma.requestResponse.count({
      where: { artisanId: artisan.id },
    })

    if (responseCount >= 3) {
      return NextResponse.redirect(
        new URL("/artisan?upgrade=limit", request.url)
      )
    }
  }

  const existingResponse = await prisma.requestResponse.findFirst({
    where: {
      requestId,
      artisanId: artisan.id,
    },
  })

  if (existingResponse) {
    return NextResponse.redirect(
      new URL("/artisan?error=already-answered", request.url)
    )
  }

  const clientRequest = await prisma.request.findUnique({
    where: { id: requestId },
    include: { user: true },
  })

  if (!clientRequest) {
    return NextResponse.json({ error: "Demande introuvable" }, { status: 404 })
  }

  await prisma.requestResponse.create({
    data: {
      requestId,
      message,
      amount: amount || null,
      artisanId: artisan.id,
    },
  })

  let conversation = await prisma.conversation.findFirst({
    where: {
      requestId,
      clientId: clientRequest.userId,
      artisanId: artisan.id,
    },
  })

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        requestId,
        clientId: clientRequest.userId,
        artisanId: artisan.id,
      },
    })
  }

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      content: amount ? `Prix estimé : ${amount} €\n\n${message}` : message,
      senderRole: "ARTISAN",
    },
  })

  return NextResponse.redirect(new URL(`/chat/${conversation.id}`, request.url))
}