import type { Feature, NeedId, VerificationStatus } from "@/lib/types";
import { STATUS_META, statusFill } from "@/lib/status";

const STATUS_FILL: Record<VerificationStatus, string> = {
  verified: statusFill("verified"),
  missing: statusFill("missing"),
  requires_confirmation: statusFill("requires_confirmation"),
};

export function featureStatus(feature: Feature): VerificationStatus {
  if (feature.attributes.some((a) => a.status === "requires_confirmation"))
    return "requires_confirmation";
  if (feature.attributes.some((a) => a.status === "missing")) return "missing";
  return "verified";
}

export function AccessMap({
  features,
  selectedNeeds,
}: {
  features: Feature[];
  selectedNeeds: NeedId[];
}) {
  const visible = features.filter((f) => f.needs.some((n) => selectedNeeds.includes(n)));
  const points = visible.length ? visible : features;

  const lats = points.map((f) => f.geo.lat);
  const lngs = points.map((f) => f.geo.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const spanLat = maxLat - minLat || 0.001;
  const spanLng = maxLng - minLng || 0.001;

  function toXY(f: Feature) {
    const x = 8 + ((f.geo.lng - minLng) / spanLng) * 84;
    const y = 8 + (1 - (f.geo.lat - minLat) / spanLat) * 84;
    return { x, y };
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Schematic map (prototype)
        </h3>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Production path: MapLibre GL + OpenStreetMap
        </span>
      </div>

      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label="Schematic map of access features. The text list below gives the same information."
        className="h-64 w-full rounded-lg bg-zinc-50 dark:bg-zinc-950"
      >
        <rect x="0" y="0" width="100" height="100" fill="none" />
        {points.map((f) => {
          const { x, y } = toXY(f);
          const status = featureStatus(f);
          return (
            <g key={f.id}>
              <circle cx={x} cy={y} r={3} fill={STATUS_FILL[status]} opacity={0.9} />
              <circle cx={x} cy={y} r={3} fill="none" stroke="#ffffff" strokeWidth={0.6} />
            </g>
          );
        })}
      </svg>

      <ul className="mt-3 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
        {points.map((f) => {
          const status = featureStatus(f);
          return (
            <li key={f.id} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: STATUS_FILL[status] }}
              />
              <span className="font-medium">{f.name}</span>
              <span className="text-zinc-500 dark:text-zinc-400">
                — {STATUS_META[status].label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
