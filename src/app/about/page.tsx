import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { SpeakButton } from "@/components/SpeakButton";

export const metadata = { title: "About & data" };

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold">About &amp; data</h1>
          <SpeakButton />
        </div>
        <p style={{ color: "var(--page-fg-soft)" }}>
          How Parramatta Explorer works, where the data comes from, and how to add more. Full
          detail lives in the{" "}
          <code className="rounded px-1.5 py-0.5 text-sm" style={{ background: "var(--surface-soft)" }}>
            docs/
          </code>{" "}
          folder of this project.
        </p>
      </header>

      <Disclaimer />

      <section className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-xl font-bold">Datasets used</h2>
          <SpeakButton
            label="Listen to this section"
            text="Datasets used. Event listings come from public City of Parramatta pages and the Major Events and Festivals Strategy 2025 to 2030. Map and venue geometry come from OpenStreetMap under ODbL. Transport stops come from Transport for NSW Open Data. Any sample attendance numbers are clearly labelled synthetic. Community reports are created by participants."
          />
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--page-fg-soft)" }}>
          <li>
            <strong>Event listings</strong> — public City of Parramatta event pages and the Major
            Events and Festivals Strategy 2025–2030. Attribution required.
          </li>
          <li>
            <strong>Venue and map geometry</strong> — OpenStreetMap, licensed ODbL. Attribution
            required.
          </li>
          <li>
            <strong>Transport</strong> — Transport for NSW Open Data (stops, wheelchair boarding).
          </li>
          <li>
            <strong>Access features</strong> — Council records where available; otherwise clearly
            marked as “requires confirmation”.
          </li>
          <li>
            <strong>Community reports</strong> — created by participants; confirmed by other
            attendees rather than a moderator.
          </li>
        </ul>
        <p className="text-sm" style={{ color: "var(--page-fg-soft)" }}>
          Every fact carries a source, a last-verified date and a status. Nothing is shown as fact
          unless a person has verified it.
        </p>
      </section>

      <section className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-xl font-bold">How to add map data</h2>
          <SpeakButton
            label="Listen to this section"
            text="How to add map data. Add a venue with its latitude and longitude. Add each access feature with its own coordinates, the needs it serves, and attributes with a source and a verification status. The schematic map is a prototype. In production the same data drives MapLibre GL with OpenStreetMap tiles."
          />
        </div>
        <ol className="list-decimal space-y-1 pl-5 text-sm" style={{ color: "var(--page-fg-soft)" }}>
          <li>
            Add the venue to{" "}
            <code className="rounded px-1" style={{ background: "var(--surface-soft)" }}>
              src/lib/data/seed.ts
            </code>{" "}
            with a name, address and <code>geo</code> latitude/longitude.
          </li>
          <li>
            Add each access feature with its own <code>geo</code>, the <code>needs</code> it serves,
            and <code>attributes</code> — each with a <code>source</code> and a{" "}
            <code>status</code> (verified, requires confirmation, or missing).
          </li>
          <li>
            Keep the plain-text list in sync so every map has a non-visual equivalent.
          </li>
          <li>
            For production, the same data drives <strong>MapLibre GL</strong> over OpenStreetMap
            vector tiles; the schematic SVG here is a prototype stand-in.
          </li>
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold">Responsible AI</h2>
        <p className="text-sm" style={{ color: "var(--page-fg-soft)" }}>
          AI helps turn messy text into structured access attributes, retrieve requirements from
          approved Council documents, and draft a risk register. Every AI output is labelled{" "}
          <strong>“AI-suggested — requires human confirmation”</strong> and cannot be published
          without an approver recorded. AI never makes a consequential decision autonomously, and
          any output can be removed, corrected, suspended and reviewed.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold">Privacy</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--page-fg-soft)" }}>
          <li>
            <strong>Attendees:</strong> no name, email, health or disability information is
            collected. Any need profile stays in your browser.
          </li>
          <li>
            <strong>Organisers:</strong> verified by a work-email link or invite code — no identity
            documents.
          </li>
          <li>
            <strong>Reports:</strong> notes are screened to remove personal information and abusive
            language before they appear.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold">Council boundary</h2>
        <p className="text-sm" style={{ color: "var(--page-fg-soft)" }}>
          <strong>Partner:</strong> Council hosts the readiness workflow and owns verified data.{" "}
          <strong>Facilitate:</strong> distribute the plan through existing event channels.{" "}
          <strong>Advocate:</strong> for access conditions Council does not control (station lifts,
          private venues), the tool produces an advocacy brief for the relevant operator.
        </p>
      </section>

      <p className="text-sm">
        <Link href="/" className="underline">
          ← Back to explore
        </Link>
      </p>
    </div>
  );
}
