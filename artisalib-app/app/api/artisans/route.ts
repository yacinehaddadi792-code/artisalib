import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const trade = searchParams.get("trade") || ""
  const city = searchParams.get("city") || ""

  const artisans = await prisma.artisanProfile.findMany({
    where: {
      visible: true,
      ...(trade
        ? {
            trade: {
              contains: trade,
              mode: "insensitive",
            },
          }
        : {}),
      ...(city
        ? {
            city: {
              contains: city,
              mode: "insensitive",
            },
          }
        : {}),
    },
    include: {
      user: true,
      reviews: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json(artisans)
}