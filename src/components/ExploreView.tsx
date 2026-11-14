"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EVENT_CATEGORIES, type ParraEvent } from "@/lib/events";
import { SpeakButton } from "./SpeakButton";

export function ExploreView({ events }: { events: ParraEvent[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const okCat = cat === "All" || e.categories.includes(cat);
      const haystack = `${e.title} ${e.categories.join(" ")} ${e.blurb}`.toLowerCase();
      const okText = q === "" || haystack.includes(q);
      return okCat && okText;
    });
  }, [events, query, cat]);

  function reset() {
    setQuery("");
    setCat("All");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h2 className="font-display text-3xl font-bold">Search what&apos;s on</h2>
          <p style={{ color: "var(--page-fg-soft)" }}>
            Real events across Parramatta. Filter, then open an event to see its access plan.
          </p>
        </div>
        <SpeakButton
          label="Listen to this section"
          text="Search what's on. Real events across Parramatta. Use the search box and the category buttons to narrow the list. Each result links to that event's access plan."
        />
      </div>

      <div
        className="flex items-center gap-3 rounded-full border-2 px-5 py-1.5"
        style={{ background: "var(--surface-soft)", borderColor: "var(--color-brand)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <label htmlFor="q" className="sr-only">
          Search events
        </label>
        <input
          id="q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events, e.g. market, music, kids"
          className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none"
          style={{ color: "var(--page-fg)" }}
        />
        <button
          type="button"
          onClick={() => setQuery("")}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
        {EVENT_CATEGORIES.map((c) => {
          const active = cat === c.label;
          return (
            <button
              key={c.label}
              type="button"
              aria-pressed={active}
              onClick={() => setCat(c.label)}
              className="rounded-full border-2 px-4 py-1.5 text-sm font-bold"
              style={{
                background: active ? "#034f84" : c.bg,
                color: active ? "#ffffff" : c.ink,
                borderColor: "#034f84",
              }}
            >
              {c.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={reset}
          className="rounded-full border-2 px-4 py-1.5 text-sm font-bold"
          style={{ borderColor: "var(--color-brand)", background: "var(--surface)" }}
        >
          Reset filters
        </button>
      </div>

      <p aria-live="polite" className="font-semibold">
        Showing {shown.length} of {events.length} events
      </p>

      {shown.length === 0 ? (
        <div className="rounded-2xl p-8" style={{ background: "var(--surface-soft)" }}>
          <h3 className="font-display text-xl font-bold">No events match.</h3>
          <p className="mt-1">Try a different search or pick another category.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 rounded-full bg-accent px-6 py-3 font-bold text-white"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((e) => (
            <Link
              key={e.id}
              href={`/plan/${e.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border-2 transition-transform hover:-translate-y-1"
              style={{ borderColor: "var(--surface-soft)", background: "var(--surface)" }}
            >
              <div
                className="flex items-start justify-between gap-2 p-4"
                style={{ background: e.color, color: "#034f84" }}
              >
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold">
                  {e.categories.slice(0, 2).join(" / ")}
                </span>
                <span className="rounded-full bg-brand px-3 py-0.5 text-xs font-bold text-white">
                  {e.price === 0 ? "Free" : `$${e.price}`}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <h3 className="font-display text-lg font-bold">{e.title}</h3>
                <p className="text-sm" style={{ color: "var(--page-fg-soft)" }}>
                  {e.when}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--page-fg-soft)" }}>
                  {e.blurb}
                </p>
                <span className="mt-3 text-sm font-bold text-accent group-hover:underline">
                  View access plan →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
