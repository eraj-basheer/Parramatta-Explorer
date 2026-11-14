import { decayedConfidence, effectiveStatus, freshnessText } from "@/lib/status";
import type { AttributeValue } from "@/lib/types";

export function formatValue(attribute: AttributeValue): string {
  const { value, unit } = attribute;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return unit ? `${value} ${unit}` : String(value);
  return unit ? `${value} ${unit}` : String(value);
}

export function ProvenanceLine({ attribute }: { attribute: AttributeValue }) {
  const { provenance } = attribute;
  const eff = effectiveStatus(attribute.status, provenance.lastVerifiedAt);
  const confidence = decayedConfidence(provenance.confidence, provenance.lastVerifiedAt);
  const downgraded = eff !== attribute.status;

  return (
    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
      Source: {provenance.sourceLabel} · {freshnessText(provenance.lastVerifiedAt)} · confidence{" "}
      {confidence}%
      {downgraded ? " · downgraded (stale)" : ""}
    </p>
  );
}
