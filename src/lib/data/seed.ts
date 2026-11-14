import { getParraEvent } from "../events";
import type {
  AccessPlan,
  AttributeValue,
  ChecklistItem,
  DataSource,
  EventRecord,
  Feature,
  Report,
  RiskItem,
  Venue,
} from "../types";

const SOURCE_LABELS: Record<DataSource, string> = {
  openstreetmap: "OpenStreetMap (ODbL)",
  tfNSW: "Transport for NSW Open Data",
  council: "City of Parramatta published info",
  participant: "Community report",
  synthetic: "Synthetic (dummy)",
  ai_suggested: "AI-suggested (unverified)",
};

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}

function attr(
  key: string,
  label: string,
  value: string | number | boolean,
  status: AttributeValue["status"],
  source: DataSource,
  verifiedDaysAgo: number,
  opts: { unit?: string; aiSuggested?: boolean; confidence?: number } = {},
): AttributeValue {
  return {
    key,
    label,
    value,
    unit: opts.unit,
    status,
    aiSuggested: opts.aiSuggested ?? source === "ai_suggested",
    provenance: {
      source,
      sourceLabel: SOURCE_LABELS[source],
      lastVerifiedAt: daysAgo(verifiedDaysAgo),
      confidence: opts.confidence ?? (status === "verified" ? 90 : 55),
    },
  };
}

export const venues: Venue[] = [
  {
    id: "venue-square",
    name: "Parramatta Square",
    address: "Parramatta Square, Parramatta NSW 2150",
    geo: { lat: -33.8151, lng: 151.0011 },
    source: "openstreetmap",
    sourceLabel: SOURCE_LABELS.openstreetmap,
  },
  {
    id: "venue-riverside",
    name: "Riverside Theatres",
    address: "Corner Church and Market Streets, Parramatta NSW 2150",
    geo: { lat: -33.817, lng: 151.011 },
    source: "openstreetmap",
    sourceLabel: SOURCE_LABELS.openstreetmap,
  },
  {
    id: "venue-phive",
    name: "PHIVE",
    address: "5 Parramatta Square, Parramatta NSW 2150",
    geo: { lat: -33.8149, lng: 151.0018 },
    source: "openstreetmap",
    sourceLabel: SOURCE_LABELS.openstreetmap,
  },
  {
    id: "venue-station",
    name: "Parramatta Station precinct",
    address: "Parramatta Station, Parramatta NSW 2150",
    geo: { lat: -33.8173, lng: 151.0051 },
    source: "tfNSW",
    sourceLabel: SOURCE_LABELS.tfNSW,
  },
];

export const events: EventRecord[] = [
  {
    id: "community-day",
    title: "Parramatta Square Community Day",
    organiser: "City of Parramatta (example organiser)",
    councilOwned: true,
    hypothetical: true,
    venueId: "venue-square",
    start: "2026-12-06T10:00:00+11:00",
    end: "2026-12-06T16:00:00+11:00",
    status: "scheduled",
    languages: ["English", "Arabic", "Mandarin", "Hindi"],
    source: "council",
    sourceLabel: SOURCE_LABELS.council,
    license: "Council terms — attribution required; permission pending",
  },
];

