import * as cheerio from "cheerio";
import type { ScrapedJob } from "./types";

const LISTING_URL = "https://jobpaw.com/professionals/find-job";
const BASE_URL = "https://jobpaw.com";

export async function scrapeJobpaw(): Promise<ScrapedJob[]> {
  const res = await fetch(LISTING_URL);
  if (!res.ok) throw new Error(`JobPaw: HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const jobs: ScrapedJob[] = [];
  $(".jobs-list__card").each((_, el) => {
    const card = $(el);
    const href = card.find('a[href*="job-details"]').first().attr("href");
    if (!href) return;

    const titleEl = card.find(".jobs-list__title").first().clone();
    const company = titleEl.find("span").first().text().trim();
    titleEl.find("span").remove();
    const title = titleEl.text().trim();

    const location = card
      .find(".jobs-list__location")
      .first()
      .text()
      .replace(/^\s*Location:\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!title) return;
    jobs.push({
      source: "JobPaw",
      sourceUrl: new URL(href, BASE_URL).toString(),
      title,
      company: company || null,
      location: location || null,
      publishedAt: null,
    });
  });
  return jobs;
}
