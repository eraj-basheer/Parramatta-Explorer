"use client";

import { useState } from "react";
import type { RiskItem } from "@/lib/types";

function rating(likelihood: number, consequence: number): "High" | "Medium" | "Low" {
  const score = likelihood * consequence;
  if (score >= 15) return "High";
  if (score >= 8) return "Medium";
  return "Low";
}

const RATING_CLASS: Record<string, string> = {
  High: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200",
  Medium: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  Low: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
};

export function RiskRegister({ risks }: { risks: RiskItem[] }) {
  const [items, setItems] = useState<RiskItem[]>(risks);

  function decide(id: string, status: RiskItem["status"]) {
    setItems((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              approvedBy: status === "approved" ? "Event organiser (demo)" : null,
            }
          : r,
      ),
    );
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
        Risk register (PS-09)
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        AI may suggest risks, but a human event planner must review and approve them.
      </p>

      <ul className="mt-4 space-y-3">
        {items.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {r.description}
              </p>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${RATING_CLASS[rating(r.likelihood, r.consequence)]}`}
              >
                {rating(r.likelihood, r.consequence)} (L{r.likelihood} × C{r.consequence})
              </span>
            </div>
            <dl className="mt-2 grid gap-1 text-xs text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-zinc-700 dark:text-zinc-300">Control</dt>
                <dd>{r.control}</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-700 dark:text-zinc-300">Responsible role</dt>
                <dd>{r.responsibleRole}</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-700 dark:text-zinc-300">Escalation trigger</dt>
                <dd>{r.escalationTrigger}</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-700 dark:text-zinc-300">Residual risk</dt>
                <dd>{r.residualRisk}</dd>
              </div>
            </dl>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => decide(r.id, "approved")}
                className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${
                  r.status === "approved"
                    ? "border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                    : "border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                }`}
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => decide(r.id, "rejected")}
                className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${
                  r.status === "rejected"
                    ? "border-red-500 bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200"
                    : "border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                }`}
              >
                Reject
              </button>
              {r.approvedBy ? (
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Approved by {r.approvedBy}
                </span>
              ) : null}
              {r.aiSuggested ? (
                <span className="rounded bg-violet-100 px-1.5 py-0.5 text-xs font-medium text-violet-800 dark:bg-violet-950 dark:text-violet-200">
                  AI-suggested
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
