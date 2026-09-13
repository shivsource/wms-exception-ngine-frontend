import { humanize } from "./labels";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function formatPrimitive(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string" && ISO_DATE_RE.test(value)) {
    return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  }
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(2);
  return String(value);
}

export interface EvidenceFact {
  label: string;
  value: string;
}

/**
 * Turns one structured-evidence object (shape varies per exception type — see
 * EnrichedException.structuredEvidence) into flat, presentable key/value facts, without any
 * per-exception-type bespoke rendering. Nests one level deep (e.g. `order.customerId`) since
 * evidence shapes commonly wrap a parent context object; arrays are summarized as counts
 * rather than expanded, since their item shape isn't generic.
 */
export function flattenEvidence(evidence: Record<string, unknown> | null, depth = 0): EvidenceFact[] {
  if (!evidence) return [];
  const facts: EvidenceFact[] = [];

  for (const [key, value] of Object.entries(evidence)) {
    if (value === null || value === undefined) continue;
    const label = humanize(key);

    if (Array.isArray(value)) {
      facts.push({ label, value: `${value.length} item${value.length === 1 ? "" : "s"}` });
    } else if (typeof value === "object" && depth < 1) {
      for (const nested of flattenEvidence(value as Record<string, unknown>, depth + 1)) {
        facts.push({ label: `${label} — ${nested.label}`, value: nested.value });
      }
    } else if (typeof value === "object") {
      facts.push({ label, value: "(details omitted)" });
    } else {
      facts.push({ label, value: formatPrimitive(value) });
    }
  }

  return facts;
}
