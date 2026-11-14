"use client";

import { useSyncExternalStore, useState } from "react";
import type { Feature, NeedId, VerificationStatus } from "@/lib/types";
import { STATUS_META, statusFill, featureStatus } from "@/lib/status";
import { LiveMap } from "./LiveMap";

const STATUS_FILL: Record<VerificationStatus, string> = {
  verified: statusFill("verified"),
  missing: statusFill("missing"),
  requires_confirmation: statusFill("requires_confirmation"),
};

const LEGEND_ORDER: VerificationStatus[] = ["verified", "requires_confirmation", "missing"];

function subscribeOnline(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function SchematicMap({ points }: { points: Feature[] }) {
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
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="Offline schematic map of access features. The text list below gives the same information."
      className="h-64 w-full rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M10 0H0V10" fill="none" stroke="#d4d4d8" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#grid)" />
      {points.map((f) => {
        const { x, y } = toXY(f);
        const status = featureStatus(f);
        return (
          <g key={f.id}>
            <circle cx={x} cy={y} r={3.4} fill={STATUS_FILL[status]} opacity={0.95} />
            <circle cx={x} cy={y} r={3.4} fill="none" stroke="#ffffff" strokeWidth={0.7} />
          </g>
        );
      })}
    </svg>
  );
}

export function AccessMap({
  features,
  selectedNeeds,
}: {
  features: Feature[];
  selectedNeeds: NeedId[];
}) {
  const online = useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true,
  );
  const [mapFailed, setMapFailed] = useState(false);

  const visible = features.filter((f) => f.needs.some((n) => selectedNeeds.includes(n)));
  const points = visible.length ? visible : features;
  const showLive = online && !mapFailed;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Map of access features
        </h3>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {showLive ? "Live map · OpenStreetMap" : "Offline schematic · works without a signal"}
        </span>
      </div>

      {showLive ? (
        <LiveMap
          features={features}
          selectedNeeds={selectedNeeds}
          onFail={() => setMapFailed(true)}
        />
      ) : (
        <SchematicMap points={points} />
      )}

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-600 dark:text-zinc-400">
        {LEGEND_ORDER.map((status) => (
          <span key={status} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full border border-white"
              style={{ backgroundColor: STATUS_FILL[status] }}
            />
            {STATUS_META[status].label}
          </span>
        ))}
      </div>

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
