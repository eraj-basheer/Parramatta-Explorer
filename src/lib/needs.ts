import type { NeedProfile } from "./types";

export const NEED_PROFILES: NeedProfile[] = [
  {
    id: "mobility",
    label: "I use a wheelchair or mobility aid",
    description:
      "Step-free routes, door widths, ramps, surfaces, lifts and accessible toilets.",
    featureTypes: ["entrance", "toilet", "changing_places", "lift", "parking_bay", "curb_cut", "stop"],
    attributeKeys: [
      "step_free",
      "door_width_cm",
      "ramp",
      "max_grade_pct",
      "surface",
      "lip_cm",
      "lift_status",
    ],
  },
  {
    id: "sensory",
    label: "I am sensory-sensitive or neurodivergent",
    description: "Quiet spaces, crowd level, noise and lighting notes.",
    featureTypes: ["quiet_space", "entrance"],
    attributeKeys: ["quiet", "noise_level", "lighting", "crowd_level"],
  },
  {
    id: "deaf_hoh",
    label: "I am Deaf or hard of hearing",
    description: "Hearing loops, Auslan interpreters, captions and visual alerts.",
    featureTypes: ["hearing_loop", "quiet_space"],
    attributeKeys: ["hearing_loop", "auslan", "captions", "visual_alerts"],
  },
  {
    id: "family",
    label: "I am bringing young children",
    description: "Changing tables, pram paths, family rooms and pram parking.",
    featureTypes: ["changing_table", "pram_parking", "toilet", "quiet_space"],
    attributeKeys: ["changing_table_type", "pram_accessible", "parent_room"],
  },
  {
    id: "vision",
    label: "I am blind or have low vision",
    description: "Tactile paving, text directions and audio guidance.",
    featureTypes: ["tactile_path", "entrance"],
    attributeKeys: ["tactile_paving", "audio_guidance", "contrast"],
  },
  {
    id: "cognitive",
    label: "I prefer simple, predictable information",
    description: "Plain language, step-by-step directions and a predictable route.",
    featureTypes: ["entrance", "quiet_space"],
    attributeKeys: ["plain_language", "predictable_route"],
  },
  {
    id: "language",
    label: "I read another language",
    description: "Human-reviewed key info, RTL support and multilingual contacts.",
    featureTypes: ["entrance"],
    attributeKeys: ["language_support", "rtl", "support_contact"],
  },
  {
    id: "transport",
    label: "I rely on public transport",
    description: "Accessible stops, boarding and last-mile confidence.",
    featureTypes: ["stop", "entrance", "curb_cut"],
    attributeKeys: ["wheelchair_boarding", "accessible_stop", "last_mile_confidence"],
  },
];

export function getNeed(id: string): NeedProfile | undefined {
  return NEED_PROFILES.find((n) => n.id === id);
}
