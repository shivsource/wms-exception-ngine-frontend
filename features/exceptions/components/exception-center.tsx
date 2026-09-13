"use client";

import { subDays, startOfDay } from "date-fns";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useExceptions } from "@/features/exceptions/hooks";
import type { ExceptionListFilters } from "@/types/exception";
import { ExceptionFilters, type ExceptionFiltersState } from "./exception-filters";
import { ExceptionTable } from "./exception-table";
import { ExceptionEmptyState } from "./exception-empty-state";
import { ExceptionErrorState } from "./exception-error-state";
import { ExceptionTableSkeleton } from "./exception-table-skeleton";

const DEFAULT_FILTERS: ExceptionFiltersState = {
  severity: "ALL",
  status: "ALL",
  type: "ALL",
  search: "",
  dateRange: "ALL",
};

const PAGE_SIZE_OPTIONS = [25, 50, 100, 200];

function withinDateRange(iso: string, range: ExceptionFiltersState["dateRange"]): boolean {
  if (range === "ALL") return true;
  const detected = new Date(iso);
  const now = new Date();
  if (range === "TODAY") return detected >= startOfDay(now);
  if (range === "24H") return detected >= subDays(now, 1);
  if (range === "7D") return detected >= subDays(now, 7);
  return true;
}

export function ExceptionCenter() {
  const [filters, setFilters] = useState<ExceptionFiltersState>(DEFAULT_FILTERS);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);

  const serverFilters: ExceptionListFilters = useMemo(
    () => ({
      severity: filters.severity === "ALL" ? undefined : filters.severity,
      status: filters.status === "ALL" ? undefined : filters.status,
      type: filters.type === "ALL" ? undefined : filters.type,
      limit,
      offset,
    }),
    [filters.severity, filters.status, filters.type, limit, offset],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useExceptions(serverFilters);

  function updateFilters(next: ExceptionFiltersState) {
    const serverFilterChanged =
      next.severity !== filters.severity || next.status !== filters.status || next.type !== filters.type;
    setFilters(next);
    if (serverFilterChanged) setOffset(0);
  }

  const page = useMemo(() => data?.data ?? [], [data]);
  const search = filters.search.trim().toLowerCase();

  const visible = useMemo(() => {
    return page.filter((exc) => {
      if (!withinDateRange(exc.detectedAt, filters.dateRange)) return false;
      if (!search) return true;
      const haystack = `${exc.title} ${exc.description ?? ""} ${exc.entityId} ${exc.exceptionId}`.toLowerCase();
      return haystack.includes(search);
    });
  }, [page, filters.dateRange, search]);

  const isPageFull = page.length === limit;
  const hasActiveClientFilter = search.length > 0 || filters.dateRange !== "ALL";

  return (
    <>
      <PageHeader
        title="Exception Center"
        description="Search, filter, and investigate every detected operational exception."
      />

      <div className="flex flex-col gap-4 p-4 md:p-6">
        <ExceptionFilters filters={filters} onChange={updateFilters} />

        {isError ? (
          <ExceptionErrorState
            message={error instanceof Error ? error.message : "An unexpected error occurred."}
            onRetry={() => refetch()}
          />
        ) : isLoading ? (
          <ExceptionTableSkeleton />
        ) : visible.length === 0 ? (
          <ExceptionEmptyState filtered={hasActiveClientFilter || page.length > 0} />
        ) : (
          <ExceptionTable exceptions={visible} />
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
    </>
  );
}
