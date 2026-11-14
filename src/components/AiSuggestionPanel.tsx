"use client";

import { useState } from "react";
import type { AttributeValue, RiskItem } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { formatValue } from "./ProvenanceLine";

type Decision = "approved" | "rejected";

export function AiSuggestionPanel() {
  const [loading, setLoading] = useState(false);
  const [attributes, setAttributes] = useState<AttributeValue[]>([]);
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [disclosure, setDisclosure] = useState("");
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  async function run() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = (await res.json()) as {
        attributes: AttributeValue[];
        risks: RiskItem[];
        disclosure: string;
      };
      setAttributes(data.attributes);
      setRisks(data.risks);
      setDisclosure(data.disclosure);
      setDecisions({});
    } finally {
      setLoading(false);
    }
  }

  function decide(key: string, decision: Decision) {
    setDecisions((prev) => ({ ...prev, [key]: decision }));
  }

  const total = attributes.length + risks.length;
  const decided = Object.keys(decisions).length;

  return (
    <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-4 dark:border-violet-900 dark:bg-violet-950/20">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">AI assist (human-approved)</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            AI drafts suggested attributes and risks. Nothing is published until you approve it.
          </p>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
        >
          {loading ? "Thinking…" : "Ask AI for suggestions"}
        </button>
      </div>

      {disclosure ? (
        <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-xs text-zinc-600 dark:bg-zinc-900/60 dark:text-zinc-300">
          {disclosure}
        </p>
      ) : null}

      {total > 0 ? (
        <>
          <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Reviewed {decided} of {total} suggestions
          </p>

          <ul className="mt-3 space-y-2">
            {attributes.map((a) => {
              const key = `attr-${a.key}`;
              return (
                <li
                  key={key}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="text-sm">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {a.label}: {formatValue(a)}
                    </span>
                    <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                      {a.provenance.sourceLabel}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <StatusBadge status={a.status} />
                    <DecisionButtons
                      value={decisions[key]}
                      onDecide={(d) => decide(key, d)}
                    />
                  </span>
                </li>
              );
            })}

            {risks.map((r) => {
              const key = `risk-${r.id}`;
              return (
                <li
                  key={key}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="text-sm">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      Risk: {r.description}
                    </span>
                  </span>
                  <DecisionButtons value={decisions[key]} onDecide={(d) => decide(key, d)} />
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
    </section>
  );
}

function DecisionButtons({
  value,
  onDecide,
}: {
  value?: Decision;
  onDecide: (d: Decision) => void;
}) {
  return (
    <span className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onDecide("approved")}
        aria-pressed={value === "approved"}
        className={`rounded-md border px-2 py-1 text-xs font-semibold ${
          value === "approved"
            ? "border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
            : "border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        }`}
      >
        Approve
      </button>
      <button
        type="button"
        onClick={() => onDecide("rejected")}
        aria-pressed={value === "rejected"}
        className={`rounded-md border px-2 py-1 text-xs font-semibold ${
          value === "rejected"
            ? "border-red-500 bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200"
            : "border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        }`}
      >
        Reject
      </button>
    </span>
  );
}
