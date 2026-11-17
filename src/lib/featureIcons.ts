import type { FeatureType, VerificationStatus } from "./types";

type IconMeta = {
  label: string;
  tint: string;
  svg: string;
};

const FILLED = 'fill="currentColor" stroke="none"';

const TOILET =
  `<circle cx="7" cy="5" r="1.7" ${FILLED}/>` +
  `<path d="M5 9h4v5.5H8V20H6v-5.5H5z" ${FILLED}/>` +
  `<circle cx="17" cy="5" r="1.7" ${FILLED}/>` +
  `<path d="M17 8.5l-3.4 7h2.4V20h2v-4.5h2.4z" ${FILLED}/>` +
  `<path d="M12 3v18"/>`;

const ICONS: Record<FeatureType, IconMeta> = {
  entrance: {
    label: "Entrance",
    tint: "#fde3a1",
    svg: `<path d="M6 21V4h12v17M3 21h18"/><circle cx="14.5" cy="12.5" r="1" ${FILLED}/>`,
  },
  toilet: {
    label: "Toilet",
    tint: "#d6cdf8",
    svg: TOILET,
  },
  changing_table: {
    label: "Baby change table",
    tint: "#d6cdf8",
    svg: `<circle cx="12" cy="6" r="2.4" ${FILLED}/><path d="M4 13h16M6 13v7M18 13v7"/>`,
  },
  changing_places: {
    label: "Adult changing room (Changing Places)",
    tint: "#d6cdf8",
    svg:
      `<rect x="2.5" y="12" width="13" height="3.2" rx="1"/>` +
      `<path d="M5 15.2v5M13 15.2v5M20 7v8"/>` +
      `<path d="M20 3.5l-3 3.6h6zM20 18.5l-3-3.6h6z" ${FILLED}/>`,
  },
  quiet_space: {
    label: "Quiet space",
    tint: "#ffd7ae",
    svg: `<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>`,
  },
  parking_bay: {
    label: "Accessible parking bay",
    tint: "#bcd9f5",
    svg:
      `<rect x="3" y="3" width="18" height="18" rx="3"/>` +
      `<g transform="translate(6.2 6) scale(0.5)" stroke-width="3.4">` +
      `<circle cx="10" cy="4.5" r="1.8" ${FILLED}/>` +
      `<path d="M10 8v6h5l3 5M10 11h5"/>` +
      `<path d="M7 13.5a5 5 0 1 0 6.5 6"/></g>`,
  },
  stop: {
    label: "Transport stop",
    tint: "#bcd9f5",
    svg:
      `<path d="M5 3.5h14a1 1 0 0 1 1 1V17H4V4.5a1 1 0 0 1 1-1z"/>` +
      `<path d="M4 10h16"/>` +
      `<circle cx="8" cy="19.5" r="1.4" ${FILLED}/>` +
      `<circle cx="16" cy="19.5" r="1.4" ${FILLED}/>`,
  },
  lift: {
    label: "Lift",
    tint: "#fde3a1",
    svg:
      `<rect x="4.5" y="3" width="15" height="18" rx="2"/>` +
      `<path d="M8.5 10.5l3.5-4 3.5 4zM8.5 13.5l3.5 4 3.5-4z" ${FILLED}/>`,
  },
  hearing_loop: {
    label: "Hearing loop",
    tint: "#ffd7ae",
    svg:
      `<path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a2.5 2.5 0 0 1-5 0"/>` +
      `<path d="M11 9a1.5 1.5 0 0 1 3 0"/>`,
  },
  tactile_path: {
    label: "Tactile path",
    tint: "#bcd9f5",
    svg:
      `<g ${FILLED}>` +
      `<circle cx="6" cy="6" r="1.6"/><circle cx="12" cy="6" r="1.6"/><circle cx="18" cy="6" r="1.6"/>` +
      `<circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/>` +
      `<circle cx="6" cy="18" r="1.6"/><circle cx="12" cy="18" r="1.6"/><circle cx="18" cy="18" r="1.6"/></g>`,
  },
  curb_cut: {
    label: "Curb ramp",
    tint: "#bcd9f5",
    svg: `<path d="M3 20h18M4 20l13-8v8"/><path d="M17 12V6"/>`,
  },
  pram_parking: {
    label: "Pram parking",
    tint: "#d6cdf8",
    svg:
      `<path d="M9 14l1-7a6 6 0 0 1 8 7z"/>` +
      `<path d="M4 5h3l2 9h9"/>` +
      `<circle cx="10" cy="19" r="1.5" ${FILLED}/>` +
      `<circle cx="17" cy="19" r="1.5" ${FILLED}/>`,
  },
};

const FALLBACK: IconMeta = {
  label: "Access feature",
  tint: "#ffffff",
  svg:
    `<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/>` +
    `<circle cx="12" cy="10" r="2.2" ${FILLED}/>`,
};

const STATUS_STYLE: Record<VerificationStatus, { fill: string; symbol: string }> = {
  verified: { fill: "var(--status-verified-border)", symbol: "✔" },
  requires_confirmation: { fill: "var(--status-confirm-border)", symbol: "?" },
  missing: { fill: "var(--status-missing-border)", symbol: "–" },
};

export function featureTypeLabel(type: FeatureType): string {
  return (ICONS[type] ?? FALLBACK).label;
}

export function featurePinHtml(type: FeatureType, status: VerificationStatus): string {
  const icon = ICONS[type] ?? FALLBACK;
  const statusStyle = STATUS_STYLE[status];
  return (
    `<span class="feature-pin" style="border-color:${statusStyle.fill};background:${icon.tint}" aria-hidden="true">` +
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon.svg}</svg>` +
    `<span class="feature-pin-status" style="background:${statusStyle.fill}">${statusStyle.symbol}</span>` +
    `</span>`
  );
}
