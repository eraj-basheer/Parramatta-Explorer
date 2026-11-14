import type { CommunityIssue, EventFeedback, FeedbackRating, IssueState } from "./types";
import { screenText } from "./moderation";

const HIDE_AT_FLAGS = 3;

let issues: CommunityIssue[] = [
  {
    id: "iss-001",
    eventId: "diwali",
    eventTitle: "Diwali",
    featureId: "f-toilet-square",
    featureLabel: "Accessible toilet",
    issueType: "Feature not working",
    note: "Example report: the accessible toilet near the stage was locked during the evening.",
    createdAt: "2026-11-01T02:00:00.000Z",
    state: "still_there",
    counts: { still_there: 4, being_resolved: 1, resolved: 0 },
    flags: 0,
    hidden: false,
  },
  {
    id: "iss-002",
    eventId: "parramatta-lanes",
    eventTitle: "Parramatta Lanes",
    featureId: "f-curb-church",
    featureLabel: "Crossing / curb cut",
    issueType: "Path blocked",
    note: "Example report: a stall blocked the kerb ramp on Church Street for about an hour.",
    createdAt: "2026-10-20T09:00:00.000Z",
    state: "resolved",
    counts: { still_there: 1, being_resolved: 2, resolved: 5 },
    flags: 0,
    hidden: false,
  },
];

let feedback: EventFeedback[] = [];

function recount(counts: Record<IssueState, number>): IssueState {
  const entries = Object.entries(counts) as [IssueState, number][];
  return entries.reduce((best, cur) => (cur[1] > best[1] ? cur : best))[0];
}

export function listIssues(eventId?: string): CommunityIssue[] {
  return issues
    .filter((i) => !i.hidden && (!eventId || i.eventId === eventId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addIssue(input: {
  eventId: string;
  eventTitle: string;
  featureId: string;
  featureLabel: string;
  issueType: string;
  issueOther?: string;
  note: string;
}):
  | { ok: true; issue: CommunityIssue }
  | { ok: false; error: string } {
  let issueOther = input.issueOther?.trim();
  if (input.issueType === "Other") {
    if (!issueOther) return { ok: false, error: "Please describe the issue type." };
    const screened = screenText(issueOther);
    if (!screened.ok) return { ok: false, error: screened.reason ?? "Text not allowed." };
    issueOther = screened.text;
  }

  const note = screenText(input.note);
  if (!note.ok) return { ok: false, error: note.reason ?? "Text not allowed." };

  const issue: CommunityIssue = {
    id: `iss-${Date.now().toString(36)}`,
    eventId: input.eventId,
    eventTitle: input.eventTitle,
    featureId: input.featureId,
    featureLabel: input.featureLabel,
    issueType: input.issueType,
    issueOther,
    note: note.text,
    createdAt: new Date().toISOString(),
    state: "still_there",
    counts: { still_there: 1, being_resolved: 0, resolved: 0 },
    flags: 0,
    hidden: false,
  };
  issues = [issue, ...issues];
  return { ok: true, issue };
}

export function voteIssue(id: string, state: IssueState): CommunityIssue | undefined {
  issues = issues.map((i) => {
    if (i.id !== id) return i;
    const counts = { ...i.counts, [state]: i.counts[state] + 1 };
    return { ...i, counts, state: recount(counts) };
  });
  return issues.find((i) => i.id === id);
}

export function flagIssue(id: string): CommunityIssue | undefined {
  issues = issues.map((i) => {
    if (i.id !== id) return i;
    const flags = i.flags + 1;
    return { ...i, flags, hidden: flags >= HIDE_AT_FLAGS };
  });
  return issues.find((i) => i.id === id);
}

export function addFeedback(input: {
  eventId: string;
  rating: FeedbackRating;
  details: string;
}): EventFeedback {
  const screened = screenText(input.details);
  const entry: EventFeedback = {
    id: `fb-${Date.now().toString(36)}`,
    eventId: input.eventId,
    rating: input.rating,
    details: screened.ok ? screened.text : "",
    createdAt: new Date().toISOString(),
  };
  feedback = [entry, ...feedback];
  return entry;
}

export function listFeedback(eventId?: string): EventFeedback[] {
  return feedback.filter((f) => !eventId || f.eventId === eventId);
}

export function feedbackSummary(eventId?: string) {
  const all = listFeedback(eventId);
  return {
    total: all.length,
    happy: all.filter((f) => f.rating === "happy").length,
    neutral: all.filter((f) => f.rating === "neutral").length,
    sad: all.filter((f) => f.rating === "sad").length,
  };
}
