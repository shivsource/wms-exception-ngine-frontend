import { formatDistanceToNowStrict } from "date-fns";

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatRelativeTime(iso: string): string {
  return formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
}

export function formatMinutes(minutes: number): string {
  const abs = Math.abs(Math.round(minutes));
  if (abs < 60) return `${abs} min`;
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
