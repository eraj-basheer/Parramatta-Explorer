import { ISSUE_TYPES, FEATURE_OPTIONS } from "./reportOptions";

export { ISSUE_TYPES, FEATURE_OPTIONS };

/**
 * Lightweight, dependency-free abuse screening for user-generated text.
 * This is deliberately conservative: it blocks obvious abuse and strips
 * anything that looks like personal information. It is not a substitute for
 * the structural safeguards (fixed choices, length caps, rate limits, flagging).
 */

const BLOCKLIST = [
  "fuck",
  "shit",
  "bitch",
  "bastard",
  "cunt",
  "dick",
  "asshole",
  "wanker",
  "slut",
  "whore",
  "rape",
  "nigger",
  "faggot",
  "retard",
];

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/g;
const URL_RE = /https?:\/\/\S+|www\.\S+/gi;

export const MAX_NOTE_LENGTH = 240;

export interface ScreenResult {
  ok: boolean;
  text: string;
  reason?: string;
}

export function screenText(raw: string): ScreenResult {
  const trimmed = raw.trim().slice(0, MAX_NOTE_LENGTH);
  const lower = trimmed.toLowerCase();

  const hit = BLOCKLIST.find((word) => new RegExp(`\\b${word}\\b`, "i").test(lower));
  if (hit) {
    return {
      ok: false,
      text: "",
      reason: "Please remove inappropriate language before posting.",
    };
  }

  const cleaned = trimmed
    .replace(EMAIL_RE, "[removed]")
    .replace(URL_RE, "[removed]")
    .replace(PHONE_RE, "[removed]");

  return { ok: true, text: cleaned };
}

/**
 * Simple in-memory rate limiter (per key, e.g. an IP hash). Suitable for a
 * prototype; production would use a shared store.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  return true;
}
