import { EntityType, ExceptionType, PredictionType } from "@/types/enums";

/** Operator-facing language (see product language guidance) — never the raw enum in UI copy. */
const EXCEPTION_TYPE_LABELS: Record<ExceptionType, string> = {
  INVENTORY_SHORTAGE: "Inventory Shortage",
  INVENTORY_DISCREPANCY: "Inventory Discrepancy",
  PICKING_DELAY: "Picking Delay",
  PICKING_ERROR: "Picking Error",
  EXCESSIVE_PICKING_TIME: "Excessive Picking Time",
  EXCESSIVE_PICKER_DISTANCE: "Excessive Picker Distance",
  SLA_AT_RISK: "SLA At Risk",
  PACKING_DELAY: "Packing Delay",
  DISPATCH_DELAY: "Dispatch Delay",
  HIGH_RETURN_RATE: "High Return Rate",
};

const PREDICTION_TYPE_LABELS: Record<PredictionType, string> = {
  SLA_BREACH_RISK: "SLA Breach Risk",
  PICKING_DELAY_RISK: "Picking Delay Risk",
  INVENTORY_SHORTAGE_RISK: "Inventory Shortage Risk",
  DISPATCH_DELAY_RISK: "Dispatch Delay Risk",
};

const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  ORDER: "Order",
  ORDER_ITEM: "Order Item",
  PICKING_TASK: "Picking Task",
  PICKER: "Picker",
  PRODUCT: "Product",
  INVENTORY: "Inventory",
  PACKING: "Packing",
  DISPATCH: "Dispatch",
};

export function exceptionTypeLabel(type: string): string {
  return EXCEPTION_TYPE_LABELS[type as ExceptionType] ?? humanize(type);
}

export function predictionTypeLabel(type: string): string {
  return PREDICTION_TYPE_LABELS[type as PredictionType] ?? humanize(type);
}

export function entityTypeLabel(type: string): string {
  return ENTITY_TYPE_LABELS[type as EntityType] ?? humanize(type);
}

/**
 * Fallback for any identifier not in the maps above — handles both backend enum-style
 * SNAKE_CASE ("PICKER_OVERLOAD" -> "Picker Overload") and evidence/field-style camelCase
 * ("loadingTime" -> "Loading Time"), since both appear in API responses (root cause/
 * recommendation `type`/`field` values are SNAKE_CASE; structured evidence keys are camelCase).
 */
export function humanize(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
