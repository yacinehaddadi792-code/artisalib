import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const trade = searchParams.get("trade")?.trim();
  const city = searchParams.get("city")?.trim();

  const artisans = await prisma.artisanProfile.findMany({
    where: {
      AND: [
        trade
          ? {
              trade: {
                contains: trade,
                mode: "insensitive",
              },
            }
          : {},
        city
          ? {
              city: {
                contains: city,
                mode: "insensitive",
              },
            }
          : {},
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(artisans);
}