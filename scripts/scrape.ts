import { PrismaClient } from "@prisma/client";
import { SEARCH_KEYWORDS } from "../lib/keywords";
import { scrapeLenouvelliste } from "../lib/scrapers/lenouvelliste";
import { scrapeJobpaw } from "../lib/scrapers/jobpaw";
import { scrapeInterimhaiti } from "../lib/scrapers/interimhaiti";
import type { ScrapedJob } from "../lib/scrapers/types";

const prisma = new PrismaClient();

const SCRAPERS = [scrapeLenouvelliste, scrapeJobpaw, scrapeInterimhaiti];

function matchedKeywords(job: ScrapedJob): string[] {
  const haystack = `${job.title} ${job.company ?? ""}`.toLowerCase();
  return SEARCH_KEYWORDS.filter((kw) => haystack.includes(kw.toLowerCase()));
}

async function main() {
  let found = 0;
  let matched = 0;

  for (const scraper of SCRAPERS) {
    let jobs: ScrapedJob[];
    try {
      jobs = await scraper();
    } catch (err) {
      console.error(`[scrape] ${scraper.name} failed:`, err);
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

  console.log(`[scrape] ${found} offres vues, ${matched} correspondent aux mots-clés.`);
}

main()
  .catch((err) => {
    console.error("[scrape] Erreur fatale:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
