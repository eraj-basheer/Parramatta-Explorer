"use client";

import { useEffect, useState } from "react";
import type { FeedbackRating } from "@/lib/types";

const OPTIONS: { id: FeedbackRating; label: string; mouth: string }[] = [
  { id: "happy", label: "Good", mouth: "M8 14c2 2.5 8 2.5 10 0" },
  { id: "neutral", label: "Okay", mouth: "M8 15h10" },
  { id: "sad", label: "Not good", mouth: "M8 17c2-2.5 8-2.5 10 0" },
];

function Face({ mouth }: { mouth: string }) {
  return (
    <svg viewBox="0 0 26 26" width="34" height="34" aria-hidden="true">
      <circle cx="13" cy="13" r="12" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="10" r="1.4" fill="currentColor" />
      <circle cx="17" cy="10" r="1.4" fill="currentColor" />
      <path d={mouth} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function EventFeedback({ eventId }: { eventId: string }) {
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState<{ total: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/feedback?eventId=${encodeURIComponent(eventId)}`)
      .then((r) => r.json())
      .then((d: { summary?: { total: number } }) => {
        if (!cancelled) setSummary(d.summary ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  async function submit() {
    if (!rating) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, rating, details }),
      });
      const data = (await res.json()) as { error?: string; message?: string; summary?: { total: number } };
      if (!res.ok) throw new Error(data.error ?? "Could not send your rating.");
      setStatus("sent");
      setMessage(data.message ?? "Thanks for your rating.");
      setSummary(data.summary ?? summary);
      setDetails("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not send your rating.");
    }
  }

  return (
    <div
      className="rounded-2xl border-2 p-5"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <h3 className="font-display text-lg font-bold">How was it?</h3>
      <p className="mt-1 text-sm" style={{ color: "var(--page-fg-soft)" }}>
        One tap is enough. This is anonymous and helps the next person know what to expect.
      </p>

      <div className="mt-4 flex flex-wrap gap-3" role="group" aria-label="Rate your visit">
        {OPTIONS.map((o) => {
          const active = rating === o.id;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={active}
              onClick={() => setRating(o.id)}
              className="flex w-28 flex-col items-center gap-1 rounded-2xl border-2 px-4 py-3 font-semibold"
              style={{
                borderColor: active ? "var(--color-accent)" : "var(--border)",
                color: active ? "var(--color-accent)" : "var(--page-fg)",
                background: "var(--surface)",
              }}
            >
              <Face mouth={o.mouth} />
              {o.label}
            </button>
          );
        })}
      </div>

      <label className="mt-4 block text-sm">
        <span className="font-medium">Anything else? (optional)</span>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
          maxLength={240}
          placeholder="Please don't include personal information."
          className="mt-1 w-full rounded-xl border px-3 py-2"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        />
      </label>

      <button
        type="button"
        onClick={submit}
        disabled={!rating || status === "sending"}
        className="mt-3 rounded-full bg-brand px-6 py-3 font-bold text-white disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send rating"}
      </button>

      {message ? (
        <p
          role="status"
          className="mt-3 rounded-xl px-3 py-2 text-sm font-medium"
          style={{
            background: status === "error" ? "var(--color-accent)" : "var(--color-mint)",
            color: status === "error" ? "#fff" : "var(--color-brand)",
          }}
        >
          {message}
        </p>
      ) : null}

      {summary ? (
        <p className="mt-3 text-xs" style={{ color: "var(--page-fg-soft)" }}>
          {summary.total} rating{summary.total === 1 ? "" : "s"} so far. No personal details stored.
        </p>
      ) : null}
    </div>
  );
}
