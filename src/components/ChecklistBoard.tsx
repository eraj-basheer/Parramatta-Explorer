"use client";

import { useMemo, useState } from "react";
import type { ChecklistItem, VerificationStatus } from "@/lib/types";
import { getNeed } from "@/lib/needs";
import { STATUS_META } from "@/lib/status";
import { StatusBadge } from "./StatusBadge";

const OPTIONS: VerificationStatus[] = ["verified", "requires_confirmation", "missing"];

export function ChecklistBoard({ items }: { items: ChecklistItem[] }) {
  const [statuses, setStatuses] = useState<Record<string, VerificationStatus>>(
    Object.fromEntries(items.map((i) => [i.id, i.status])),
  );

  const grouped = useMemo(() => {
    const map = new Map<string, ChecklistItem[]>();
    for (const item of items) {
      const list = map.get(item.need) ?? [];
      list.push(item);
      map.set(item.need, list);
    }
    return [...map.entries()];
  }, [items]);

  const verified = items.filter((i) => statuses[i.id] === "verified").length;
  const score = Math.round((verified / items.length) * 100);

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Readiness checklist
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Test the plan against mobility, sensory, cognitive, language, cultural, family and
            digital-access needs.
          </p>
        </div>
        <span className="rounded-full bg-zinc-900 px-3 py-1 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900">
          {score}% verified
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {grouped.map(([needId, list]) => {
          const need = getNeed(needId);
          return (
            <div key={needId}>
              <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {need?.label ?? needId}
              </h4>
              <ul className="mt-2 space-y-2">
                {list.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                  >
                    <span className="text-sm text-zinc-800 dark:text-zinc-200">
                      {item.prompt}
                      {item.note ? (
                        <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                          {item.note}
                        </span>
                      ) : null}
                    </span>
                    <span className="flex items-center gap-2">
                      <StatusBadge status={statuses[item.id]} />
                      <label className="text-xs">
                        <span className="sr-only">Set status for {item.prompt}</span>
                        <select
                          value={statuses[item.id]}
                          onChange={(e) =>
                            setStatuses((prev) => ({
                              ...prev,
                              [item.id]: e.target.value as VerificationStatus,
                            }))
                          }
                          className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-950"
                        >
                          {OPTIONS.map((o) => (
                            <option key={o} value={o}>
                              {STATUS_META[o].label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
