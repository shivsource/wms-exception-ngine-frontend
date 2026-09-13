import type { ExceptionType } from "./enums";
import type { PersistedException } from "./exception";

/** Mirrors backend src/interfaces/root-cause-analysis.interface.ts */
export type CauseOrigin = "OBSERVED" | "INFERRED";
export type CauseConfidence = "HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT_EVIDENCE";

export interface SupportingEvidenceItem {
  field: string;
  value: unknown;
  weight: number;
  supports: string;
}

export interface RootCause {
  type: string;
  category: CauseOrigin;
  score: number;
  confidenceLevel: CauseConfidence;
  explanation: string;
}

export interface CausalChainLink {
  from: string;
  to: string;
  relationship: string;
}

export interface RootCauseAnalysis {
  exceptionId: string;
  exceptionType: ExceptionType;
  primaryCause: RootCause | null;
  contributingCauses: RootCause[];
  supportingEvidence: SupportingEvidenceItem[];
  causalChain: CausalChainLink[];
  limitations: string[];
  analysisExplanation: string;
  analyzedAt: string;
}

/** Response shape of GET /exceptions/:id/root-cause */
export type RootCauseView = { exception: PersistedException } & RootCauseAnalysis;
