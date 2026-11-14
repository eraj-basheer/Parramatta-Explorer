import { addFeedback, feedbackSummary, listFeedback } from "@/lib/community";
import { rateLimit } from "@/lib/moderation";
import type { FeedbackRating } from "@/lib/types";

const RATINGS: FeedbackRating[] = ["happy", "neutral", "sad"];

function clientKey(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "local";
}

export async function GET(request: Request) {
  const eventId = new URL(request.url).searchParams.get("eventId") ?? undefined;
  return Response.json({
    summary: feedbackSummary(eventId ?? undefined),
    feedback: listFeedback(eventId ?? undefined),
  });
}

export async function POST(request: Request) {
  if (!rateLimit(`feedback:${clientKey(request)}`, 10, 60 * 60 * 1000)) {
    return Response.json(
      { error: "Too many submissions from this device. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { eventId, rating, details } = (body ?? {}) as {
    eventId?: string;
    rating?: FeedbackRating;
    details?: string;
  };

  if (!eventId || !rating || !RATINGS.includes(rating)) {
    return Response.json({ error: "eventId and a valid rating are required" }, { status: 400 });
  }

  const entry = addFeedback({ eventId, rating, details: details ?? "" });
  return Response.json(
    {
      feedback: entry,
      summary: feedbackSummary(eventId),
      message: "Thanks — your rating helps the next person. No personal details were stored.",
    },
    { status: 201 },
  );
}
