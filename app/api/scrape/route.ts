import { NextRequest, NextResponse } from "next/server";
import { runScrape } from "@/lib/run-scrape";

export async function POST(request: NextRequest) {
  const secret = process.env.SCRAPE_SECRET;
  const provided = request.headers.get("x-scrape-secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const result = await runScrape();
  return NextResponse.json(result);
}
