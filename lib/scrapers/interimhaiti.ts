import * as cheerio from "cheerio";
import type { ScrapedJob } from "./types";

const LISTING_URL = "https://interimhaiti.com/browse-jobs/";

export async function scrapeInterimhaiti(): Promise<ScrapedJob[]> {
  const res = await fetch(LISTING_URL);
  if (!res.ok) throw new Error(`Interim Haiti: HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const jobs: ScrapedJob[] = [];
  $("a.job_listing").each((_, el) => {
    const card = $(el);
    const href = card.attr("href");
    if (!href) return;

    const titleEl = card.find(".listing-title h4").first().clone();
    titleEl.find(".listing-types-list").remove();
    const title = titleEl.text().trim();

    const company = card
      .find(".listing-icons li:has(i.icon-material-outline-business)")
      .first()
      .text()
      .trim();
    const location = card
      .find(".listing-icons li:has(i.icon-material-outline-location-on)")
      .first()
      .text()
      .trim();

    if (!title) return;
    jobs.push({
      source: "Interim Haiti",
      sourceUrl: href,
      title,
      company: company || null,
      location: location || null,
      publishedAt: null,
    });
  });
  return jobs;
}
