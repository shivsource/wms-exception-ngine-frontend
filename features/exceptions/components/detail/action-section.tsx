"use client";

import { PlayCircle, ShieldCheck, Zap } from "lucide-react";
import { SectionCard } from "@/components/intelligence/section-card";
import { SectionError, SectionSkeleton } from "@/components/intelligence/section-states";
import { Button } from "@/components/ui/button";
import {
  useActionOutcome,
  useApproveAction,
  useCreateAction,
  useExecuteAction,
} from "@/features/actions/hooks";
import { useExceptionActions } from "@/features/exceptions/hooks";
import { HttpError } from "@/lib/api/http-error";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils/format";
import { humanize } from "@/lib/wms/labels";
import { ActionStatus } from "@/types/enums";
import type { Action } from "@/types/action";

const ACTION_STATUS_STYLES: Record<ActionStatus, string> = {
  PROPOSED: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900",
  APPROVED: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-900",
  EXECUTING: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-900",
  EXECUTED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900",
  FAILED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
  REJECTED: "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
  CANCELLED: "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
};

const OUTCOME_STYLES: Record<string, string> = {
  SUCCESS: "text-emerald-700 dark:text-emerald-400",
  PARTIAL_SUCCESS: "text-amber-700 dark:text-amber-400",
  NO_IMPROVEMENT: "text-slate-600 dark:text-slate-400",
  FAILED: "text-red-700 dark:text-red-400",
};

function ActionOutcomePanel({ actionId }: { actionId: number }) {
  const { data, isLoading, isError } = useActionOutcome(actionId);

  if (isLoading) return <SectionSkeleton />;
  if (isError || !data) return <p className="text-sm text-muted-foreground">Outcome not yet available.</p>;

  const impact = data.actualImpact;

  return (
    <div className="space-y-3">
      <p className={cn("text-sm font-semibold", OUTCOME_STYLES[data.result])}>{humanize(data.result)}</p>
      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        {impact.minutesSaved !== null ? (
          <div>
            <dt className="text-xs text-muted-foreground">Minutes saved</dt>
            <dd className="font-medium">{impact.minutesSaved}</dd>
          </div>
        ) : null}
        {impact.percentageImprovement !== null ? (
          <div>
            <dt className="text-xs text-muted-foreground">Improvement</dt>
            <dd className="font-medium">{impact.percentageImprovement}%</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs text-muted-foreground">Orders affected</dt>
          <dd className="font-medium">{impact.ordersAffected}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Tasks affected</dt>
          <dd className="font-medium">{impact.tasksAffected}</dd>
        </div>
      </div>
      {impact.metrics.length > 0 ? (
        <ul className="space-y-1 border-t pt-2 text-sm text-muted-foreground">
          {impact.metrics.map((m, i) => (
            <li key={i}>
              {humanize(m.metric)}: {m.before} → {m.after} {m.unit}
            </li>
          ))}
        </ul>
      ) : null}
      {impact.notes.length > 0 ? (
        <div className="space-y-0.5 text-xs text-muted-foreground">
          {impact.notes.map((n, i) => (
            <p key={i}>⚠ {n}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function LatestActionControls({ action, exceptionDbId }: { action: Action; exceptionDbId: number }) {
  const approve = useApproveAction(exceptionDbId);
  const execute = useExecuteAction(exceptionDbId);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{action.title}</h3>
          <p className="text-sm text-muted-foreground">{action.reason}</p>
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold",
            ACTION_STATUS_STYLES[action.status],
          )}
        >
          {humanize(action.status)}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        Created {formatDateTime(action.createdAt)}
        {action.approvedAt ? ` · Approved ${formatDateTime(action.approvedAt)}` : ""}
        {action.executedAt ? ` · Executed ${formatDateTime(action.executedAt)}` : ""}
      </p>

      {action.status === ActionStatus.PROPOSED ? (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="gap-1.5"
            disabled={approve.isPending}
            onClick={() => approve.mutate(action.id)}
          >
            <ShieldCheck className="h-4 w-4" />
            {approve.isPending ? "Approving…" : "Approve"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Dismiss isn&apos;t available yet — the backend has no reject/cancel endpoint.
          </p>
        </div>
      ) : null}

      {approve.isError ? (
        <SectionError message={approve.error instanceof Error ? approve.error.message : "Could not approve this action."} />
      ) : null}

      {action.status === ActionStatus.APPROVED ? (
        <Button size="sm" className="gap-1.5" disabled={execute.isPending} onClick={() => execute.mutate(action.id)}>
          <Zap className="h-4 w-4" />
          {execute.isPending ? "Executing…" : "Execute"}
        </Button>
      ) : null}

      {execute.isError ? (
        <SectionError message={execute.error instanceof Error ? execute.error.message : "Could not execute this action."} />
      ) : null}

      {action.status === ActionStatus.EXECUTING ? (
        <p className="text-sm text-muted-foreground">Executing…</p>
      ) : null}

      {action.status === ActionStatus.EXECUTED ? (
        <div className="border-t pt-3">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Outcome</h4>
          <ActionOutcomePanel actionId={action.id} />
        </div>
      ) : null}

      {action.status === ActionStatus.FAILED ? (
        <p className="text-sm text-muted-foreground">This action failed to execute and cannot be retried automatically.</p>
      ) : null}
    </div>
  );
}

export function ActionSection({ exceptionDbId }: { exceptionDbId: number }) {
  const { data: actionsResult, isLoading, isError, refetch } = useExceptionActions(exceptionDbId);
  const create = useCreateAction(exceptionDbId);

  const actions = actionsResult?.data ?? [];
  const latest = actions.length > 0 ? actions[actions.length - 1] : null;
  const unmappable = create.error instanceof HttpError && create.error.status === 422;

  return (
    <SectionCard icon={PlayCircle} eyebrow="Can I Take Action" title="Action">
      {isLoading ? (
        <SectionSkeleton />
      ) : isError ? (
        <SectionError message="Could not load actions for this exception." onRetry={() => refetch()} />
      ) : latest ? (
        <LatestActionControls action={latest} exceptionDbId={exceptionDbId} />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            No action has been created for this exception yet. Creating one converts the recommendation above into a
            concrete, trackable operational step.
          </p>
          <Button size="sm" className="gap-1.5" disabled={create.isPending} onClick={() => create.mutate()}>
            <PlayCircle className="h-4 w-4" />
            {create.isPending ? "Creating…" : "Create Action from Recommendation"}
          </Button>
          {create.isError ? (
            <SectionError
              message={
                unmappable
                  ? "This recommendation has no automated action available — it requires manual follow-up by the operations team, not an automated execution."
                  : create.error instanceof Error
                    ? create.error.message
                    : "Could not create an action."
              }
            />
          ) : null}
        </div>
      )}
    </SectionCard>
  );
}
