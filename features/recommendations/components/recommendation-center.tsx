"use client";

import { AlertCircle, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { RecommendationCard } from "@/components/intelligence/recommendation-card";
import { SectionError, SectionSkeleton } from "@/components/intelligence/section-states";
import { SeverityBadge } from "@/components/intelligence/severity-badge";
import { StatusBadge } from "@/components/intelligence/status-badge";
import { Button } from "@/components/ui/button";
import { useExceptionRecommendation } from "@/features/exceptions/hooks";
import { useOpenExceptionsBySeverity } from "@/features/recommendations/hooks";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { entityTypeLabel } from "@/lib/wms/labels";
import { ExceptionSeverity } from "@/types/enums";
import type { PersistedException } from "@/types/exception";

const PAGE_SIZE = 10;

const SEVERITY_TABS: Array<{ value: ExceptionSeverity; label: string; activeClass: string }> = [
  { value: ExceptionSeverity.CRITICAL, label: "Critical", activeClass: "bg-red-600 text-white border-red-600" },
  { value: ExceptionSeverity.HIGH, label: "High", activeClass: "bg-orange-500 text-white border-orange-500" },
];

function ExceptionRecommendationCard({ exception }: { exception: PersistedException }) {
  const { data, isLoading, isError, error, refetch } = useExceptionRecommendation(exception.id);

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <div className="min-w-0">
          <Link href={`/wms/exceptions/${exception.id}`} className="text-sm font-semibold hover:underline">
            {exception.title}
          </Link>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span>
              {exception.entityId} · {entityTypeLabel(exception.entityType)}
            </span>
            <span>Detected {formatRelativeTime(exception.detectedAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <SeverityBadge severity={exception.severity} />
          <StatusBadge status={exception.status} />
        </div>
      </div>
      <div className="p-4">
        {isLoading ? (
          <SectionSkeleton />
        ) : isError ? (
          <SectionError
            message={error instanceof Error ? error.message : "No recommendation is available for this exception."}
            onRetry={() => refetch()}
          />
        ) : (
          <RecommendationCard action={data!.recommendation} />
        )}
      </div>
    </div>
  );
}

function RecommendationListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-4">
          <SectionSkeleton />
        </div>
      ))}
    </div>
  );
}

function RecommendationEmptyState({ severity }: { severity: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
      <Lightbulb className="h-8 w-8 text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium">No open {severity.toLowerCase()} exceptions</p>
      <p className="text-sm text-muted-foreground">There is nothing needing a recommended response right now.</p>
    </div>
  );
}

function RecommendationErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
      <AlertCircle className="h-8 w-8 text-destructive" aria-hidden />
      <div>
        <p className="text-sm font-medium">Unable to load exceptions</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

export function RecommendationCenter() {
  const [severity, setSeverity] = useState<ExceptionSeverity>(ExceptionSeverity.CRITICAL);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isError, error, refetch, isFetching } = useOpenExceptionsBySeverity(
    severity,
    PAGE_SIZE,
    offset,
  );

  const exceptions = data?.data ?? [];
  const isPageFull = exceptions.length === PAGE_SIZE;

  function selectSeverity(next: ExceptionSeverity) {
    setSeverity(next);
    setOffset(0);
  }

  return (
    <>
      <PageHeader
        title="Recommendations"
        description="Move from problem to recommended response as fast as possible."
      />

      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter by severity">
            {SEVERITY_TABS.map((tab) => {
              const active = severity === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectSeverity(tab.value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                    active ? tab.activeClass : "border-border bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          {isFetching && !isLoading ? <span className="text-xs text-muted-foreground">Refreshing…</span> : null}
        </div>

        {isError ? (
          <RecommendationErrorState
            message={error instanceof Error ? error.message : "An unexpected error occurred."}
            onRetry={() => refetch()}
          />
        ) : isLoading ? (
          <RecommendationListSkeleton />
        ) : exceptions.length === 0 ? (
          <RecommendationEmptyState severity={severity} />
        ) : (
          <div className="space-y-4">
            {exceptions.map((exception) => (
              <ExceptionRecommendationCard key={exception.id} exception={exception} />
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-muted-foreground">Rows {offset + 1}–{offset + exceptions.length}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={!isPageFull} onClick={() => setOffset(offset + PAGE_SIZE)}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
