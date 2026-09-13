"use client";

import { Search } from "lucide-react";
import { ConfidenceBadge, OriginBadge } from "@/components/intelligence/confidence-badge";
import { SectionCard } from "@/components/intelligence/section-card";
import { SectionError, SectionSkeleton } from "@/components/intelligence/section-states";
import { useExceptionRootCause } from "@/features/exceptions/hooks";
import { cn } from "@/lib/utils";
import { humanize } from "@/lib/wms/labels";
import type { RootCause } from "@/types/root-cause";

function CauseCard({ cause, primary }: { cause: RootCause; primary?: boolean }) {
  return (
    <div className={cn("rounded-md border p-3.5", primary ? "border-foreground/20 bg-muted/30" : "bg-background")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{humanize(cause.type)}</h3>
        <div className="flex items-center gap-1.5">
          <OriginBadge origin={cause.category} />
          <ConfidenceBadge level={cause.confidenceLevel} />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-foreground/70" style={{ width: `${cause.score}%` }} />
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">{cause.score}/100</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{cause.explanation}</p>
    </div>
  );
}

export function RootCauseSection({ exceptionId }: { exceptionId: number }) {
  const { data, isLoading, isError, error, refetch } = useExceptionRootCause(exceptionId);

  return (
    <SectionCard icon={Search} eyebrow="Why" title="Root Cause">
      {isLoading ? (
        <SectionSkeleton />
      ) : isError ? (
        <SectionError
          message={
            error instanceof Error
              ? error.message
              : "Root cause analysis is not available for this exception type."
          }
          onRetry={() => refetch()}
        />
      ) : !data?.primaryCause ? (
        <p className="text-sm text-muted-foreground">
          {data?.analysisExplanation ?? "No root cause could be determined from the available evidence."}
        </p>
      ) : (
        <div className="space-y-4">
          <CauseCard cause={data.primaryCause} primary />

          {data.contributingCauses.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contributing Factors
              </h4>
              <div className="space-y-2">
                {data.contributingCauses.map((cause) => (
                  <CauseCard key={cause.type} cause={cause} />
                ))}
              </div>
            </div>
          ) : null}

          {data.supportingEvidence.length > 0 ? (
            <div className="space-y-1.5 border-t pt-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Evidence</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {data.supportingEvidence.map((item, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span aria-hidden>•</span>
                    <span>
                      <span className="font-medium text-foreground">{humanize(item.field.split(".").pop() ?? item.field)}</span>
                      {": "}
                      {String(item.value)} — supports {humanize(item.supports)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {data.limitations.length > 0 ? (
            <div className="space-y-1 border-t pt-3 text-xs text-muted-foreground">
              {data.limitations.map((note, i) => (
                <p key={i}>⚠ {note}</p>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </SectionCard>
  );
}
