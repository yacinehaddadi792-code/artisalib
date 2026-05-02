import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json([], { status: 200 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json([], { status: 200 })
  }

  const requests = await prisma.request.findMany({
    where: { userId: user.id },
    include: {
      responses: {
        include: {
          artisan: true,
        },
        orderBy: { createdAt: "desc" },
      },
      requestQuotes: {
        include: {
          artisan: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(requests)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

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

  if (!body.title || !body.description || !body.trade || !body.city || !body.urgency) {
    return NextResponse.json(
      { error: "Tous les champs obligatoires doivent être remplis." },
      { status: 400 }
    )
  }

  const newRequest = await prisma.request.create({
    data: {
      title: body.title,
      description: body.description,
      trade: body.trade,
      city: body.city,
      urgency: body.urgency,
      budget: body.budget || null,
      userId: user.id,
    },
  })

  return NextResponse.json(newRequest)
}