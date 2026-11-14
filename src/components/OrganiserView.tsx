"use client";

import { useState } from "react";
import Link from "next/link";
import type { AccessPlan } from "@/lib/types";
import { ChecklistBoard } from "./ChecklistBoard";
import { AiSuggestionPanel } from "./AiSuggestionPanel";
import { RiskRegister } from "./RiskRegister";
import { Disclaimer } from "./Disclaimer";
import { SpeakButton } from "./SpeakButton";

export function OrganiserView({ plan }: { plan: AccessPlan }) {
  const [published, setPublished] = useState(false);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-brand px-2.5 py-0.5 font-semibold text-white">
            Organiser workspace
          </span>
          {plan.event.hypothetical ? (
            <span
              className="rounded-full px-2.5 py-0.5 font-semibold"
              style={{ background: "var(--surface-soft)", color: "var(--page-fg-soft)" }}
            >
              Hypothetical test event
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold">
            Readiness check: {plan.event.title}
          </h1>
          <SpeakButton />
        </div>
        <p style={{ color: "var(--page-fg-soft)" }}>
          Build the verified access &amp; inclusion plan. AI suggests; you decide.
        </p>
        <Disclaimer />
      </header>

      <ChecklistBoard items={plan.checklist} />
      <AiSuggestionPanel />
      <RiskRegister risks={plan.risks} />

      <section className="rounded-2xl border-2 p-4" style={{ borderColor: "var(--border)" }}>
        <h3 className="font-display text-lg font-bold">Publish the plan</h3>
        <p className="mt-1 text-sm" style={{ color: "var(--page-fg-soft)" }}>
          Publishing records who approved each field and stamps a last-verified date. Unconfirmed
          fields stay labelled as such.
        </p>
        <button
          type="button"
          onClick={() => setPublished(true)}
          className="mt-3 rounded-full bg-brand px-6 py-3 font-bold text-white"
        >
          Publish verified plan
        </button>
        {published ? (
          <p role="status" className="mt-3 text-sm font-medium" style={{ color: "var(--color-brand)" }}>
            Published (demo). A change is written to the append-only verification history and the
            attendee plan updates.
          </p>
        ) : null}
      </section>

      <p className="text-sm">
        <Link href={`/plan/${plan.event.id}`} className="underline">
          View the attendee access plan →
        </Link>
      </p>
    </div>
  );
}
