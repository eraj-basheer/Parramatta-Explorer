import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";

export const metadata = { title: "How to use" };

const STEPS: { title: string; body: string }[] = [
  {
    title: "1. Explore what's on",
    body: "On the home page, search for events or filter by category, price and distance. Every event is real and comes from public City of Parramatta listings.",
  },
  {
    title: "2. Open an access plan",
    body: "Pick an event to open its Access & Inclusion Plan. You choose your needs, and the plan shows the features that matter to you.",
  },
  {
    title: "3. Before you leave",
    body: "Check the map and each feature card. Green means verified, amber means still needs checking, red means missing. Save the plan to use offline.",
  },
  {
    title: "4. During the event",
    body: "The during section works without a signal. It shows the map and nearest facilities, and lets you report a problem on the spot.",
  },
  {
    title: "5. After the event",
    body: "Rate how it went with one tap — good, okay or not good. It's anonymous and helps the next person.",
  },
];

export default function GuidePage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold">How to use Parramatta Explorer</h1>
          <SpeakButton />
        </div>
        <p style={{ color: "var(--page-fg-soft)" }}>
          A quick tour. You can listen to any section with the speaker button, and change colours,
          contrast and text size in{" "}
          <Link href="/settings" className="underline">
            Settings
          </Link>
          .
        </p>
      </header>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl font-bold">For attendees</h2>
          <SpeakButton
            label="Listen to this section"
            text="For attendees. You never need an account. Explore events, open an access plan, pick your needs, and use the before, during and after sections. Your needs are only kept in your browser and are never uploaded."
          />
        </div>
        <ol className="space-y-3">
          {STEPS.map((s) => (
            <li
              key={s.title}
              className="rounded-2xl border-2 p-4"
              style={{ borderColor: "var(--border)" }}
            >
              <h3 className="font-display font-bold">{s.title}</h3>
              <p className="mt-1 text-sm" style={{ color: "var(--page-fg-soft)" }}>
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl font-bold">For Council organisers</h2>
          <SpeakButton
            label="Listen to this section"
            text="For Council organisers. Sign in with your council work email or an invite code. You get a readiness checklist, AI suggestions you must approve yourself, and a risk register. Nothing is published as fact until a person approves it, and publishing records who approved each field."
          />
        </div>
        <p style={{ color: "var(--page-fg-soft)" }}>
          Sign in with your Council work email or an invite code. You get a readiness checklist,
          AI suggestions that you must approve yourself, and a risk register. Nothing is published
          as fact until a person approves it.
        </p>
        <p>
          <Link href="/signin" className="font-semibold underline">
            Go to sign in →
          </Link>
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl font-bold">Accessibility features</h2>
          <SpeakButton
            label="Listen to this section"
            text="Accessibility features. Read aloud on every page and section. Light and dark mode. Colourblind-friendly palettes. Bigger text sizes. Offline maps during an event. A text version of every map. And a one-tap rating after an event."
          />
        </div>
        <ul className="list-disc space-y-1 pl-5" style={{ color: "var(--page-fg-soft)" }}>
          <li>Read aloud on every page and every section</li>
          <li>Light and dark mode</li>
          <li>Colourblind-friendly status palettes (protan, deuteran, tritan and monochrome)</li>
          <li>Larger text sizes</li>
          <li>Offline map and plan during an event</li>
          <li>A plain-text list version of every map</li>
          <li>One-tap feedback after an event</li>
        </ul>
      </section>
    </div>
  );
}
