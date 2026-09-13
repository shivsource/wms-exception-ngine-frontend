"use client";

import { AlertCircle, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { usePredictions } from "@/features/predictions/hooks";
import type { PredictionListFilters, PersistedPrediction } from "@/types/prediction";
import { PredictionDetailSheet } from "./prediction-detail-sheet";
import { PredictionFilters, type PredictionFiltersState } from "./prediction-filters";
import { PredictionTable } from "./prediction-table";

const DEFAULT_FILTERS: PredictionFiltersState = {
  riskLevel: "ALL",
  status: "ACTIVE",
  predictionType: "ALL",
  entityType: "ALL",
  search: "",
};

const PAGE_SIZE_OPTIONS = [25, 50, 100, 200];

function PredictionTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-center gap-4 border-b bg-muted/60 px-4 py-2.5">
        {["Prediction", "Risk", "Confidence", "Entity", "Window", "Explanation", "Predicted", ""].map((label) => (
          <Skeleton key={label} className="h-3 w-16" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

function PredictionEmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
      <TrendingUp className="h-8 w-8 text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium">{filtered ? "No predictions match these filters" : "No active risk predictions"}</p>
      <p className="text-sm text-muted-foreground">
        {filtered ? "Try widening your search or filters." : "The prediction engine hasn't flagged any at-risk entities."}
      </p>
    </div>
  );
}

function PredictionErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
      <AlertCircle className="h-8 w-8 text-destructive" aria-hidden />
      <div>
        <p className="text-sm font-medium">Unable to load predictions</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

export function PredictionCenter() {
  const [filters, setFilters] = useState<PredictionFiltersState>(DEFAULT_FILTERS);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<PersistedPrediction | null>(null);

  const serverFilters: PredictionListFilters = useMemo(
    () => ({
      riskLevel: filters.riskLevel === "ALL" ? undefined : filters.riskLevel,
      status: filters.status === "ALL" ? undefined : filters.status,
      predictionType: filters.predictionType === "ALL" ? undefined : filters.predictionType,
      entityType: filters.entityType === "ALL" ? undefined : filters.entityType,
      limit,
      offset,
    }),
    [filters.riskLevel, filters.status, filters.predictionType, filters.entityType, limit, offset],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = usePredictions(serverFilters);

  function updateFilters(next: PredictionFiltersState) {
    const serverFilterChanged =
      next.riskLevel !== filters.riskLevel ||
      next.status !== filters.status ||
      next.predictionType !== filters.predictionType ||
      next.entityType !== filters.entityType;
    setFilters(next);
    if (serverFilterChanged) setOffset(0);
  }

  const page = useMemo(() => data?.data ?? [], [data]);
  const search = filters.search.trim().toLowerCase();

  const visible = useMemo(() => {
    if (!search) return page;
    return page.filter((p) => {
      const haystack = `${p.entityId} ${p.explanation} ${p.predictionId}`.toLowerCase();
      return haystack.includes(search);
    });
  }, [page, search]);

  const isPageFull = page.length === limit;
  const hasActiveClientFilter = search.length > 0;

  return (
    <>
      <PageHeader
        title="Predictions"
        description="What is likely to happen, when, and how confident the engine is."
      />

      <div className="flex flex-col gap-4 p-4 md:p-6">
        <PredictionFilters filters={filters} onChange={updateFilters} />

        {isError ? (
          <PredictionErrorState
            message={error instanceof Error ? error.message : "An unexpected error occurred."}
            onRetry={() => refetch()}
          />
        ) : isLoading ? (
          <PredictionTableSkeleton />
        ) : visible.length === 0 ? (
          <PredictionEmptyState filtered={hasActiveClientFilter || page.length > 0} />
        ) : (
          <PredictionTable predictions={visible} onSelect={setSelected} />
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {visible.length} of {page.length} loaded
              {hasActiveClientFilter ? " (filtered)" : ""}
              {isFetching && !isLoading ? " · refreshing…" : ""}
            </span>
            <Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setOffset(0); }}>
              <SelectTrigger className="h-7 w-[110px] text-xs" aria-label="Rows per page">
                <SelectValue>{(value: unknown) => `${value} / page`}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows {offset + 1}–{offset + page.length}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - limit))}
            >
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={!isPageFull} onClick={() => setOffset(offset + limit)}>
              Next
            </Button>
          </div>
        </div>
      </div>

      <PredictionDetailSheet prediction={selected} onClose={() => setSelected(null)} />
    </>
  );
}
