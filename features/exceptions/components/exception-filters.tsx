"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { exceptionTypeLabel } from "@/lib/wms/labels";
import { ExceptionSeverity, ExceptionStatus, ExceptionType } from "@/types/enums";

export type DateRangeFilter = "ALL" | "TODAY" | "24H" | "7D";

export interface ExceptionFiltersState {
  severity: ExceptionSeverity | "ALL";
  status: ExceptionStatus | "ALL";
  type: ExceptionType | "ALL";
  search: string;
  dateRange: DateRangeFilter;
}

const SEVERITY_TABS: Array<{ value: ExceptionSeverity | "ALL"; label: string }> = [
  { value: "ALL", label: "All" },
  { value: ExceptionSeverity.CRITICAL, label: "Critical" },
  { value: ExceptionSeverity.HIGH, label: "High" },
  { value: ExceptionSeverity.MEDIUM, label: "Medium" },
  { value: ExceptionSeverity.LOW, label: "Low" },
];

const STATUS_OPTION_LABELS: Record<ExceptionStatus | "ALL", string> = {
  ALL: "All Statuses",
  OPEN: "OPEN",
  ACKNOWLEDGED: "ACKNOWLEDGED",
  IN_PROGRESS: "IN PROGRESS",
  RESOLVED: "RESOLVED",
  IGNORED: "IGNORED",
};

const DATE_RANGE_LABELS: Record<DateRangeFilter, string> = {
  ALL: "Any time",
  TODAY: "Today",
  "24H": "Last 24 hours",
  "7D": "Last 7 days",
};

const SEVERITY_TAB_ACTIVE_STYLES: Record<ExceptionSeverity | "ALL", string> = {
  ALL: "bg-foreground text-background border-foreground",
  CRITICAL: "bg-red-600 text-white border-red-600",
  HIGH: "bg-orange-500 text-white border-orange-500",
  MEDIUM: "bg-amber-500 text-white border-amber-500",
  LOW: "bg-slate-500 text-white border-slate-500",
};

export function ExceptionFilters({
  filters,
  onChange,
}: {
  filters: ExceptionFiltersState;
  onChange: (next: ExceptionFiltersState) => void;
}) {
  function set<K extends keyof ExceptionFiltersState>(key: K, value: ExceptionFiltersState[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter by severity">
        {SEVERITY_TABS.map((tab) => {
          const active = filters.severity === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => set("severity", tab.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                active
                  ? SEVERITY_TAB_ACTIVE_STYLES[tab.value]
                  : "border-border bg-background text-muted-foreground hover:bg-muted",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            placeholder="Search loaded exceptions…"
            className="pl-8"
            aria-label="Search exceptions"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={filters.status} onValueChange={(v) => set("status", v as ExceptionFiltersState["status"])}>
            <SelectTrigger className="w-[150px]" aria-label="Filter by status">
              <SelectValue placeholder="Status">
                {(value: unknown) => STATUS_OPTION_LABELS[value as ExceptionFiltersState["status"]]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {Object.values(ExceptionStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.type} onValueChange={(v) => set("type", v as ExceptionFiltersState["type"])}>
            <SelectTrigger className="w-[180px]" aria-label="Filter by exception type">
              <SelectValue placeholder="Type">
                {(value: unknown) =>
                  value === "ALL" ? "All Types" : exceptionTypeLabel(value as string)
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              {Object.values(ExceptionType).map((t) => (
                <SelectItem key={t} value={t}>
                  {exceptionTypeLabel(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.dateRange} onValueChange={(v) => set("dateRange", v as DateRangeFilter)}>
            <SelectTrigger className="w-[140px]" aria-label="Filter by detected date">
              <SelectValue placeholder="Detected">
                {(value: unknown) => DATE_RANGE_LABELS[value as DateRangeFilter]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Any time</SelectItem>
              <SelectItem value="TODAY">Today</SelectItem>
              <SelectItem value="24H">Last 24 hours</SelectItem>
              <SelectItem value="7D">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
