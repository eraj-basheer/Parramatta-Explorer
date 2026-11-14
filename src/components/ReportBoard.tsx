"use client";

import { useState } from "react";
import { PARRAMATTA_EVENTS } from "@/lib/events";
import { FEATURE_OPTIONS, ISSUE_TYPES } from "@/lib/reportOptions";
import { SpeakButton } from "./SpeakButton";
import { IssueList } from "./IssueList";

export function ReportBoard({
  initialEventId,
  initialFeatureId,
}: {
  initialEventId?: string;
  initialFeatureId?: string;
}) {
  const firstEvent = PARRAMATTA_EVENTS[0]?.id ?? "";
  const [eventId, setEventId] = useState(
    initialEventId && PARRAMATTA_EVENTS.some((e) => e.id === initialEventId)
      ? initialEventId
      : firstEvent,
  );
  const [featureId, setFeatureId] = useState(
    initialFeatureId && FEATURE_OPTIONS.some((f) => f.id === initialFeatureId)
      ? initialFeatureId
      : FEATURE_OPTIONS[0].id,
  );
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0]);
  const [issueOther, setIssueOther] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const isOther = issueType === "Other";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const eventTitle = PARRAMATTA_EVENTS.find((e) => e.id === eventId)?.title ?? eventId;
    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, eventTitle, featureId, issueType, issueOther, note }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not send the report.");
      setStatus("sent");
      setMessage(data.message ?? "Report received.");
      setNote("");
      setIssueOther("");
      setRefreshKey((k) => k + 1);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not send the report.");
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl font-bold">Report a problem</h2>
          <SpeakButton
            label="Listen to this section"
            text="Report a problem. First choose the event, then the feature, then the type of issue. If none of the issue types fit, choose Other and describe it. You can add an optional note. Your report is shown to other attendees, who can confirm whether it is still there, being resolved, or resolved."
          />
        </div>
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border-2 p-5"
          style={{ borderColor: "var(--border)" }}
        >
          <label className="block text-sm">
            <span className="font-semibold">1. Which event?</span>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              {PARRAMATTA_EVENTS.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-semibold">2. Which feature?</span>
            <select
              value={featureId}
              onChange={(e) => setFeatureId(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              {FEATURE_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-semibold">3. What is the issue?</span>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              {ISSUE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          {isOther ? (
            <label className="block text-sm">
              <span className="font-semibold">Describe the issue type</span>
              <input
                type="text"
                value={issueOther}
                onChange={(e) => setIssueOther(e.target.value)}
                maxLength={120}
                className="mt-1 w-full rounded-xl border px-3 py-2"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              />
            </label>
          ) : null}

          <label className="block text-sm">
            <span className="font-semibold">
              Anything to add? (optional — please don&apos;t include personal information)
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={240}
              className="mt-1 w-full rounded-xl border px-3 py-2"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            />
          </label>

          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-brand px-6 py-3 font-bold text-white disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Submit report"}
          </button>

          {message ? (
            <p
              role="status"
              className="rounded-xl px-3 py-2 text-sm font-medium"
              style={{
                background: status === "error" ? "var(--color-accent)" : "var(--color-mint)",
                color: status === "error" ? "#fff" : "var(--color-brand)",
              }}
            >
              {message}
            </p>
          ) : null}
        </form>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl font-bold">Community status</h2>
          <SpeakButton
            label="Listen to this section"
            text="Community status. Every report is shown to everyone. Instead of a moderator deciding, other attendees vote whether an issue is still there, being resolved, or resolved. The most-voted status is shown. Anyone can also flag a report as inappropriate, and a report is hidden automatically if several people flag it."
          />
        </div>
        <p style={{ color: "var(--page-fg-soft)" }}>
          No moderator decides. Attendees confirm what is true right now — the community keeps the
          information honest.
        </p>
        <IssueList eventId={eventId} refreshKey={refreshKey} />
      </section>
    </div>
  );
}
