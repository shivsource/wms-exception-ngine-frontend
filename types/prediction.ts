import type { EntityType, PredictionStatus, PredictionType, RiskLevel } from "./enums";
import type { PersistedException } from "./exception";

/** Mirrors backend src/interfaces/prediction.interface.ts + persisted-prediction.interface.ts */
export type PredictionConfidence = "HIGH" | "MEDIUM" | "LOW";

export interface RiskSignal {
  signal: string;
  value: number | string | boolean | null;
  expected?: number | null;
  unit?: string;
  contribution: number;
  reason: string;
}

export interface PredictionWindow {
  value: number;
  unit: "MINUTES";
}

/** Persisted row shape — GET /predictions, GET /predictions/:id */
export interface PersistedPrediction {
  id: number;
  predictionId: string;
  predictionType: PredictionType;
  entityType: EntityType;
  entityId: string;
  riskScore: number | null;
  riskLevel: RiskLevel;
  confidence: PredictionConfidence | null;
  status: PredictionStatus;
  predictionWindow: PredictionWindow | null;
  signals: RiskSignal[];
  explanation: string;
  limitations: string[];
  confirmedExceptionId: string | null;
  predictedAt: string;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PredictionListFilters {
  status?: PredictionStatus;
  riskLevel?: RiskLevel;
  predictionType?: PredictionType;
  entityType?: EntityType;
  limit?: number;
  offset?: number;
}

/** Response shape of GET /predictions/entity/:entityId */
export interface EntityPredictionsView {
  entityId: string;
  predictions: PersistedPrediction[];
  overallRisk: { score: number; level: RiskLevel; predictionType: PredictionType } | null;
}

export interface EntityPredictorEvaluation {
  predictionType: PredictionType;
  status: PredictionStatus | "INSUFFICIENT_DATA";
  riskScore: number | null;
  riskLevel: RiskLevel;
  confidence: PredictionConfidence | null;
  predictionWindow: PredictionWindow | null;
  signals: RiskSignal[];
  explanation: string;
  limitations: string[];
  confirmedExceptionId: string | null;
  persisted: PersistedPrediction | null;
}

/** Response shape of POST /predictions/evaluate/:entityType/:entityId */
export interface EntityEvaluationView {
  entityType: EntityType;
  entityId: string;
  existingOpenExceptions: PersistedException[];
  evaluations: EntityPredictorEvaluation[];
}
