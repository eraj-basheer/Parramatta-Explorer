"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AccessPlan, NeedId } from "@/lib/types";
import { NeedSelector } from "./NeedSelector";
import { AccessMap } from "./AccessMap";
import { FeatureCard } from "./FeatureCard";
import { StatusBadge } from "./StatusBadge";
import { Disclaimer } from "./Disclaimer";
import { SpeakButton } from "./SpeakButton";
import { EventFeedback } from "./EventFeedback";
import { featureStatus } from "@/lib/status";

type Tab = "before" | "during" | "after";

const TABS: { id: Tab; label: string; hint: string; color: string; fg: string }[] = [
  {
    id: "before",
    label: "Before you leave",
    hint: "Plan at home",
    color: "var(--color-brand)",
    fg: "#ffffff",
  },
  {
    id: "during",
    label: "During the event",
    hint: "On site, works offline",
    color: "var(--color-mint)",
    fg: "var(--color-brand)",
  },
  {
    id: "after",
    label: "After",
    hint: "Help the next person",
    color: "var(--color-lav)",
    fg: "var(--color-brand)",
  },
];

function dateLabel(plan: AccessPlan): string {
  if (plan.event.when) return plan.event.when;
  if (plan.event.start) {
    return new Date(plan.event.start).toLocaleDateString("en-AU", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }
  return "See organiser for dates";
}

export function PlanView({ plan }: { plan: AccessPlan }) {
  const router = useRouter();
  const [selected, setSelected] = useState<NeedId[]>(["mobility"]);
  const [tab, setTab] = useState<Tab>("before");
  const [saved, setSaved] = useState(false);

  const visibleFeatures = useMemo(
    () => plan.features.filter((f) => f.needs.some((n) => selected.includes(n))),
    [plan.features, selected],
  );

  const fullyVerified = useMemo(
    () => visibleFeatures.filter((f) => featureStatus(f) === "verified").length,
    [visibleFeatures],
  );

  const counts = useMemo(() => {
    const all = visibleFeatures.flatMap((f) => f.attributes);
    return {
      verified: all.filter((a) => a.status === "verified").length,
      missing: all.filter((a) => a.status === "missing").length,
      requires_confirmation: all.filter((a) => a.status === "requires_confirmation").length,
    };
  }, [visibleFeatures]);

  function reportFeature(featureId: string) {
    router.push(`/report?event=${encodeURIComponent(plan.event.id)}&feature=${encodeURIComponent(featureId)}`);
  }

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-brand px-2.5 py-0.5 font-semibold text-white">
            Access &amp; Inclusion Plan
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
          <h1 className="font-display text-3xl font-bold">{plan.event.title}</h1>
          <SpeakButton />
        </div>
        <p style={{ color: "var(--page-fg-soft)" }}>
          {plan.venue.name} · {dateLabel(plan)}
        </p>
        <Disclaimer />
      </header>

      <section className="rounded-2xl border-2 p-4" style={{ borderColor: "var(--border)" }}>
        <h2 className="font-display text-lg font-bold">At a glance</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          <span className="inline-flex items-center gap-2 text-sm">
            <StatusBadge status="verified" /> {counts.verified}
          </span>
          <span className="inline-flex items-center gap-2 text-sm">
            <StatusBadge status="requires_confirmation" /> {counts.requires_confirmation}
          </span>
          <span className="inline-flex items-center gap-2 text-sm">
            <StatusBadge status="missing" /> {counts.missing}
          </span>
        </div>
        <p className="mt-3 text-sm" style={{ color: "var(--page-fg-soft)" }}>
          Confirmed, missing, or still to check — we never guess.
        </p>
      </section>

      <NeedSelector selected={selected} onChange={setSelected} />

      <section className="space-y-2">
        <h2 className="font-display text-lg font-bold">Your visit, step by step</h2>
        <div role="tablist" aria-label="Journey stage" className="grid gap-3 sm:grid-cols-3">
          {TABS.map((t, index) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={active}
                aria-controls={`panel-${t.id}`}
                onClick={() => setTab(t.id)}
                className="flex flex-col gap-1.5 rounded-2xl border-2 px-5 py-4 text-left transition-all hover:-translate-y-0.5"
                style={{
                  borderColor: t.color,
                  background: active ? t.color : "var(--surface)",
                  color: active ? t.fg : "var(--page-fg)",
                  boxShadow: active ? "0 10px 24px -12px rgba(3,79,132,0.65)" : undefined,
                }}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base font-bold"
                    aria-hidden="true"
                    style={{
                      background: active ? t.fg : t.color,
                      color: active ? t.color : t.fg,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span className="font-display text-lg font-bold">{t.label}</span>
                </span>
                <span className="text-sm" style={{ color: active ? t.fg : "var(--page-fg-soft)" }}>
                  {t.hint}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="space-y-4">
        {tab === "before" ? (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <SpeakButton
                label="Listen to this section"
                text="Before you leave. A map of the access features, a button to save the plan for offline use, and a card for each feature showing whether it is verified, needs checking, or is missing."
              />
            </div>
            <AccessMap features={plan.features} selectedNeeds={selected} />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setSaved(true)}
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
              >
                {saved ? "Saved for offline ✓" : "Save this plan for offline"}
              </button>
              <span className="text-sm" style={{ color: "var(--page-fg-soft)" }}>
                {saved
                  ? "This plan and its map data are cached on your device."
                  : "Works without a signal — the venue is where the network is not."}
              </span>
            </div>
            {visibleFeatures.length ? (
              <p className="text-sm font-semibold" style={{ color: "var(--page-fg-soft)" }}>
                {fullyVerified} of {visibleFeatures.length} feature
                {visibleFeatures.length === 1 ? "" : "s"} fully verified
              </p>
            ) : null}
            <div className="grid gap-4">
              {visibleFeatures.length ? (
                visibleFeatures.map((f) => (
                  <FeatureCard key={f.id} feature={f} onReport={reportFeature} />
                ))
              ) : (
                <p className="text-sm" style={{ color: "var(--page-fg-soft)" }}>
                  Select a need above to see relevant features.
                </p>
              )}
            </div>
          </>
        ) : null}

        {tab === "during" ? (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <SpeakButton
                label="Listen to this section"
                text="During the event. This section works offline. It shows the map and the nearest facilities such as accessible toilets, quiet spaces, entrances and lifts. You can report a problem from here."
              />
            </div>
            <AccessMap features={plan.features} selectedNeeds={selected} />
            <div className="rounded-2xl border-2 p-4" style={{ borderColor: "var(--border)" }}>
              <h3 className="font-display text-lg font-bold">Nearest facilities right now</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {visibleFeatures
                  .filter((f) => ["toilet", "quiet_space", "entrance", "lift"].includes(f.type))
                  .map((f) => (
                    <li key={f.id}>
                      <span className="font-medium">{f.name}</span> — {f.locationNote}
                    </li>
                  ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => router.push(`/report?event=${encodeURIComponent(plan.event.id)}`)}
              className="rounded-full bg-accent px-6 py-3 font-bold text-white"
            >
              Report a problem
            </button>
          </>
        ) : null}

        {tab === "after" ? (
          <EventFeedback eventId={plan.event.id} />
        ) : null}
      </section>
    </div>
  );
}
