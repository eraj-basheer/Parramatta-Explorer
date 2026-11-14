"use client";

import { useEffect, useState } from "react";
import type { CommunityIssue, IssueState } from "@/lib/types";

const STATE_LABEL: Record<IssueState, string> = {
  still_there: "Still there",
  being_resolved: "Being resolved",
  resolved: "Resolved",
};

const STATE_COLOR: Record<IssueState, { bg: string; ink: string }> = {
  still_there: { bg: "var(--color-accent)", ink: "#ffffff" },
  being_resolved: { bg: "var(--color-sun)", ink: "var(--color-brand)" },
  resolved: { bg: "var(--color-mint)", ink: "var(--color-brand)" },
};

export function IssueList({
  eventId,
  refreshKey = 0,
}: {
  eventId?: string;
  refreshKey?: number;
}) {
  const [issues, setIssues] = useState<CommunityIssue[] | null>(null);
  const [flagged, setFlagged] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = eventId ? `/api/issues?eventId=${encodeURIComponent(eventId)}` : "/api/issues";
    fetch(url)
      .then((r) => r.json())
      .then((d: { issues?: CommunityIssue[] }) => {
        if (!cancelled) setIssues(d.issues ?? []);
      })
      .catch(() => {
        if (!cancelled) setIssues([]);
      });
    return () => {
      cancelled = true;
    };
  }, [eventId, refreshKey]);

  async function vote(id: string, state: IssueState) {
    const res = await fetch("/api/issues", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: state }),
    });
    if (!res.ok) return;
    const data = (await res.json()) as { issue?: CommunityIssue };
    if (data.issue) setIssues((prev) => (prev ?? []).map((i) => (i.id === id ? data.issue! : i)));
  }

  async function flag(id: string) {
    const res = await fetch("/api/issues", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "flag" }),
    });
    if (!res.ok) return;
    setFlagged(id);
    const data = (await res.json()) as { issue?: CommunityIssue };
    if (data.issue?.hidden) setIssues((prev) => (prev ?? []).filter((i) => i.id !== id));
  }

  if (issues === null) {
    return <p style={{ color: "var(--page-fg-soft)" }}>Loading community reports…</p>;
  }

  if (issues.length === 0) {
    return (
      <p className="rounded-2xl border-2 p-4" style={{ borderColor: "var(--border)" }}>
        No open reports for this event yet. If you spot a problem, you can be the first to add one.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {issues.map((issue) => (
        <li
          key={issue.id}
          className="rounded-2xl border-2 p-4"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-3 py-0.5 text-xs font-bold"
              style={{ background: STATE_COLOR[issue.state].bg, color: STATE_COLOR[issue.state].ink }}
            >
              {STATE_LABEL[issue.state]}
            </span>
            <span className="font-semibold">{issue.featureLabel}</span>
            <span className="text-sm" style={{ color: "var(--page-fg-soft)" }}>
              · {issue.issueType}
              {issue.issueOther ? `: ${issue.issueOther}` : ""}
            </span>
          </div>
          {issue.note ? <p className="mt-2 text-sm">{issue.note}</p> : null}
          <p className="mt-1 text-xs" style={{ color: "var(--page-fg-soft)" }}>
            {issue.eventTitle} · reported {new Date(issue.createdAt).toLocaleDateString("en-AU")}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Is it still there?</span>
            {(Object.keys(STATE_LABEL) as IssueState[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => vote(issue.id, s)}
                className="rounded-full border-2 px-3 py-1 text-sm font-semibold"
                style={{ borderColor: "var(--color-brand)" }}
              >
                {STATE_LABEL[s]} · {issue.counts[s]}
              </button>
            ))}
            <button
              type="button"
              onClick={() => flag(issue.id)}
              className="ml-auto text-xs underline"
              style={{ color: "var(--page-fg-soft)" }}
            >
              {flagged === issue.id ? "Reported" : "Report as inappropriate"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
