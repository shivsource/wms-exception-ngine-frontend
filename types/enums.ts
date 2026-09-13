/**
 * Mirrors wms-exception-engine-backend/src/types/enums.ts exactly. Do not add or rename
 * values speculatively — these are read verbatim off the live API.
 */

export const ExceptionSeverity = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;
export type ExceptionSeverity = (typeof ExceptionSeverity)[keyof typeof ExceptionSeverity];

export const ExceptionStatus = {
  OPEN: "OPEN",
  ACKNOWLEDGED: "ACKNOWLEDGED",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  IGNORED: "IGNORED",
} as const;
export type ExceptionStatus = (typeof ExceptionStatus)[keyof typeof ExceptionStatus];

/** The 10 initial rule-based exception types. */
export const ExceptionType = {
  INVENTORY_SHORTAGE: "INVENTORY_SHORTAGE",
  INVENTORY_DISCREPANCY: "INVENTORY_DISCREPANCY",
  PICKING_DELAY: "PICKING_DELAY",
  PICKING_ERROR: "PICKING_ERROR",
  EXCESSIVE_PICKING_TIME: "EXCESSIVE_PICKING_TIME",
  EXCESSIVE_PICKER_DISTANCE: "EXCESSIVE_PICKER_DISTANCE",
  SLA_AT_RISK: "SLA_AT_RISK",
  PACKING_DELAY: "PACKING_DELAY",
  DISPATCH_DELAY: "DISPATCH_DELAY",
  HIGH_RETURN_RATE: "HIGH_RETURN_RATE",
} as const;
export type ExceptionType = (typeof ExceptionType)[keyof typeof ExceptionType];

/** The kind of WMS entity a detected exception is attached to (entityId refers to this). */
export const EntityType = {
  ORDER: "ORDER",
  ORDER_ITEM: "ORDER_ITEM",
  PICKING_TASK: "PICKING_TASK",
  PICKER: "PICKER",
  PRODUCT: "PRODUCT",
  INVENTORY: "INVENTORY",
  PACKING: "PACKING",
  DISPATCH: "DISPATCH",
} as const;
export type EntityType = (typeof EntityType)[keyof typeof EntityType];

export const ActionType = {
  REASSIGN_PICKER: "REASSIGN_PICKER",
  MOVE_INVENTORY: "MOVE_INVENTORY",
  REPLENISH_INVENTORY: "REPLENISH_INVENTORY",
  RECHECK_INVENTORY: "RECHECK_INVENTORY",
  PRIORITIZE_ORDER: "PRIORITIZE_ORDER",
  ESCALATE_OPERATION: "ESCALATE_OPERATION",
} as const;
export type ActionType = (typeof ActionType)[keyof typeof ActionType];

export const ActionStatus = {
  PROPOSED: "PROPOSED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  EXECUTING: "EXECUTING",
  EXECUTED: "EXECUTED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;
export type ActionStatus = (typeof ActionStatus)[keyof typeof ActionStatus];

export const OutcomeResult = {
  SUCCESS: "SUCCESS",
  PARTIAL_SUCCESS: "PARTIAL_SUCCESS",
  NO_IMPROVEMENT: "NO_IMPROVEMENT",
  FAILED: "FAILED",
} as const;
export type OutcomeResult = (typeof OutcomeResult)[keyof typeof OutcomeResult];

/** Deliberately distinct values from ExceptionType — a prediction is never an exception. */
export const PredictionType = {
  SLA_BREACH_RISK: "SLA_BREACH_RISK",
  PICKING_DELAY_RISK: "PICKING_DELAY_RISK",
  INVENTORY_SHORTAGE_RISK: "INVENTORY_SHORTAGE_RISK",
  DISPATCH_DELAY_RISK: "DISPATCH_DELAY_RISK",
} as const;
export type PredictionType = (typeof PredictionType)[keyof typeof PredictionType];

export const RiskLevel = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
  UNKNOWN: "UNKNOWN",
} as const;
export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel];

export const PredictionStatus = {
  ACTIVE: "ACTIVE",
  CONFIRMED: "CONFIRMED",
  RESOLVED: "RESOLVED",
} as const;
export type PredictionStatus = (typeof PredictionStatus)[keyof typeof PredictionStatus];
