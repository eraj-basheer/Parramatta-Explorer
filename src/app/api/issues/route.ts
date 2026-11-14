import { addIssue, flagIssue, listIssues, voteIssue } from "@/lib/community";
import { rateLimit } from "@/lib/moderation";
import { FEATURE_OPTIONS, ISSUE_TYPES } from "@/lib/reportOptions";
import type { IssueState } from "@/lib/types";

const STATES: IssueState[] = ["still_there", "being_resolved", "resolved"];

function clientKey(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "local";
}

export async function GET(request: Request) {
  const eventId = new URL(request.url).searchParams.get("eventId") ?? undefined;
  return Response.json({ issues: listIssues(eventId ?? undefined) });
}

export async function POST(request: Request) {
  if (!rateLimit(`issue:${clientKey(request)}`, 5, 60 * 60 * 1000)) {
    return Response.json(
      { error: "Too many reports from this device. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = (body ?? {}) as {
    eventId?: string;
    eventTitle?: string;
    featureId?: string;
    featureLabel?: string;
    issueType?: string;
    issueOther?: string;
    note?: string;
  };

  if (!input.eventId || !input.featureId || !input.issueType) {
    return Response.json(
      { error: "eventId, featureId and issueType are required" },
      { status: 400 },
    );
  }
  if (!ISSUE_TYPES.includes(input.issueType)) {
    return Response.json({ error: "Unknown issue type" }, { status: 400 });
  }
  const feature = FEATURE_OPTIONS.find((f) => f.id === input.featureId);
  if (!feature) {
    return Response.json({ error: "Unknown feature" }, { status: 400 });
  }

  const result = addIssue({
    eventId: input.eventId,
    eventTitle: input.eventTitle ?? input.eventId,
    featureId: input.featureId,
    featureLabel: feature.label,
    issueType: input.issueType,
    issueOther: input.issueOther,
    note: input.note ?? "",
  });

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json(
    {
      issue: result.issue,
      message:
        "Thanks — your report is now visible to other attendees. They can confirm whether it's still there, being fixed, or resolved. In an emergency call 000.",
    },
    { status: 201 },
  );
}

export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id, action } = (body ?? {}) as { id?: string; action?: string };
  if (!id || !action) {
    return Response.json({ error: "id and action are required" }, { status: 400 });
  }

  if (action === "flag") {
    const issue = flagIssue(id);
    if (!issue) return Response.json({ error: "Issue not found" }, { status: 404 });
    return Response.json({ issue });
  }

  if (STATES.includes(action as IssueState)) {
    if (!rateLimit(`vote:${clientKey(request)}`, 40, 60 * 60 * 1000)) {
      return Response.json({ error: "Too many updates. Try again later." }, { status: 429 });
    }
    const issue = voteIssue(id, action as IssueState);
    if (!issue) return Response.json({ error: "Issue not found" }, { status: 404 });
    return Response.json({ issue });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
}
