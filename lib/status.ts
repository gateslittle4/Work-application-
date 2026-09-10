export const APPLICATION_STATUSES = [
  "WISHLIST",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  WISHLIST: "À postuler",
  APPLIED: "Candidature envoyée",
  INTERVIEW: "Entretien",
  OFFER: "Offre reçue",
  REJECTED: "Refusée",
};

export function isApplicationStatus(value: string): value is ApplicationStatus {
  return (APPLICATION_STATUSES as readonly string[]).includes(value);
}
