export interface ParraEvent {
  id: string;
  title: string;
  categories: string[];
  /** 0 means free entry. */
  price: number;
  /** Approximate distance from the Parramatta CBD, in kilometres. */
  distanceKm: number;
  when: string;
  color: string;
  /** A single emoji shown beside the event name (presentation only). */
  emoji: string;
  blurb: string;
  venue: string;
  venueId: string;
  source: string;
  /** Approximate position for the map (hand-estimated, not surveyed). */
  geo: { lat: number; lng: number };
  /** Human-readable place label shown in map popups. */
  place: string;
}

export const EVENT_CATEGORIES: { label: string; bg: string; ink: string }[] = [
  { label: "All", bg: "#e6ecf6", ink: "#034f84" },
  { label: "Free", bg: "#8fe3c2", ink: "#034f84" },
  { label: "Family", bg: "#ffc93c", ink: "#034f84" },
  { label: "Music", bg: "#cfc2f7", ink: "#034f84" },
  { label: "Food", bg: "#f6c5c5", ink: "#034f84" },
  { label: "Culture", bg: "#d3dff2", ink: "#034f84" },
  { label: "Markets", bg: "#8fe3c2", ink: "#034f84" },
  { label: "Riverside", bg: "#92a8d1", ink: "#034f84" },
  { label: "First Nations", bg: "#8fe3c2", ink: "#034f84" },
];

/**
 * Real events hosted or supported by the City of Parramatta, compiled from
 * public Council listings and the Major Events and Festivals Strategy 2025-2030.
 * Dates recur annually; always confirm current details with the organiser.
 */
