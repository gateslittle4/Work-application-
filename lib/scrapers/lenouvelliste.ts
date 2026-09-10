import * as cheerio from "cheerio";
import type { ScrapedJob } from "./types";

const LISTING_URL = "https://emploi.lenouvelliste.com/recherche/offres-emploi";

export async function scrapeLenouvelliste(): Promise<ScrapedJob[]> {
  const res = await fetch(LISTING_URL);
  if (!res.ok) throw new Error(`Le Nouvelliste: HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const jobs: ScrapedJob[] = [];
  $(".job-card").each((_, el) => {
    const card = $(el);
    const href = card.find("a").first().attr("href");
    const title = card.find("h6 strong").first().text().trim();
    const company = card.find(".text-muted.small").first().text().trim();
    if (!href || !title) return;
    jobs.push({
      source: "Le Nouvelliste",
      sourceUrl: href,
      title,
      company: company || null,
      location: null,
      publishedAt: null,
    });
  });
  return jobs;
}
