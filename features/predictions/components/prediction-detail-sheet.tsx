"use client";

import { ConfidenceBadge } from "@/components/intelligence/confidence-badge";
import { RiskBadge } from "@/components/intelligence/risk-badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateTime, formatMinutes } from "@/lib/utils/format";
import { entityTypeLabel, humanize, predictionTypeLabel } from "@/lib/wms/labels";
import { PredictionStatus } from "@/types/enums";
import type { PersistedPrediction } from "@/types/prediction";

const STATUS_TEXT: Record<string, string> = {
  ACTIVE: "Active — not yet confirmed",
  CONFIRMED: "Confirmed — became an open exception",
  RESOLVED: "Resolved",
};

export function PredictionDetailSheet({
  prediction,
  onClose,
}: {
  prediction: PersistedPrediction | null;
  onClose: () => void;
}) {
  return (
    <Sheet open={prediction !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        {prediction ? (
          <>
            <SheetHeader>
              <SheetTitle>{predictionTypeLabel(prediction.predictionType)}</SheetTitle>
              <p className="text-xs text-muted-foreground">{prediction.predictionId}</p>
            </SheetHeader>

            <ScrollArea className="flex-1 px-4 pb-4">
              <div className="flex flex-wrap items-center gap-1.5">
                <RiskBadge level={prediction.riskLevel} />
                {prediction.confidence ? <ConfidenceBadge level={prediction.confidence} /> : null}
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Entity</dt>
                  <dd className="font-medium">{prediction.entityId}</dd>
                  <dd className="text-xs text-muted-foreground">{entityTypeLabel(prediction.entityType)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Risk score</dt>
                  <dd className="font-medium">{prediction.riskScore ?? "—"}/100</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Prediction window</dt>
                  <dd className="font-medium">
                    {prediction.predictionWindow ? formatMinutes(prediction.predictionWindow.value) : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Status</dt>
                  <dd className="font-medium">{STATUS_TEXT[prediction.status] ?? prediction.status}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Predicted at</dt>
                  <dd className="font-medium">{formatDateTime(prediction.predictedAt)}</dd>
                </div>
                {prediction.resolvedAt ? (
                  <div>
                    <dt className="text-xs text-muted-foreground">Resolved at</dt>
                    <dd className="font-medium">{formatDateTime(prediction.resolvedAt)}</dd>
                  </div>
                ) : null}
              </dl>

              {prediction.status === PredictionStatus.CONFIRMED && prediction.confirmedExceptionId ? (
                <p className="mt-3 rounded-md border border-dashed p-2.5 text-xs text-muted-foreground">
                  This risk materialized as exception <span className="font-medium text-foreground">{prediction.confirmedExceptionId}</span>.
                </p>
              ) : null}

              <div className="mt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Why</h4>
                <p className="mt-1 text-sm">{prediction.explanation}</p>
              </div>

              {prediction.signals.length > 0 ? (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Signals</h4>
                  <div className="mt-2 space-y-2">
                    {prediction.signals.map((signal, i) => (
                      <div key={i} className="rounded-md border p-2.5 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{humanize(signal.signal)}</span>
                          <span className="text-xs text-muted-foreground">
                            {String(signal.value)}
                            {signal.unit ? ` ${signal.unit}` : ""}
                            {signal.expected !== undefined && signal.expected !== null
                              ? ` (expected ${signal.expected}${signal.unit ? ` ${signal.unit}` : ""})`
                              : ""}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{signal.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {prediction.limitations.length > 0 ? (
                <div className="mt-4 space-y-0.5 border-t pt-3 text-xs text-muted-foreground">
                  {prediction.limitations.map((note, i) => (
                    <p key={i}>⚠ {note}</p>
                  ))}
                </div>
              ) : null}
            </ScrollArea>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
