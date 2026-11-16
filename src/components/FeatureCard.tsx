"use client";

import { useState } from "react";
import type { Feature } from "@/lib/types";
import { ProvenanceLine, formatValue } from "./ProvenanceLine";
import { StatusBadge } from "./StatusBadge";
import { featureStatus, STATUS_META, statusFill } from "@/lib/status";

export function FeatureCard({
  feature,
  onReport,
}: {
  feature: Feature;
  onReport?: (featureId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const detailsId = `feature-details-${feature.id}`;

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{feature.name}</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{feature.locationNote}</p>
        </div>
        <StatusBadge status={featureStatus(feature)} />
      </div>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {feature.attributes.map((attribute) => (
          <li
            key={attribute.key}
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium"
            style={{ borderColor: "var(--border)", color: "var(--page-fg-soft)" }}
            title={`${attribute.label}: ${formatValue(attribute)} — ${STATUS_META[attribute.status].label}`}
          >
            <span aria-hidden="true" style={{ color: statusFill(attribute.status) }}>
              ●
            </span>
            {attribute.label}
          </li>
        ))}
      </ul>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={() => setOpen((v) => !v)}
        className="mt-3 inline-flex items-center gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        {open ? "Hide details" : "Click for more details"}
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div id={detailsId}>
          <dl className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800">
            {feature.attributes.map((attribute) => (
              <div key={attribute.key} className="py-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <dt className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {attribute.label}
                  </dt>
                  <dd className="flex items-center gap-2 text-sm text-zinc-900 dark:text-zinc-100">
                    {formatValue(attribute)}
                    <StatusBadge status={attribute.status} />
                  </dd>
                </div>
                <ProvenanceLine attribute={attribute} />
              </div>
            ))}
          </dl>

          {onReport ? (
            <button
              type="button"
              onClick={() => onReport(feature.id)}
              className="mt-3 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Report a problem with this
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
