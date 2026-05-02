import Stripe from "stripe"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { artisanProfile: true },
  })

  if (!user || !user.artisanProfile) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const formData = await req.formData()
  const plan = formData.get("plan")?.toString()

  let priceId = ""

  if (plan === "BASIC") {
    priceId = process.env.STRIPE_BASIC_PRICE_ID!
  }

  if (plan === "PREMIUM") {
    priceId = process.env.STRIPE_PREMIUM_PRICE_ID!
  }

  if (!priceId || !plan) {
    return NextResponse.redirect(new URL("/artisan?error=stripe-price", req.url))
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/artisan?success=stripe`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/artisan?canceled=stripe`,
    subscription_data: {
      trial_period_days: plan === "BASIC" ? 7 : undefined,
    },
    metadata: {
      artisanId: user.artisanProfile.id,
      userId: user.id,
      plan,
    },
  })

  return Response.redirect(checkout.url!)
}