export const PARRAMATTA_EVENTS: ParraEvent[] = [
  {
    id: "parramatta-lanes",
    emoji: "🎶",
    geo: { lat: -33.8165, lng: 151.0033 },
    place: "CBD laneways",
    title: "Parramatta Lanes",
    categories: ["Free", "Music", "Food", "Culture"],
    price: 0,
    distanceKm: 0.5,
    when: "October",
    color: "#cfc2f7",
    blurb: "Laneway takeovers, music stages, art installations and a long line-up of performers.",
    venue: "Parramatta CBD laneways",
    venueId: "venue-square",
    source: "City of Parramatta major events",
  },
  {
    id: "diwali",
    emoji: "🪔",
    geo: { lat: -33.8151, lng: 151.0011 },
    place: "Parramatta Square",
    title: "Diwali",
    categories: ["Free", "Culture", "Family"],
    price: 0,
    distanceKm: 0.6,
    when: "October / November",
    color: "#ffc93c",
    blurb: "One of the city's major annual celebrations, with lights, food and performances.",
    venue: "Parramatta Square",
    venueId: "venue-square",
    source: "City of Parramatta major events",
  },
  {
    id: "christmas-in-parramatta",
    emoji: "🎄",
    geo: { lat: -33.8156, lng: 151.002 },
    place: "Parramatta Square and CBD",
    title: "Christmas in Parramatta",
    categories: ["Free", "Family", "Music"],
    price: 0,
    distanceKm: 0.4,
    when: "From late November",
    color: "#8fe3c2",
    blurb: "Festive lights, markets, live music and community gatherings across the city.",
    venue: "Parramatta Square and CBD",
    venueId: "venue-square",
    source: "City of Parramatta major events",
  },
  {
    id: "new-years-eve",
    emoji: "🎆",
    geo: { lat: -33.81, lng: 151.0 },
    place: "Parramatta Park and CBD",
    title: "New Year's Eve",
    categories: ["Free", "Music", "Family"],
    price: 0,
    distanceKm: 0.5,
    when: "31 December",
    color: "#034f84",
    blurb: "A family-friendly way to see out the year in Parramatta, with entertainment and fireworks.",
    venue: "Parramatta Park and CBD",
    venueId: "venue-square",
    source: "City of Parramatta major events",
  },
  {
    id: "lunar-new-year",
    emoji: "🧧",
    geo: { lat: -33.8148, lng: 151.0007 },
    place: "Parramatta Square",
    title: "Lunar New Year",
    categories: ["Free", "Culture", "Family"],
    price: 0,
    distanceKm: 0.7,
    when: "January / February",
    color: "#c94c4c",
    blurb: "A family-friendly festival welcoming the new lunar year with food, dance and colour.",
    venue: "Parramatta Square",
    venueId: "venue-square",
    source: "City of Parramatta major events",
  },
  {
    id: "australia-day",
    emoji: "🇦🇺",
    geo: { lat: -33.8112, lng: 151.0035 },
    place: "Parramatta Park and riverfront",
    title: "Australia Day in Parramatta",
    categories: ["Free", "Family", "Music"],
    price: 0,
    distanceKm: 0.6,
    when: "26 January",
    color: "#ffc93c",
    blurb: "A day of free community entertainment, food and activities by the river.",
    venue: "Parramatta Park and riverfront",
    venueId: "venue-square",
    source: "City of Parramatta major events",
  },
  {
    id: "warami",
    emoji: "🎨",
    geo: { lat: -33.814, lng: 151.0025 },
    place: "Across Parramatta (CBD centre shown)",
    title: "Warami",
    categories: ["Free", "First Nations", "Culture"],
    price: 0,
    distanceKm: 0.8,
    when: "May – July",
    color: "#8fe3c2",
    blurb:
      "A season of First Nations events on Dharug Country, including National Sorry Day programming.",
    venue: "Across Parramatta",
    venueId: "venue-square",
    source: "City of Parramatta major events",
  },
  {
    id: "burramatta-naidoc",
    emoji: "🌅",
    geo: { lat: -33.809, lng: 150.999 },
    place: "Parramatta Park",
    title: "Burramatta NAIDOC",
    categories: ["Free", "First Nations", "Culture", "Family"],
    price: 0,
    distanceKm: 0.9,
    when: "July",
    color: "#c94c4c",
    blurb: "A celebration of First Nations culture, music, art and community on Dharug Country.",
    venue: "Parramatta Park",
    venueId: "venue-square",
    source: "City of Parramatta major events",
  },
  {
    id: "make-music-day",
    emoji: "🎸",
    geo: { lat: -33.816, lng: 151.0015 },
    place: "Parramatta CBD",
    title: "Make Music Day",
    categories: ["Free", "Music", "Culture"],
    price: 0,
    distanceKm: 0.5,
    when: "21 June",
    color: "#cfc2f7",
    blurb: "Free live music in public spaces as part of the global Make Music Day.",
    venue: "Parramatta CBD",
    venueId: "venue-square",
    source: "City of Parramatta major events",
  },
  {
    id: "winterlight",
    emoji: "⛸️",
    geo: { lat: -33.8154, lng: 151.0014 },
    place: "Parramatta Square",
    title: "Winterlight",
    categories: ["Family", "Culture"],
    price: 12,
    distanceKm: 0.5,
    when: "July",
    color: "#92a8d1",
    blurb: "A winter festival with an outdoor ice rink, lights and family activities.",
    venue: "Parramatta Square",
    venueId: "venue-square",
    source: "City of Parramatta major events",
  },
  {
    id: "farmers-market",
    emoji: "🥕",
    geo: { lat: -33.8149, lng: 151.0028 },
    place: "Centenary Square",
    title: "Parramatta Farmers Market",
    categories: ["Free", "Markets", "Food"],
    price: 0,
    distanceKm: 0.3,
    when: "Every Friday",
    color: "#8fe3c2",
    blurb: "Fresh produce and street food from local growers and makers, every week.",
    venue: "Centenary Square",
    venueId: "venue-square",
    source: "City of Parramatta regular markets",
  },
  {
    id: "riverside-food-market",
    emoji: "🍜",
    geo: { lat: -33.8127, lng: 151.0052 },
    place: "Parramatta River foreshore",
    title: "Riverside Food Market",
    categories: ["Free", "Food", "Markets", "Riverside"],
    price: 0,
    distanceKm: 0.4,
    when: "This weekend",
    color: "#8fe3c2",
    blurb: "Food stalls and makers along the Parramatta River foreshore.",
    venue: "Parramatta River foreshore",
    venueId: "venue-square",
    source: "City of Parramatta regular markets",
  },
  {
    id: "family-movie-night",
    emoji: "🎬",
    geo: { lat: -33.8145, lng: 151.0016 },
    place: "Outdoor venue (position approximate)",
    title: "Family Movie Night",
    categories: ["Free", "Family"],
    price: 0,
    distanceKm: 1.2,
    when: "Select Saturdays",
    color: "#ffc93c",
    blurb: "Free outdoor family films on a big screen. Bring a blanket.",
    venue: "Parramatta Park",
    venueId: "venue-square",
    source: "City of Parramatta community events",
  },
  {
    id: "seniors-festival",
    emoji: "🌻",
    geo: { lat: -33.8158, lng: 151.0025 },
    place: "Parramatta CBD",
    title: "Seniors Festival",
    categories: ["Free", "Culture"],
    price: 0,
    distanceKm: 0.6,
    when: "March",
    color: "#cfc2f7",
    blurb: "A program of free events and activities celebrating older residents.",
    venue: "Across Parramatta",
    venueId: "venue-square",
    source: "City of Parramatta community events",
  },
  {
    id: "youth-week",
    emoji: "🛹",
    geo: { lat: -33.8152, lng: 151.0003 },
    place: "Parramatta CBD",
    title: "Youth Week",
    categories: ["Free", "Music", "Culture"],
    price: 0,
    distanceKm: 0.7,
    when: "April",
    color: "#cfc2f7",
    blurb: "Events by and for young people, including music, art and workshops.",
    venue: "Parramatta CBD",
    venueId: "venue-square",
    source: "City of Parramatta community events",
  },
];

export function getParraEvent(id: string): ParraEvent | undefined {
  return PARRAMATTA_EVENTS.find((e) => e.id === id);
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Best-effort mapping from a free-text `when` label to month numbers (1-12).
 * Returns null when no month is named (e.g. "Every Friday", "This weekend"),
 * which the calendar treats as an ongoing or recurring event.
 */
export function eventMonths(when?: string): number[] | null {
  const text = String(when ?? "").toLowerCase();
  const found: { n: number; at: number }[] = [];
  MONTH_NAMES.forEach((name, i) => {
    const at = text.indexOf(name.toLowerCase());
    if (at !== -1) found.push({ n: i + 1, at });
  });
  if (!found.length) return null;
  found.sort((a, b) => a.at - b.at);
  if (found.length === 2 && /[-–—]/.test(text) && !text.includes("/")) {
    const out: number[] = [];
    const start = found[0].n;
    const end = found[1].n;
    let month = start;
    for (let guard = 0; guard < 12; guard++) {
      out.push(month);
      if (month === end) break;
      month = (month % 12) + 1;
    }
    return out;
  }
  return found.map((m) => m.n);
}
