import Link from "next/link";
import { PARRAMATTA_EVENTS } from "@/lib/events";
import { ExploreView } from "@/components/ExploreView";
import { SpeakButton } from "@/components/SpeakButton";

export default function Home() {
  return (
    <div className="space-y-10">
      <section
        className="relative overflow-hidden rounded-3xl px-6 py-10 text-white sm:px-10"
        style={{ background: "var(--color-brand)" }}
      >
        <div aria-hidden="true" className="flex h-2">
          <div className="flex-1 bg-accent" />
          <div className="flex-1 bg-sun" />
          <div className="flex-1 bg-mint" />
          <div className="flex-1 bg-lav" />
          <div className="flex-1 bg-sky" />
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-mist">
              Events across Parramatta
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
              Find{" "}
              <span className="rounded-xl bg-accent px-3 text-white">what&apos;s on</span> in
              Parramatta.
            </h1>
            <p className="text-lg text-mist">
              Festivals, markets, gigs and free community events — with an accessible access plan
              for each one, so you can plan before you leave home.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/guide"
                className="rounded-full bg-sun px-6 py-3 font-bold text-brand hover:brightness-95"
              >
                How to use the app
              </Link>
              <Link
                href="/signin"
                className="rounded-full border border-mist px-6 py-3 font-semibold text-white hover:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          </div>
          <SpeakButton
            label="Listen to this page"
            className="text-white"
          />
        </div>
      </section>

      <ExploreView events={PARRAMATTA_EVENTS} />

      <section
        className="rounded-2xl p-6"
        style={{ background: "var(--surface-soft)" }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-xl font-bold">Built around what locals asked for</h2>
          <SpeakButton
            label="Listen to this section"
            text="Built around what locals asked for. The categories and event types here reflect what the community told the City of Parramatta it wants more of: free and family events, regular markets, riverside events, food, live music and cultural celebrations. See the About and data page for sources."
          />
        </div>
        <p className="mt-2" style={{ color: "var(--page-fg-soft)" }}>
          The categories reflect what the community told the City of Parramatta it wants more of:
          free and family events, regular markets, riverside events, food, live music and cultural
          celebrations. Event details come from public Council listings — always confirm with the
          organiser.
        </p>
      </section>
    </div>
  );
}
