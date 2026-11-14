import type { CSSProperties } from "react";
import type { Feature, VerificationStatus } from "./types";

export function featureStatus(feature: Feature): VerificationStatus {
  if (feature.attributes.some((a) => a.status === "requires_confirmation"))
    return "requires_confirmation";
  if (feature.attributes.some((a) => a.status === "missing")) return "missing";
  return "verified";
}

export const STATUS_META: Record<
  VerificationStatus,
  { label: string; short: string; description: string; varName: string }
> = {
  verified: {
    label: "Verified",
    short: "Verified",
    description:
      "Confirmed by a human (organiser or Council access officer) with a recorded source and date.",
    varName: "verified",
  },
  missing: {
    label: "Missing",
    short: "Missing",
    description:
      "No information is available. We show this openly rather than guessing.",
    varName: "missing",
  },
  requires_confirmation: {
    label: "Requires confirmation",
    short: "To confirm",
    description:
      "Unconfirmed or AI-suggested. Treat as unverified until a human approves it.",
    varName: "confirm",
  },
};

export function statusStyle(status: VerificationStatus): CSSProperties {
  const v = STATUS_META[status].varName;
  return {
    background: `var(--status-${v}-bg)`,
    color: `var(--status-${v}-fg)`,
    borderColor: `var(--status-${v}-border)`,
  };
}

export function statusFill(status: VerificationStatus): string {
  return `var(--status-${STATUS_META[status].varName}-border)`;
}

const DECAY_PERIOD_DAYS = 30;
const DECAY_STEP = 5;
const STALE_AFTER_DAYS = 90;

export function ageInDays(iso: string, now: Date = new Date()): number {
  const then = new Date(iso).getTime();
  return Math.max(0, Math.floor((now.getTime() - then) / 86_400_000));
}

export function decayedConfidence(
  baseConfidence: number,
  lastVerifiedAt: string,
  now: Date = new Date(),
): number {
  const periods = Math.floor(ageInDays(lastVerifiedAt, now) / DECAY_PERIOD_DAYS);
  return Math.max(20, Math.min(100, baseConfidence - periods * DECAY_STEP));
}

export function effectiveStatus(
  status: VerificationStatus,
  lastVerifiedAt: string,
  now: Date = new Date(),
): VerificationStatus {
  if (status !== "verified") return status;
  return ageInDays(lastVerifiedAt, now) > STALE_AFTER_DAYS
    ? "requires_confirmation"
    : "verified";
}

export function freshnessText(iso: string, now: Date = new Date()): string {
  const days = ageInDays(iso, now);
  if (days === 0) return "verified today";
  if (days === 1) return "verified yesterday";
  if (days < 30) return `verified ${days} days ago`;
  const months = Math.floor(days / 30);
  return `verified ${months} month${months > 1 ? "s" : ""} ago`;
}

export function statusOrder(status: VerificationStatus): number {
  return status === "verified" ? 0 : status === "requires_confirmation" ? 1 : 2;
}
