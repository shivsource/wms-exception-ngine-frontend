import { ConfidenceBadge } from "@/components/intelligence/confidence-badge";
import { SeverityBadge } from "@/components/intelligence/severity-badge";
import { humanize } from "@/lib/wms/labels";
import type { RecommendedAction } from "@/types/recommendation";

const ACTIONABILITY_LABEL: Record<RecommendedAction["actionability"], string> = {
  IMMEDIATE: "Act now",
  PLANNED: "Plan for it",
  INVESTIGATE: "Needs investigation",
  MONITOR: "Monitor only",
};

export function RecommendationCard({ action, alternative }: { action: RecommendedAction; alternative?: boolean }) {
  return (
    <div className={alternative ? "rounded-md border bg-background p-3.5" : "rounded-md border border-foreground/20 bg-muted/30 p-4"}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className={alternative ? "text-sm font-semibold" : "text-base font-semibold"}>{action.title}</h3>
        <div className="flex items-center gap-1.5">
          <SeverityBadge severity={action.priority} />
          <ConfidenceBadge level={action.confidenceLevel} />
        </div>
      </div>
      <p className="mt-1.5 text-sm">{action.action}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {ACTIONABILITY_LABEL[action.actionability]}
      </p>

      <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted-foreground">Why</dt>
          <dd>{action.reason}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Expected impact</dt>
          <dd>{action.expectedImpact.expectedOutcome}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Risk of this action</dt>
          <dd>
            {action.risk.level} — {action.risk.description}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Approval</dt>
          <dd>
            {action.approval.level.replace("_", " ")} — {action.approval.reason}
          </dd>
        </div>
      </div>

      {action.supportingEvidence.length > 0 ? (
        <ul className="mt-3 space-y-1 border-t pt-2 text-xs text-muted-foreground">
          {action.supportingEvidence.map((item, i) => (
            <li key={i}>
              • {humanize(item.field)}: {item.reason}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
