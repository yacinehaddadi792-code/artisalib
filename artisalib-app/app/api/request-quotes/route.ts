import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sendNewQuoteEmail } from "@/lib/email"

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
  const amount = formData.get("amount")?.toString()
  const workDescription = formData.get("workDescription")?.toString()
  const estimatedDelay = formData.get("estimatedDelay")?.toString()
  const validUntil = formData.get("validUntil")?.toString()
  const message = formData.get("message")?.toString()

  if (!requestId || !amount || !workDescription) {
    return NextResponse.json(
      { error: "Le montant et la description des travaux sont obligatoires." },
      { status: 400 }
    )
  }

  const clientRequest = await prisma.request.findUnique({
    where: { id: requestId },
    include: { user: true },
  })

  if (!clientRequest) {
    return NextResponse.json({ error: "Demande introuvable" }, { status: 404 })
  }

  const existingQuote = await prisma.requestQuote.findFirst({
    where: {
      requestId,
      artisanId: artisan.id,
    },
  })

  if (existingQuote) {
    return NextResponse.redirect(
      new URL("/artisan?error=quote-already-sent", request.url)
    )
  }

  const quote = await prisma.requestQuote.create({
    data: {
      requestId,
      clientId: clientRequest.userId,
      artisanId: artisan.id,
      amount,
      workDescription,
      estimatedDelay: estimatedDelay || null,
      validUntil: validUntil || null,
      message: message || null,
    },
  })

  await prisma.requestResponse.create({
    data: {
      requestId,
      artisanId: artisan.id,
      amount,
      message: message || workDescription,
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


const plan = artisan.subscriptionPlan || "FREE"
const status = artisan.subscriptionStatus || "INACTIVE"

const isPaid =
  (plan === "BASIC" || plan === "PREMIUM") &&
  (status === "ACTIVE" || status === "TRIAL")

if (!isPaid) {
  const count = await prisma.requestQuote.count({
    where: { artisanId: artisan.id },
  })

  if (count >= 3) {
    return NextResponse.redirect(
      new URL("/artisan?upgrade=limit", request.url)
    )
  }
}
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderRole: "ARTISAN",
      content: `📄 Devis envoyé
 
await sendNewQuoteEmail(
  clientRequest.user.email,
  Number(amount),
  message
)

Montant : ${amount} €

Travaux prévus :
${workDescription}

${estimatedDelay ? `Délai estimé : ${estimatedDelay}\n` : ""}
${validUntil ? `Valable jusqu'au : ${validUntil}\n` : ""}
${message ? `\nMessage : ${message}` : ""}`,
    },
  })

  return NextResponse.redirect(new URL(`/chat/${conversation.id}`, request.url))
}