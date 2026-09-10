import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isApplicationStatus } from "@/lib/status";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { company, position, url, location, sector, salaryRange, status, appliedDate, notes } =
    body ?? {};

  if (status !== undefined && !isApplicationStatus(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Candidature introuvable." }, { status: 404 });
  }

  const application = await prisma.application.update({
    where: { id },
    data: {
      ...(company !== undefined && { company: company.trim() }),
      ...(position !== undefined && { position: position.trim() }),
      ...(url !== undefined && { url: url?.trim() || null }),
      ...(location !== undefined && { location: location?.trim() || null }),
      ...(sector !== undefined && { sector: sector?.trim() || null }),
      ...(salaryRange !== undefined && { salaryRange: salaryRange?.trim() || null }),
      ...(status !== undefined && { status }),
      ...(appliedDate !== undefined && {
        appliedDate: appliedDate ? new Date(appliedDate) : null,
      }),
      ...(notes !== undefined && { notes: notes?.trim() || null }),
    },
  });

  return NextResponse.json(application);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Candidature introuvable." }, { status: 404 });
  }

  await prisma.application.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
