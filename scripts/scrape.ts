import { runScrape } from "../lib/run-scrape";
import { prisma } from "../lib/prisma";

runScrape()
  .then(({ found, matched, errors }) => {
    console.log(`[scrape] ${found} offres vues, ${matched} correspondent aux mots-clés.`);
    for (const err of errors) console.error(`[scrape] ${err}`);
  })
  .catch((err) => {
    console.error("[scrape] Erreur fatale:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
