"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { MONTH_NAMES, eventMonths, type ParraEvent } from "@/lib/events";

const subscribe = () => () => {};
const getMonth = () => new Date().getMonth() + 1;
const getServerMonth = () => null;

export function EventCalendar({ events }: { events: ParraEvent[] }) {
  const currentMonth = useSyncExternalStore(subscribe, getMonth, getServerMonth);

  const buckets: ParraEvent[][] = MONTH_NAMES.map(() => []);
  const ongoing: ParraEvent[] = [];
  for (const event of events) {
    const months = eventMonths(event.when);
    if (!months) {
      ongoing.push(event);
      continue;
    }
    for (const month of months) buckets[month - 1].push(event);
  }

  const activeMonths = MONTH_NAMES.map((name, i) => ({ name, month: i + 1, events: buckets[i] })).filter(
    (m) => m.events.length > 0,
  );

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: "var(--page-fg-soft)" }}>
        Grouped by the month each event usually runs. Recurring and year-round events come first. Dates
        recur annually, so confirm the current date with the organiser.
      </p>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ongoing.length > 0 && (
          <li
            className="rounded-2xl border-2 p-4"
            style={{ borderColor: "var(--surface-soft)", background: "var(--surface)" }}
          >
            <h3 className="font-display flex items-baseline justify-between gap-2 text-lg font-bold">
              Recurring &amp; year-round
              <span className="text-xs font-semibold" style={{ color: "var(--page-fg-soft)" }}>
                {ongoing.length} {ongoing.length === 1 ? "event" : "events"}
              </span>
            </h3>
            <ul className="mt-2 grid gap-1.5">
              {ongoing.map((e) => (
                <li key={e.id} className="text-sm">
                  <Link
                    href={`/plan/${e.id}`}
                    className="font-semibold hover:underline"
                    style={{ color: "var(--page-fg)" }}
                  >
                    <span className="ev-emoji" aria-hidden="true">{e.emoji}</span> {e.title}
                  </Link>
                  <span className="block text-xs" style={{ color: "var(--page-fg-soft)" }}>
                    {e.when}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        )}

        {activeMonths.map(({ name, month, events: monthEvents }) => {
          const isNow = currentMonth === month;
          return (
            <li
              key={name}
              className="rounded-2xl border-2 p-4"
              style={{
                borderColor: isNow ? "var(--color-brand)" : "var(--surface-soft)",
                background: "var(--surface)",
                boxShadow: isNow ? "0 0 0 3px var(--color-sun)" : undefined,
              }}
            >
              <h3 className="font-display flex items-baseline justify-between gap-2 text-lg font-bold">
                {name}
                <span className="text-xs font-semibold" style={{ color: "var(--page-fg-soft)" }}>
                  {monthEvents.length} {monthEvents.length === 1 ? "event" : "events"}
                </span>
              </h3>
              <ul className="mt-2 grid gap-1.5">
                {monthEvents.map((e) => (
                  <li key={e.id} className="text-sm">
                    <Link
                      href={`/plan/${e.id}`}
                      className="font-semibold hover:underline"
                      style={{ color: "var(--page-fg)" }}
                    >
                      <span className="ev-emoji" aria-hidden="true">{e.emoji}</span> {e.title}
                    </Link>
                    <span className="block text-xs" style={{ color: "var(--page-fg-soft)" }}>
                      {e.when}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
