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
import { entityTypeLabel, predictionTypeLabel } from "@/lib/wms/labels";
import { EntityType, PredictionStatus, PredictionType, RiskLevel } from "@/types/enums";

export interface PredictionFiltersState {
  riskLevel: RiskLevel | "ALL";
  status: PredictionStatus | "ALL";
  predictionType: PredictionType | "ALL";
  entityType: EntityType | "ALL";
  search: string;
}

const RISK_TABS: Array<{ value: RiskLevel | "ALL"; label: string }> = [
  { value: "ALL", label: "All" },
  { value: RiskLevel.CRITICAL, label: "Critical" },
  { value: RiskLevel.HIGH, label: "High" },
  { value: RiskLevel.MEDIUM, label: "Medium" },
  { value: RiskLevel.LOW, label: "Low" },
];

const RISK_TAB_ACTIVE_STYLES: Record<RiskLevel | "ALL", string> = {
  ALL: "bg-foreground text-background border-foreground",
  CRITICAL: "bg-red-600 text-white border-red-600",
  HIGH: "bg-orange-500 text-white border-orange-500",
  MEDIUM: "bg-amber-500 text-white border-amber-500",
  LOW: "bg-emerald-600 text-white border-emerald-600",
  UNKNOWN: "bg-slate-500 text-white border-slate-500",
};

const STATUS_OPTION_LABELS: Record<PredictionStatus | "ALL", string> = {
  ALL: "All Statuses",
  ACTIVE: "Active",
  CONFIRMED: "Confirmed",
  RESOLVED: "Resolved",
};

export function PredictionFilters({
  filters,
  onChange,
}: {
  filters: PredictionFiltersState;
  onChange: (next: PredictionFiltersState) => void;
}) {
  function set<K extends keyof PredictionFiltersState>(key: K, value: PredictionFiltersState[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter by risk level">
        {RISK_TABS.map((tab) => {
          const active = filters.riskLevel === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => set("riskLevel", tab.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                active
                  ? RISK_TAB_ACTIVE_STYLES[tab.value]
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
            placeholder="Search loaded predictions…"
            className="pl-8"
            aria-label="Search predictions"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={filters.status} onValueChange={(v) => set("status", v as PredictionFiltersState["status"])}>
            <SelectTrigger className="w-[150px]" aria-label="Filter by status">
              <SelectValue placeholder="Status">
                {(value: unknown) => STATUS_OPTION_LABELS[value as PredictionFiltersState["status"]]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {Object.values(PredictionStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_OPTION_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.predictionType}
            onValueChange={(v) => set("predictionType", v as PredictionFiltersState["predictionType"])}
          >
            <SelectTrigger className="w-[190px]" aria-label="Filter by prediction type">
              <SelectValue placeholder="Type">
                {(value: unknown) =>
                  value === "ALL" ? "All Types" : predictionTypeLabel(value as string)
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              {Object.values(PredictionType).map((t) => (
                <SelectItem key={t} value={t}>
                  {predictionTypeLabel(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.entityType}
            onValueChange={(v) => set("entityType", v as PredictionFiltersState["entityType"])}
          >
            <SelectTrigger className="w-[150px]" aria-label="Filter by entity type">
              <SelectValue placeholder="Entity">
                {(value: unknown) => (value === "ALL" ? "All Entities" : entityTypeLabel(value as string))}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Entities</SelectItem>
              {Object.values(EntityType).map((t) => (
                <SelectItem key={t} value={t}>
                  {entityTypeLabel(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
