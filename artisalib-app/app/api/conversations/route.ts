import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json([], { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { artisanProfile: true },
  })

  if (!user) return NextResponse.json([])

  let conversations = []

  if (user.role === "CLIENT") {
    conversations = await prisma.conversation.findMany({
      where: { clientId: user.id },
      include: {
        artisan: true,
        request: true,
      },
      orderBy: { createdAt: "desc" },
    })
  } else if (user.role === "ARTISAN") {
    conversations = await prisma.conversation.findMany({
      where: { artisanId: user.artisanProfile!.id },
      include: {
        client: true,
        request: true,
      },
      orderBy: { createdAt: "desc" },
    })
  }

  return NextResponse.json(conversations)
}