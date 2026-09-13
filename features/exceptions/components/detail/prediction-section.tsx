"use client";

import { TrendingUp } from "lucide-react";
import { RiskBadge } from "@/components/intelligence/risk-badge";
import { SectionError, SectionSkeleton } from "@/components/intelligence/section-states";
import { usePredictionsForEntity } from "@/features/predictions/hooks";
import { predictionTypeLabel } from "@/lib/wms/labels";
import { PredictionStatus } from "@/types/enums";
import type { PersistedPrediction } from "@/types/prediction";

function PredictionCard({ prediction }: { prediction: PersistedPrediction }) {
  return (
    <div className="rounded-md border border-dashed border-amber-300 bg-amber-50/50 p-3.5 dark:border-amber-900 dark:bg-amber-950/20">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{predictionTypeLabel(prediction.predictionType)}</h3>
        <RiskBadge level={prediction.riskLevel} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {prediction.riskScore !== null ? <span>Risk score: {prediction.riskScore}/100</span> : null}
        {prediction.confidence ? <span>Confidence: {prediction.confidence}</span> : null}
        {prediction.predictionWindow ? (
          <span>Window: {prediction.predictionWindow.value} min</span>
        ) : null}
        <span>
          Status: {prediction.status === PredictionStatus.CONFIRMED ? "Confirmed — now an open exception" : "Active"}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{prediction.explanation}</p>
      {prediction.limitations.length > 0 ? (
        <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
          {prediction.limitations.map((note, i) => (
            <p key={i}>⚠ {note}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PredictionSection({ entityId }: { entityId: string }) {
  const { data, isLoading, isError, refetch } = usePredictionsForEntity(entityId);

  const activePredictions = (data?.predictions ?? []).filter((p) => p.status !== PredictionStatus.RESOLVED);

  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50/30 dark:border-amber-900 dark:bg-amber-950/10">
      <div className="flex items-center gap-2.5 border-b border-amber-200 px-5 py-3.5 dark:border-amber-900">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-900/40">
          <TrendingUp className="h-4 w-4 text-amber-700 dark:text-amber-400" aria-hidden />
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Predicted — Not Yet Happened
          </div>
          <h2 className="text-sm font-semibold leading-tight">What Happens Next</h2>
        </div>
      </div>
      <div className="p-5">
        {isLoading ? (
          <SectionSkeleton />
        ) : isError ? (
          <SectionError message="Could not load risk predictions for this entity." onRetry={() => refetch()} />
        ) : activePredictions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No active risk predictions for {entityId} right now.
          </p>
        ) : (
          <div className="space-y-3">
            {activePredictions.map((prediction) => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
