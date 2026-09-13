import type { CauseConfidence, CauseOrigin } from "./root-cause";
import type { ExceptionSeverity, ExceptionType } from "./enums";
import type { PersistedException } from "./exception";

/** Mirrors backend src/interfaces/recommendation.interface.ts */
export type RecommendationActionType =
  | "VERIFY"
  | "CHECK_INVENTORY"
  | "CHECK_LOCATION"
  | "REASSIGN"
  | "REPLENISH"
  | "PRIORITIZE"
  | "RE_PICK"
  | "RE_PACK"
  | "ADJUST"
  | "ESCALATE"
  | "INVESTIGATE"
  | "MONITOR";

export type RecommendationActionability = "IMMEDIATE" | "PLANNED" | "INVESTIGATE" | "MONITOR";
export type RecommendationRiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type ApprovalLevel = "NOT_REQUIRED" | "RECOMMENDED" | "REQUIRED";

export interface RecommendationEvidenceItem {
  field: string;
  value: unknown;
  reason: string;
}

export interface RecommendedAction {
  actionType: RecommendationActionType;
  title: string;
  action: string;
  priority: ExceptionSeverity;
  actionability: RecommendationActionability;
  score: number;
  confidenceLevel: CauseConfidence;
  reason: string;
  supportingEvidence: RecommendationEvidenceItem[];
  expectedImpact: { metric: string; expectedOutcome: string };
  risk: { level: RecommendationRiskLevel; description: string };
  approval: { level: ApprovalLevel; reason: string };
}

export interface RecommendationRootCauseSummary {
  type: string;
  category: CauseOrigin;
  confidenceLevel: CauseConfidence;
}

export interface RecommendationResult {
  exceptionId: string;
  exceptionType: ExceptionType;
  rootCause: RecommendationRootCauseSummary | null;
  recommendation: RecommendedAction;
  alternativeRecommendations: RecommendedAction[];
  limitations: string[];
  analyzedAt: string;
}

/** Response shape of GET /exceptions/:id/recommendation */
export type RecommendationView = { exception: PersistedException } & RecommendationResult;
