export type ScrapedJob = {
  source: string;
  sourceUrl: string;
  title: string;
  company: string | null;
  location: string | null;
  publishedAt: Date | null;
};
