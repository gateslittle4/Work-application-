import type { ApplicationStatus } from "@/lib/status";

export type Application = {
  id: string;
  company: string;
  position: string;
  url: string | null;
  location: string | null;
  sector: string | null;
  salaryRange: string | null;
  status: ApplicationStatus;
  appliedDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationInput = {
  company: string;
  position: string;
  url?: string;
  location?: string;
  sector?: string;
  salaryRange?: string;
  status?: ApplicationStatus;
  appliedDate?: string;
  notes?: string;
};