export const features: Feature[] = [
  {
    id: "f-entrance-square",
    venueId: "venue-square",
    type: "entrance",
    name: "Main entrance (Parramatta Square side)",
    locationNote: "Ground level, facing the square",
    geo: { lat: -33.8152, lng: 151.0012 },
    needs: ["mobility", "cognitive", "language"],
    attributes: [
      attr("step_free", "Step-free", true, "verified", "council", 6),
      attr("door_width_cm", "Door width", 90, "requires_confirmation", "ai_suggested", 2, {
        unit: "cm",
      }),
      attr("surface", "Path surface", "paved", "verified", "openstreetmap", 20),
      attr("lip_cm", "Threshold lip", 2, "requires_confirmation", "openstreetmap", 20, {
        unit: "cm",
      }),
    ],
  },
  {
    id: "f-lift-square",
    venueId: "venue-square",
    type: "lift",
    name: "Lift to level 1 event space",
    locationNote: "Behind the main entrance, left of the information desk",
    geo: { lat: -33.8153, lng: 151.0013 },
    needs: ["mobility"],
    attributes: [
      attr("step_free", "Step-free access", true, "verified", "council", 6),
      attr("lift_status", "Lift working today", "unknown", "requires_confirmation", "tfNSW", 1),
    ],
  },
  {
    id: "f-toilet-square",
    venueId: "venue-square",
    type: "toilet",
    name: "Accessible toilet",
    locationNote: "Level 1, near the event stage",
    geo: { lat: -33.8154, lng: 151.0014 },
    needs: ["mobility", "family"],
    attributes: [
      attr("step_free", "Step-free", true, "verified", "openstreetmap", 30),
      attr("toilet_gender_access", "Gender access", "any", "requires_confirmation", "openstreetmap", 30),
      attr("changing_table_type", "Changing table", "unknown", "missing", "openstreetmap", 30),
      attr("door_width_cm", "Door width", 85, "requires_confirmation", "ai_suggested", 3, {
        unit: "cm",
      }),
    ],
  },
  {
    id: "f-changing-places-riverside",
    venueId: "venue-riverside",
    type: "changing_places",
    name: "Changing Places facility",
    locationNote: "Ground floor, near the box office",
    geo: { lat: -33.8171, lng: 151.0111 },
    needs: ["mobility", "family"],
    attributes: [
      attr("step_free", "Step-free", true, "verified", "council", 6),
      attr("changing_table_type", "Facility type", "Changing Places (hoist + adult table)", "requires_confirmation", "ai_suggested", 4),
      attr("hoist", "Ceiling hoist", true, "requires_confirmation", "ai_suggested", 4),
      attr("door_width_cm", "Door width", 100, "requires_confirmation", "ai_suggested", 4, {
        unit: "cm",
      }),
    ],
  },
  {
    id: "f-quiet-phive",
    venueId: "venue-phive",
    type: "quiet_space",
    name: "Quiet / sensory space",
    locationNote: "Level 2, room 2.04",
    geo: { lat: -33.815, lng: 151.0019 },
    needs: ["sensory", "cognitive", "family"],
    attributes: [
      attr("quiet", "Quiet space available", true, "requires_confirmation", "ai_suggested", 5),
      attr("noise_level", "Typical noise level", "unknown", "missing", "ai_suggested", 5),
      attr("lighting", "Lighting", "moderate", "requires_confirmation", "ai_suggested", 5),
      attr("crowd_level", "Expected crowd level", "high (event day)", "requires_confirmation", "synthetic", 5),
    ],
  },
  {
    id: "f-loop-riverside",
    venueId: "venue-riverside",
    type: "hearing_loop",
    name: "Hearing loop (main auditorium)",
    locationNote: "Main auditorium, check with box office",
    geo: { lat: -33.8172, lng: 151.0112 },
    needs: ["deaf_hoh"],
    attributes: [
      attr("hearing_loop", "Hearing loop installed", true, "requires_confirmation", "ai_suggested", 7),
      attr("auslan", "Auslan interpreter", "not scheduled", "requires_confirmation", "ai_suggested", 7),
      attr("captions", "Captions / live transcript", false, "missing", "ai_suggested", 7),
    ],
  },
  {
    id: "f-changing-table-square",
    venueId: "venue-square",
    type: "changing_table",
    name: "Parent room / baby change",
    locationNote: "Level 1, family room",
    geo: { lat: -33.8155, lng: 151.0015 },
    needs: ["family"],
    attributes: [
      attr("changing_table_type", "Changing table type", "baby", "requires_confirmation", "ai_suggested", 8),
      attr("pram_accessible", "Pram accessible", "unknown", "missing", "openstreetmap", 25),
      attr("parent_room", "Parent room", true, "requires_confirmation", "ai_suggested", 8),
    ],
  },
  {
    id: "f-stop-station",
    venueId: "venue-station",
    type: "stop",
    name: "Parramatta Station — accessible entrance",
    locationNote: "Station Street side",
    geo: { lat: -33.8174, lng: 151.0052 },
    needs: ["mobility", "transport"],
    attributes: [
      attr("accessible_stop", "Accessible station", true, "verified", "tfNSW", 10),
      attr("wheelchair_boarding", "Wheelchair boarding", true, "verified", "tfNSW", 10),
      attr("lift_status", "Station lift working today", "unknown", "requires_confirmation", "tfNSW", 1),
      attr("last_mile_confidence", "Last-mile confidence (station → door)", "medium", "requires_confirmation", "ai_suggested", 2),
    ],
  },
  {
    id: "f-curb-church",
    venueId: "venue-square",
    type: "curb_cut",
    name: "Church Street crossing (curb cut)",
    locationNote: "Church St at Parramatta Square",
    geo: { lat: -33.8156, lng: 151.0016 },
    needs: ["mobility", "vision", "transport"],
    attributes: [
      attr("surface", "Crossing surface", "paved", "verified", "openstreetmap", 40),
      attr("lip_cm", "Curb lip", 3, "requires_confirmation", "openstreetmap", 40, { unit: "cm" }),
      attr("tactile_paving", "Tactile paving", true, "verified", "openstreetmap", 40),
    ],
  },
];

