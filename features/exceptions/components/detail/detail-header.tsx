"use client";

import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { SeverityBadge } from "@/components/intelligence/severity-badge";
import { StatusBadge } from "@/components/intelligence/status-badge";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from "@/components/layout/connection-status";
import { useResolveException } from "@/features/exceptions/hooks";
import { formatDateTime, formatRelativeTime } from "@/lib/utils/format";
import { entityTypeLabel, exceptionTypeLabel } from "@/lib/wms/labels";
import { ExceptionStatus } from "@/types/enums";
import type { PersistedException } from "@/types/exception";

export function DetailHeader({ exception }: { exception: PersistedException }) {
  const resolve = useResolveException();
  const canResolve = exception.status !== ExceptionStatus.RESOLVED && exception.status !== ExceptionStatus.IGNORED;

  return (
    <header className="sticky top-0 z-10 flex flex-col gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/80 md:px-6 md:py-4">
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 -ml-2"
          nativeButton={false}
          render={<Link href="/wms/exceptions" />}
        >
          <ArrowLeft className="h-4 w-4" />
          Exception Center
        </Button>
        <ConnectionStatus />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">{exceptionTypeLabel(exception.type)}</h1>
            <SeverityBadge severity={exception.severity} />
            <StatusBadge status={exception.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {entityTypeLabel(exception.entityType)} <span className="font-medium text-foreground">{exception.entityId}</span>
            {" · "}
            {exception.exceptionId}
          </p>
          <p className="text-xs text-muted-foreground" title={formatDateTime(exception.detectedAt)}>
            Detected {formatRelativeTime(exception.detectedAt)}
            {exception.resolvedAt ? ` · Resolved ${formatRelativeTime(exception.resolvedAt)}` : ""}
          </p>
        </div>

        {canResolve ? (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={resolve.isPending}
            onClick={() => resolve.mutate(exception.id)}
          >
            <CheckCircle2 className="h-4 w-4" />
            {resolve.isPending ? "Resolving…" : "Mark Resolved"}
          </Button>
        ) : null}
      </div>
    </header>
  );
}
