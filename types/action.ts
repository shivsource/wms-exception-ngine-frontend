import type { ActionStatus, ActionType, ExceptionType, OutcomeResult } from "./enums";
import type { ExceptionSeverity } from "./enums";

/** Mirrors backend src/interfaces/action.interface.ts */
export interface Action {
  id: number;
  actionId: string;
  exceptionDbId: number;
  exceptionId: string;
  exceptionType: ExceptionType;
  recommendationDbId: number;
  recommendationId: string;
  actionType: ActionType;
  status: ActionStatus;
  title: string;
  reason: string;
  parameters: Record<string, unknown>;
  createdAt: string;
  approvedAt: string | null;
  executedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
}

/** Mirrors backend src/interfaces/impact.interface.ts */
export interface ImpactMetric {
  metric: string;
  before: number;
  after: number;
  unit: string;
}

export interface ActionImpact {
  actionId: string;
  metrics: ImpactMetric[];
  minutesSaved: number | null;
  percentageImprovement: number | null;
  slaRecovered: boolean | null;
  ordersAffected: number;
  tasksAffected: number;
  severityChange: { before: ExceptionSeverity; after: ExceptionSeverity | null } | null;
  notes: string[];
}

/** Mirrors backend src/interfaces/action-outcome.interface.ts */
export interface ActionOutcome {
  id: number;
  outcomeId: string;
  actionDbId: number;
  actionId: string;
  result: OutcomeResult;
  beforeMetrics: Record<string, unknown>;
  afterMetrics: Record<string, unknown>;
  expectedImpact: ActionImpact;
  actualImpact: ActionImpact;
  measuredAt: string;
  createdAt: string;
}

/** Response shape of POST /actions/:id/execute */
export interface ExecuteActionResult {
  action: Action;
  outcome: ActionOutcome;
  alreadyExecuted: boolean;
}
