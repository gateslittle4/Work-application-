import { prisma } from "@/lib/prisma";
import { SEARCH_KEYWORDS } from "@/lib/keywords";
import { scrapeLenouvelliste } from "@/lib/scrapers/lenouvelliste";
import { scrapeJobpaw } from "@/lib/scrapers/jobpaw";
import { scrapeInterimhaiti } from "@/lib/scrapers/interimhaiti";
import type { ScrapedJob } from "@/lib/scrapers/types";

const SCRAPERS = [scrapeLenouvelliste, scrapeJobpaw, scrapeInterimhaiti];

function matchedKeywords(job: ScrapedJob): string[] {
  const haystack = `${job.title} ${job.company ?? ""}`.toLowerCase();
  return SEARCH_KEYWORDS.filter((kw) => haystack.includes(kw.toLowerCase()));
}

export async function runScrape() {
  let found = 0;
  let matched = 0;
  const errors: string[] = [];

  for (const scraper of SCRAPERS) {
    let jobs: ScrapedJob[];
    try {
      jobs = await scraper();
    } catch (err) {
      errors.push(`${scraper.name}: ${err instanceof Error ? err.message : String(err)}`);
      continue;
    }
    found += jobs.length;

    for (const job of jobs) {
      const matches = matchedKeywords(job);
      if (matches.length === 0) continue;
      matched++;

      await prisma.jobListing.upsert({
        where: { sourceUrl: job.sourceUrl },
        update: {},
        create: {
          source: job.source,
          sourceUrl: job.sourceUrl,
          title: job.title,
          company: job.company,
          location: job.location,
          publishedAt: job.publishedAt,
          matchedKeywords: matches.join(", "),
        },
      });
    }
  }

  return { found, matched, errors };
}
