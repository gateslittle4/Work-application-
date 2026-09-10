import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const suggestion = await prisma.jobListing.findUnique({ where: { id } });
  if (!suggestion) {
    return NextResponse.json({ error: "Suggestion introuvable." }, { status: 404 });
  }

  const [application] = await prisma.$transaction([
    prisma.application.create({
      data: {
        company: suggestion.company ?? "À préciser",
        position: suggestion.title,
        url: suggestion.sourceUrl,
        location: suggestion.location,
        status: "WISHLIST",
      },
    }),
    prisma.jobListing.update({
      where: { id },
      data: { status: "CONVERTED" },
    }),
  ]);

  return NextResponse.json(application, { status: 201 });
}
