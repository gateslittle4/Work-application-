import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isSuggestionStatus } from "@/lib/suggestion-status";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { status } = body ?? {};

  if (!status || !isSuggestionStatus(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const existing = await prisma.jobListing.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Suggestion introuvable." }, { status: 404 });
  }

  const suggestion = await prisma.jobListing.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(suggestion);
}
