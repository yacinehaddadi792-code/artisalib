import Stripe from "stripe"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return new NextResponse("Missing stripe signature", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new NextResponse("Webhook signature error", { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session

    const artisanId = checkoutSession.metadata?.artisanId
    const plan = checkoutSession.metadata?.plan

    if (artisanId && plan) {
      await prisma.artisanProfile.update({
        where: { id: artisanId },
        data: {
          subscriptionPlan: plan,
          subscriptionStatus: "ACTIVE",
        },
      })
    }
  }

  return NextResponse.json({ received: true })
}