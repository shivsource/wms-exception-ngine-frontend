"use client";

import { subHours } from "date-fns";
import { AlertTriangle, ArrowRight, CheckCircle2, Lightbulb, TrendingUp, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { RiskBadge } from "@/components/intelligence/risk-badge";
import { SeverityBadge } from "@/components/intelligence/severity-badge";
import { StatusBadge } from "@/components/intelligence/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCriticalExceptions, useOpenExceptions } from "@/features/exceptions/hooks";
import { usePredictions } from "@/features/predictions/hooks";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { exceptionTypeLabel } from "@/lib/wms/labels";
import { ExceptionSeverity, PredictionStatus, RiskLevel } from "@/types/enums";
import type { PersistedException } from "@/types/exception";

const SEVERITY_ORDER = [ExceptionSeverity.CRITICAL, ExceptionSeverity.HIGH, ExceptionSeverity.MEDIUM, ExceptionSeverity.LOW];

function StatTile({
  label,
  value,
  approximate,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number | null;
  approximate?: boolean;
  icon: LucideIcon;
  tone: "neutral" | "critical" | "risk";
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon
          className={cn(
            "h-4 w-4",
            tone === "critical" ? "text-red-600" : tone === "risk" ? "text-amber-600" : "text-muted-foreground",
          )}
          aria-hidden
        />
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums">
        {value === null ? <Skeleton className="h-7 w-14" /> : `${value}${approximate ? "+" : ""}`}
      </div>
    </div>
  );
}

function TypeBreakdownBars({ exceptions }: { exceptions: PersistedException[] }) {
  const counts = useMemo(() => {
    const byType = new Map<string, number>();
    for (const exc of exceptions) byType.set(exc.type, (byType.get(exc.type) ?? 0) + 1);
    return Array.from(byType.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [exceptions]);

  const max = counts[0]?.[1] ?? 1;

  if (counts.length === 0) {
    return <p className="text-sm text-muted-foreground">No open exceptions to break down.</p>;
  }

  return (
    <div className="space-y-2.5">
      {counts.map(([type, count]) => (
        <div key={type} className="flex items-center gap-3">
          <span className="w-40 shrink-0 truncate text-sm">{exceptionTypeLabel(type)}</span>
          <div className="h-1.5 flex-1 rounded-full bg-muted">
            <div
              className="h-1.5 rounded-full bg-primary"
              style={{ width: `${Math.max(4, (count / max) * 100)}%` }}
            />
          </div>
          <span className="w-8 shrink-0 text-right text-sm tabular-nums text-muted-foreground">{count}</span>
        </div>
      ))}
    </div>
  );
}

function SeverityTiles({ exceptions }: { exceptions: PersistedException[] }) {
  const counts = useMemo(() => {
    const bySeverity = new Map<string, number>();
    for (const exc of exceptions) bySeverity.set(exc.severity, (bySeverity.get(exc.severity) ?? 0) + 1);
    return bySeverity;
  }, [exceptions]);

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {SEVERITY_ORDER.map((severity) => (
        <div key={severity} className="flex flex-col items-start gap-1.5 rounded-md border p-3">
          <SeverityBadge severity={severity} />
          <span className="text-xl font-semibold tabular-nums">{counts.get(severity) ?? 0}</span>
        </div>
      ))}
    </div>
  );
}

function RecentExceptionsList({ exceptions }: { exceptions: PersistedException[] }) {
  const urgent = useMemo(
    () =>
      exceptions
        .filter((e) => e.severity === ExceptionSeverity.CRITICAL || e.severity === ExceptionSeverity.HIGH)
        .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
        .slice(0, 6),
    [exceptions],
  );

  if (urgent.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <CheckCircle2 className="h-6 w-6 text-emerald-500" aria-hidden />
        <p className="text-sm text-muted-foreground">No open critical or high severity exceptions.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {urgent.map((exc) => (
        <li key={exc.id}>
          <Link
            href={`/wms/exceptions/${exc.id}`}
            className="flex items-center justify-between gap-3 py-2.5 text-sm hover:bg-muted/50"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{exc.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {exc.entityId} · {formatRelativeTime(exc.detectedAt)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <SeverityBadge severity={exc.severity} />
              <StatusBadge status={exc.status} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function OverviewDashboard() {
  const { data: openData, isLoading: openLoading } = useOpenExceptions();
  const { data: criticalData, isLoading: criticalLoading } = useCriticalExceptions();
  const { data: criticalRisk } = usePredictions({ status: PredictionStatus.ACTIVE, riskLevel: RiskLevel.CRITICAL, limit: 200 });
  const { data: highRisk } = usePredictions({ status: PredictionStatus.ACTIVE, riskLevel: RiskLevel.HIGH, limit: 200 });

  const openExceptions = openData?.data ?? [];
  const openCount = openData?.count ?? null;
  const openCapped = openCount === 500;

  const criticalActiveCount = criticalData?.count ?? null;

  const riskCount =
    criticalRisk && highRisk ? criticalRisk.count + highRisk.count : criticalRisk ? criticalRisk.count : null;
  const riskCapped = (criticalRisk?.count ?? 0) === 200 || (highRisk?.count ?? 0) === 200;

  const last24h = useMemo(
    () => openExceptions.filter((e) => new Date(e.detectedAt) >= subHours(new Date(), 24)).length,
    [openExceptions],
  );

  return (
    <>
      <PageHeader
        title="WMS Overview"
        description="What's happening, what's urgent, and what needs a decision."
      />

      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile label="Open Exceptions" value={openCount} approximate={openCapped} icon={AlertTriangle} tone="neutral" />
          <StatTile label="Critical & Active" value={criticalActiveCount} icon={AlertTriangle} tone="critical" />
          <StatTile
            label="High-Risk Predictions"
            value={riskCount}
            approximate={riskCapped}
            icon={TrendingUp}
            tone="risk"
          />
          <StatTile label="Detected — Last 24h" value={openLoading ? null : last24h} icon={AlertTriangle} tone="neutral" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold">Open Exceptions by Severity</h2>
            </div>
            <div className="p-4">
              {openLoading ? <Skeleton className="h-24 w-full" /> : <SeverityTiles exceptions={openExceptions} />}
            </div>
          </section>

          <section className="rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold">Open Exceptions by Type</h2>
            </div>
            <div className="p-4">
              {openLoading ? (
                <div className="space-y-2.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              ) : (
                <TypeBreakdownBars exceptions={openExceptions} />
              )}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold">Needs Attention</h2>
              <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/wms/exceptions" />}>
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="px-4">
              {openLoading ? (
                <div className="space-y-3 py-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <RecentExceptionsList exceptions={openExceptions} />
              )}
            </div>
          </section>

          <section className="rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold">Top Active Predictions</h2>
              <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/wms/predictions" />}>
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="p-4">
              {!criticalRisk || !highRisk ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                (() => {
                  const top = [...criticalRisk.data, ...highRisk.data]
                    .sort((a, b) => (b.riskScore ?? 0) - (a.riskScore ?? 0))
                    .slice(0, 6);
                  if (top.length === 0) {
                    return (
                      <div className="flex flex-col items-center gap-2 py-8 text-center">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" aria-hidden />
                        <p className="text-sm text-muted-foreground">No active high or critical risk predictions.</p>
                      </div>
                    );
                  }
                  return (
                    <ul className="divide-y">
                      {top.map((p) => (
                        <li key={p.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                          <div className="min-w-0">
                            <p className="truncate font-medium">{p.entityId}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {p.explanation}
                            </p>
                          </div>
                          <RiskBadge level={p.riskLevel} className="shrink-0" />
                        </li>
                      ))}
                    </ul>
                  );
                })()
              )}
            </div>
          </section>
        </div>

        <section className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold">Recommendations</h2>
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/wms/recommendations" />}>
              View recommendations <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="flex items-center gap-2.5 p-4 text-sm text-muted-foreground">
            <Lightbulb className="h-4 w-4 shrink-0" aria-hidden />
            Recommended actions are computed per exception — open the Recommendations page to work through open
            critical and high severity exceptions one by one.
          </div>
        </section>
      </div>
    </>
  );
}