export const checklist: ChecklistItem[] = [
  { id: "c-mob-1", need: "mobility", prompt: "Step-free route from the nearest accessible stop to the event door", status: "requires_confirmation", note: "Route drafted; needs field check" },
  { id: "c-mob-2", need: "mobility", prompt: "Accessible toilet on site, with door width recorded", status: "requires_confirmation" },
  { id: "c-mob-3", need: "mobility", prompt: "Changing Places facility (hoist + adult changing table)", status: "requires_confirmation" },
  { id: "c-mob-4", need: "mobility", prompt: "Lift status confirmed working on event day", status: "missing" },
  { id: "c-sen-1", need: "sensory", prompt: "Quiet / sensory space identified and signposted", status: "requires_confirmation" },
  { id: "c-sen-2", need: "sensory", prompt: "Noise and lighting conditions described", status: "missing" },
  { id: "c-deaf-1", need: "deaf_hoh", prompt: "Hearing loop available and checked", status: "requires_confirmation" },
  { id: "c-deaf-2", need: "deaf_hoh", prompt: "Auslan interpreter or captions confirmed", status: "missing" },
  { id: "c-fam-1", need: "family", prompt: "Baby change table located (and not only in a women's toilet)", status: "requires_confirmation" },
  { id: "c-fam-2", need: "family", prompt: "Pram-friendly path and pram parking identified", status: "missing" },
  { id: "c-lang-1", need: "language", prompt: "Key access info available in top local languages (human-reviewed)", status: "requires_confirmation" },
  { id: "c-trans-1", need: "transport", prompt: "Nearest accessible stop and boarding confirmed", status: "verified", note: "TfNSW static data" },
  { id: "c-cog-1", need: "cognitive", prompt: "Plain-language, step-by-step directions published", status: "requires_confirmation" },
  { id: "c-vis-1", need: "vision", prompt: "Text alternative to the map provided", status: "verified", note: "List view included" },
];

