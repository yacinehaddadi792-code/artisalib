import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { sendQuoteAcceptedEmail } from "@/lib/email"

export async function POST(req: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const formData = await req.formData()
  const quoteId = formData.get("quoteId")?.toString()

  if (!quoteId) {
    return NextResponse.redirect(new URL("/client?error=missing-id", req.url))
  }

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      artisan: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!quote) {
    return NextResponse.redirect(new URL("/client?error=not-found", req.url))
  }

  // ✅ Sécurité → seul le client peut accepter
  if (quote.clientId !== user.id) {
    return NextResponse.redirect(new URL("/client", req.url))
  }

  // ✅ Update devis
  await prisma.quote.update({
    where: { id: quoteId },
    data: {
      status: "ACCEPTED",
    },
  })

  // 📧 Email artisan
  await sendQuoteAcceptedEmail(quote.artisan.user.email)

  return NextResponse.redirect(new URL("/client?success=accepted", req.url))
}