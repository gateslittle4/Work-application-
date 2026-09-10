import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const suggestions = await prisma.jobListing.findMany({
    where: { status: "NEW" },
    orderBy: { foundAt: "desc" },
  });
  return NextResponse.json(suggestions);
}
