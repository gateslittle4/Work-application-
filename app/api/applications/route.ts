import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isApplicationStatus } from "@/lib/status";

export async function GET() {
  const applications = await prisma.application.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(applications);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { company, position, url, location, sector, salaryRange, status, appliedDate, notes } =
    body ?? {};

  if (!company || typeof company !== "string" || !company.trim()) {
    return NextResponse.json({ error: "Le nom de l'entreprise est requis." }, { status: 400 });
  }
  if (!position || typeof position !== "string" || !position.trim()) {
    return NextResponse.json({ error: "L'intitulé du poste est requis." }, { status: 400 });
  }
  if (status && !isApplicationStatus(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const application = await prisma.application.create({
    data: {
      company: company.trim(),
      position: position.trim(),
      url: url?.trim() || null,
      location: location?.trim() || null,
      sector: sector?.trim() || null,
      salaryRange: salaryRange?.trim() || null,
      status: status ?? "WISHLIST",
      appliedDate: appliedDate ? new Date(appliedDate) : null,
      notes: notes?.trim() || null,
    },
  });

  return NextResponse.json(application, { status: 201 });
}
