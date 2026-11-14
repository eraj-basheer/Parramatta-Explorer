import type { Feature } from "@/lib/types";
import { ProvenanceLine, formatValue } from "./ProvenanceLine";
import { StatusBadge } from "./StatusBadge";
import { featureStatus } from "@/lib/status";

export function FeatureCard({
  feature,
  onReport,
}: {
  feature: Feature;
  onReport?: (featureId: string) => void;
}) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{feature.name}</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{feature.locationNote}</p>
        </div>
        <StatusBadge status={featureStatus(feature)} />
      </div>

      <dl className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800">
        {feature.attributes.map((attribute) => (
          <div key={attribute.key} className="py-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <dt className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {attribute.label}
                {attribute.aiSuggested ? (
                  <span className="ml-2 rounded bg-violet-100 px-1.5 py-0.5 text-xs font-medium text-violet-800 dark:bg-violet-950 dark:text-violet-200">
                    AI-suggested
                  </span>
                ) : null}
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
    </article>
  );
}
