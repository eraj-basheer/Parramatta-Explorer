"use client";

import { useEffect, useState } from "react";
import { SpeakButton } from "./SpeakButton";

type Role = "attendee" | "organiser";

const COUNCIL_DOMAINS = ["cityofparramatta.nsw.gov.au"];
const DEMO_INVITE_CODE = "PARRA-2026";

export function SignInForm() {
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedRole, setSavedRole] = useState<Role | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = localStorage.getItem("pe-role");
        if (!cancelled && (r === "attendee" || r === "organiser")) setSavedRole(r);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function chooseAttendee() {
    setRole("attendee");
    setError(null);
    setResult(null);
  }

  function chooseOrganiser() {
    setRole("organiser");
    setError(null);
    setResult(null);
  }

  function continueAttendee() {
    try {
      localStorage.setItem("pe-role", "attendee");
    } catch {
      /* ignore */
    }
    setSavedRole("attendee");
    setResult("You're browsing as an attendee. No account is needed and nothing about your needs is stored.");
  }

  function submitOrganiser(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const domainOk = COUNCIL_DOMAINS.some((d) => email.trim().toLowerCase().endsWith(`@${d}`));
    const codeOk = inviteCode.trim().toUpperCase() === DEMO_INVITE_CODE;
    if (!domainOk && !codeOk) {
      setError(
        "We couldn't verify that email. Use your City of Parramatta work email, or an invite code from your Council events team. You can also ask to be verified manually.",
      );
      return;
    }
    try {
      localStorage.setItem("pe-role", "organiser");
    } catch {
      /* ignore */
    }
    setSavedRole("organiser");
    setResult(
      domainOk
        ? "Verification email sent to your Council address. Open it to finish signing in. (Demo: no email is actually sent.)"
        : "Invite code accepted. You're signed in as a Council organiser. (Demo only.)",
    );
  }

  function signOut() {
    try {
      localStorage.removeItem("pe-role");
    } catch {
      /* ignore */
    }
    setSavedRole(null);
    setRole(null);
    setResult(null);
  }

  return (
    <div className="space-y-8">
      {savedRole ? (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 p-4"
          style={{ borderColor: "var(--color-brand)" }}
        >
          <p>
            Signed in as <strong>{savedRole === "attendee" ? "attendee" : "Council organiser"}</strong>
            .
          </p>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border px-4 py-2 text-sm font-semibold"
            style={{ borderColor: "var(--border)" }}
          >
            Sign out
          </button>
        </div>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl font-bold">Who are you?</h2>
          <SpeakButton
            label="Listen to this section"
            text="Who are you? Choose attendee to browse and plan events without an account. Choose Council organiser to build and verify an event's access plan. Organisers are verified because their email address or invite code proves they work for the council."
          />
        </div>
        <p style={{ color: "var(--page-fg-soft)" }}>
          Attendees need no account. Organisers are verified because they publish official
          information.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={chooseAttendee}
            aria-pressed={role === "attendee"}
            className={`rounded-2xl border-2 p-5 text-left ${
              role === "attendee" ? "border-accent" : ""
            }`}
            style={role === "attendee" ? undefined : { borderColor: "var(--border)" }}
          >
            <span className="font-display text-lg font-bold">I&apos;m attending</span>
            <span className="mt-1 block text-sm" style={{ color: "var(--page-fg-soft)" }}>
              Browse events, view access plans, report problems and leave feedback. No account, no
              personal details.
            </span>
          </button>
          <button
            type="button"
            onClick={chooseOrganiser}
            aria-pressed={role === "organiser"}
            className={`rounded-2xl border-2 p-5 text-left ${
              role === "organiser" ? "border-accent" : ""
            }`}
            style={role === "organiser" ? undefined : { borderColor: "var(--border)" }}
          >
            <span className="font-display text-lg font-bold">I&apos;m a Council organiser</span>
            <span className="mt-1 block text-sm" style={{ color: "var(--page-fg-soft)" }}>
              Build, verify and publish an event&apos;s access plan.
            </span>
          </button>
        </div>
      </section>

      {role === "attendee" ? (
        <section className="space-y-3 rounded-2xl border-2 p-5" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-display text-lg font-bold">Browse as an attendee</h3>
          <p style={{ color: "var(--page-fg-soft)" }}>
            We don&apos;t ask for your name, email or any health information. If you choose a need
            profile, it stays on your device and is never uploaded or stored on a server.
          </p>
          <button
            type="button"
            onClick={continueAttendee}
            className="rounded-full bg-brand px-6 py-3 font-bold text-white"
          >
            Continue without an account
          </button>
        </section>
      ) : null}

      {role === "organiser" ? (
        <section className="space-y-3 rounded-2xl border-2 p-5" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-display text-lg font-bold">Verify you work for Council</h3>
          <p style={{ color: "var(--page-fg-soft)" }}>
            We verify you the same way most workplaces do — no documents, no invasive checks.
            Use your <strong>@cityofparramatta.nsw.gov.au</strong> work email and we send a one-time
            link, or enter an invite code from your events team. If neither works, a Council admin
            can verify you manually.
          </p>
          <form onSubmit={submitOrganiser} className="grid gap-3">
            <label className="text-sm">
              <span className="font-medium">Council work email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@cityofparramatta.nsw.gov.au"
                className="mt-1 w-full rounded-xl border px-3 py-2"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              />
            </label>
            <label className="text-sm">
              <span className="font-medium">Or an invite code (demo: PARRA-2026)</span>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Invite code"
                className="mt-1 w-full rounded-xl border px-3 py-2"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              />
            </label>
            <button
              type="submit"
              className="w-fit rounded-full bg-brand px-6 py-3 font-bold text-white"
            >
              Verify and sign in
            </button>
          </form>
        </section>
      ) : null}

      {result ? (
        <p role="status" className="rounded-xl bg-mint px-4 py-3 font-medium text-brand">
          {result}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="rounded-xl bg-accent px-4 py-3 font-medium text-white">
          {error}
        </p>
      ) : null}
    </div>
  );
}
