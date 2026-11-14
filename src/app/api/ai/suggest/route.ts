import type { AttributeValue } from "@/lib/types";

interface Suggestion {
  featureId: string;
  key: string;
  label: string;
  proposedValue: string | number | boolean;
  unit?: string;
  reason: string;
}

const SUGGESTION_LIBRARY: Record<string, Suggestion[]> = {
  mobility: [
    {
      featureId: "f-entrance-square",
      key: "door_width_cm",
      label: "Door width",
      proposedValue: 90,
      unit: "cm",
      reason: "Comparable venue entrances average 85–95 cm. Needs a tape-measure check.",
    },
    {
      featureId: "f-toilet-square",
      key: "turning_circle_cm",
      label: "Turning circle",
      proposedValue: 150,
      unit: "cm",
      reason: "AS 1428.1 suggests ≥150 cm. Unverified.",
    },
  ],
  sensory: [
    {
      featureId: "f-quiet-phive",
      key: "noise_level",
      label: "Typical noise level",
      proposedValue: "moderate",
      reason: "Inferred from room type and location; not measured.",
    },
  ],
  deaf_hoh: [
    {
      featureId: "f-loop-riverside",
      key: "hearing_loop",
      label: "Hearing loop installed",
      proposedValue: true,
      reason: "Auditorium of this type often has a loop. Must be confirmed with the venue.",
    },
  ],
};

const RISK_DRAFTS = [
  {
    id: "ai-R-a",
    category: "Access — mobility",
    description: "Accessible toilet reported locked or used for storage during the event",
    likelihood: 2,
    consequence: 3,
    control: "Pre-event check; staff briefing; signage; report-a-problem link",
    responsibleRole: "Event organiser",
    escalationTrigger: "Toilet reported unavailable",
    residualRisk: "Low",
  },
  {
    id: "ai-R-b",
    category: "Operational",
    description: "Crowd level exceeds the scenario range and blocks step-free routes",
    likelihood: 3,
    consequence: 3,
    control: "Crowd monitoring; keep access routes clear; staff marshals",
    responsibleRole: "Event organiser",
    escalationTrigger: "Attendance exceeds the upper scenario bound",
    residualRisk: "Medium",
  },
];

/**
 * Deterministic stand-in for the AI structuring step.
 *
 * In production this calls a large language model grounded on approved public
 * documents. Every output here is returned as an AI suggestion that MUST be
 * confirmed by a human before it is published. See docs/responsible-ai-statement.md.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const { need } = (body ?? {}) as { need?: string };

  const suggestions: Suggestion[] = need
    ? (SUGGESTION_LIBRARY[need] ?? [])
    : Object.values(SUGGESTION_LIBRARY).flat();

  const attributes: AttributeValue[] = suggestions.map((s) => ({
    key: s.key,
    label: s.label,
    value: s.proposedValue,
    unit: s.unit,
    status: "requires_confirmation",
    aiSuggested: true,
    provenance: {
      source: "ai_suggested",
      sourceLabel: "AI-suggested (unverified)",
      lastVerifiedAt: new Date().toISOString(),
      confidence: 40,
    },
  }));

  return Response.json({
    simulated: true,
    disclosure:
      "Simulated AI output for the prototype. Each item is a suggestion and requires human confirmation before it is published.",
    attributes,
    risks: RISK_DRAFTS.map((r) => ({ ...r, aiSuggested: true, approvedBy: null, status: "open" })),
  });
}
