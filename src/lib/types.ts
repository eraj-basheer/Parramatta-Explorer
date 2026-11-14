export type VerificationStatus =
  | "verified"
  | "missing"
  | "requires_confirmation";

export type DataSource =
  | "openstreetmap"
  | "tfNSW"
  | "council"
  | "participant"
  | "synthetic"
  | "ai_suggested";

export type NeedId =
  | "mobility"
  | "sensory"
  | "deaf_hoh"
  | "family"
  | "vision"
  | "cognitive"
  | "language"
  | "transport";

export type FeatureType =
  | "entrance"
  | "toilet"
  | "changing_table"
  | "changing_places"
  | "quiet_space"
  | "parking_bay"
  | "stop"
  | "lift"
  | "hearing_loop"
  | "tactile_path"
  | "curb_cut"
  | "pram_parking";

export interface Geo {
  lat: number;
  lng: number;
}

export interface Provenance {
  source: DataSource;
  sourceLabel: string;
  lastVerifiedAt: string;
  confidence: number;
}

export interface AttributeValue {
  key: string;
  label: string;
  value: string | number | boolean;
  unit?: string;
  status: VerificationStatus;
  provenance: Provenance;
  aiSuggested: boolean;
}

export interface Feature {
  id: string;
  venueId: string;
  type: FeatureType;
  name: string;
  locationNote: string;
  geo: Geo;
  needs: NeedId[];
  attributes: AttributeValue[];
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  geo: Geo;
  source: DataSource;
  sourceLabel: string;
}

export interface EventRecord {
  id: string;
  title: string;
  organiser: string;
  councilOwned: boolean;
  hypothetical: boolean;
  venueId: string;
  start: string;
  end: string;
  when?: string;
  status: "scheduled" | "updated" | "cancelled";
  languages: string[];
  source: DataSource;
  sourceLabel: string;
  license: string;
}

export interface RiskItem {
  id: string;
  category: string;
  description: string;
  likelihood: number;
  consequence: number;
  control: string;
  responsibleRole: string;
  escalationTrigger: string;
  residualRisk: string;
  aiSuggested: boolean;
  approvedBy: string | null;
  status: "open" | "approved" | "rejected";
}

export interface AttendanceScenario {
  low: number;
  expected: number;
  high: number;
  basis: string;
  inputs: { label: string; value: string }[];
  synthetic: boolean;
}

export interface ChecklistItem {
  id: string;
  need: NeedId;
  prompt: string;
  status: VerificationStatus;
  note?: string;
}

export interface VerificationRecord {
  id: string;
  featureId: string;
  attributeKey: string;
  action: "verified" | "reported" | "corrected" | "reverted";
  before: string;
  after: string;
  actorRole: "organiser" | "council" | "participant";
  evidenceUrl?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  featureId: string;
  issueType: string;
  note: string;
  createdAt: string;
  status: "new" | "reviewing" | "resolved" | "rejected";
  reporterRole: "participant" | "organiser" | "council";
}

export interface NeedProfile {
  id: NeedId;
  label: string;
  description: string;
  featureTypes: FeatureType[];
  attributeKeys: string[];
}

export type IssueState = "still_there" | "being_resolved" | "resolved";

export interface CommunityIssue {
  id: string;
  eventId: string;
  eventTitle: string;
  featureId: string;
  featureLabel: string;
  issueType: string;
  issueOther?: string;
  note: string;
  createdAt: string;
  state: IssueState;
  counts: Record<IssueState, number>;
  flags: number;
  hidden: boolean;
}

export type FeedbackRating = "happy" | "neutral" | "sad";

export interface EventFeedback {
  id: string;
  eventId: string;
  rating: FeedbackRating;
  details: string;
  createdAt: string;
}

export interface AccessPlan {
  event: EventRecord;
  venue: Venue;
  features: Feature[];
  checklist: ChecklistItem[];
  risks: RiskItem[];
  attendance: AttendanceScenario;
  reports: Report[];
}