export const risks: RiskItem[] = [
  {
    id: "R-01",
    category: "Access — mobility",
    description: "Published 'step-free' claim wrong on the day (ramp locked / lift out of service) and a wheelchair user is stranded",
    likelihood: 3,
    consequence: 4,
    control: "Field-verify before publish; live lift status where available; prominent report-a-problem; call-venue fallback",
    responsibleRole: "Event organiser / Council access officer",
    escalationTrigger: "A verified access feature reports 'not working'",
    residualRisk: "Medium — user has a report + fallback path",
    aiSuggested: true,
    approvedBy: null,
    status: "open",
  },
  {
    id: "R-02",
    category: "Data quality",
    description: "Stale or unverified access information shown as if current",
    likelihood: 4,
    consequence: 3,
    control: "Three-state status on every field; confidence decay; last-verified date shown",
    responsibleRole: "Data steward",
    escalationTrigger: "Record not re-verified within the decay window",
    residualRisk: "Low — stale data is labelled",
    aiSuggested: true,
    approvedBy: null,
    status: "open",
  },
  {
    id: "R-03",
    category: "Responsible AI",
    description: "AI-suggested attribute or risk accepted without human review and published as fact",
    likelihood: 3,
    consequence: 5,
    control: "Every AI output labelled 'suggested'; human approval required before publish; append-only history; revert",
    responsibleRole: "Event organiser / Council access officer",
    escalationTrigger: "AI suggestion published without an approver recorded",
    residualRisk: "Low — approval gate is mandatory",
    aiSuggested: true,
    approvedBy: null,
    status: "open",
  },
  {
    id: "R-04",
    category: "Transport",
    description: "Last-mile path (station to door) blocked by roadworks or a closed crossing",
    likelihood: 3,
    consequence: 4,
    control: "Link out to TfNSW trip planner; show alternate entrance; advocacy brief to transport operator",
    responsibleRole: "Council / TfNSW",
    escalationTrigger: "Path disruption reported or works notice detected",
    residualRisk: "Medium — alternative entrance or advocacy output",
    aiSuggested: true,
    approvedBy: null,
    status: "open",
  },
];

export const attendance: AccessPlan["attendance"] = {
  low: 400,
  expected: 900,
  high: 1500,
  basis:
    "Scenario range (not a point prediction), derived from event type, day, season, venue capacity and comparable public events.",
  synthetic: true,
  inputs: [
    { label: "Event type", value: "Community day (family)" },
    { label: "Day / time", value: "Saturday, 10:00–16:00" },
    { label: "Season", value: "Summer" },
    { label: "Venue capacity", value: "~2,000" },
    { label: "Comparable events", value: "Synthetic comparators" },
  ],
};

export const seedReports: Report[] = [
  {
    id: "rep-001",
    featureId: "f-entrance-square",
    issueType: "Feature not working",
    note: "Example: the accessible door on the square side was locked.",
    createdAt: daysAgo(1),
    status: "new",
    reporterRole: "participant",
  },
];

export function getEvent(id: string): EventRecord | undefined {
  return events.find((e) => e.id === id);
}

export function getVenue(id: string): Venue | undefined {
  return venues.find((v) => v.id === id);
}

export function getPlan(eventId: string): AccessPlan | undefined {
  const seedEvent = getEvent(eventId);
  if (seedEvent) {
    const venue = getVenue(seedEvent.venueId);
    if (!venue) return undefined;
    return {
      event: seedEvent,
      venue,
      features,
      checklist,
      risks,
      attendance,
      reports: seedReports,
    };
  }

  const parra = getParraEvent(eventId);
  if (!parra) return undefined;
  const venue = getVenue(parra.venueId) ?? venues[0];
  const event: EventRecord = {
    id: parra.id,
    title: parra.title,
    organiser: "City of Parramatta (example organiser)",
    councilOwned: true,
    hypothetical: false,
    venueId: venue.id,
    start: "",
    end: "",
    when: parra.when,
    status: "scheduled",
    languages: ["English", "Arabic", "Mandarin", "Hindi"],
    source: "council",
    sourceLabel: SOURCE_LABELS.council,
    license: "Council terms — attribution required; permission pending",
  };
  return {
    event,
    venue,
    features,
    checklist,
    risks,
    attendance,
    reports: seedReports,
  };
}
