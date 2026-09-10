export const SUGGESTION_STATUSES = ["NEW", "DISMISSED", "CONVERTED"] as const;

export type SuggestionStatus = (typeof SUGGESTION_STATUSES)[number];

export function isSuggestionStatus(value: string): value is SuggestionStatus {
  return (SUGGESTION_STATUSES as readonly string[]).includes(value);
}
