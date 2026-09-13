import type { EntityType, ExceptionSeverity, ExceptionStatus, ExceptionType } from "./enums";

/**
 * Mirrors backend PersistedException (src/interfaces/persisted-exception.interface.ts) —
 * the exact shape returned by GET /exceptions and GET /exceptions/:id. Dates arrive as ISO
 * strings over JSON, never Date instances.
 */
export interface PersistedException {
  id: number;
  exceptionId: string;
  type: ExceptionType;
  entityType: EntityType;
  entityId: string;
  severity: ExceptionSeverity;
  status: ExceptionStatus;
  title: string;
  description: string | null;
  evidence: Record<string, unknown> | null;
  detectedAt: string;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Mirrors backend EnrichedException (GET /exceptions/:id/evidence). */
export interface EnrichedException extends PersistedException {
  structuredEvidence: Record<string, unknown> | null;
  explanation: string;
}

export interface ExceptionListFilters {
  status?: ExceptionStatus;
  severity?: ExceptionSeverity;
  type?: ExceptionType;
  limit?: number;
  offset?: number;
}
