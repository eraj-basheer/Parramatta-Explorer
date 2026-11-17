"use client";

import { useState } from "react";

interface Booking {
  ref: string;
  eventId: string;
  qty: number;
  cost: string;
  at: string;
}

function costLabel(price: number, qty: number): string {
  return price === 0 ? "Free" : `$${price * qty}`;
}

export function BookingForm({ eventId, price }: { eventId: string; price: number }) {
  const [qty, setQty] = useState(1);
  const [result, setResult] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  const count = Math.max(0, Math.min(10, Number.isNaN(qty) ? 0 : qty));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (count < 1) {
      setError("Choose between 1 and 10 tickets.");
      setResult(null);
      return;
    }
    setError(null);
    const booking: Booking = {
      ref: "DEMO-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      eventId,
      qty: count,
      cost: costLabel(price, count),
      at: new Date().toISOString(),
    };
    try {
      const raw = window.localStorage.getItem("pe-bookings");
      const all: Booking[] = raw ? JSON.parse(raw) : [];
      const next = Array.isArray(all) ? [...all, booking].slice(-20) : [booking];
      window.localStorage.setItem("pe-bookings", JSON.stringify(next));
    } catch {
      // Storage unavailable — the demo still shows the result below.
    }
    setResult(booking);
  }

  return (
    <section
      id="booking"
      className="space-y-3 rounded-2xl border-2 p-4"
      style={{ borderColor: "var(--border)" }}
    >
      <h2 className="font-display text-lg font-bold">Booking</h2>
      <p
        className="rounded-xl p-3 text-sm"
        style={{ background: "var(--status-confirm-bg)", color: "var(--status-confirm-fg)" }}
      >
        <strong>Prototype demo.</strong> This form shows how booking could work. It does not buy a
        ticket, take payment or contact anyone. It is saved only in this browser.
      </p>
      <form onSubmit={submit} className="space-y-3" noValidate>
        <div className="flex flex-wrap gap-4">
          <label className="flex flex-col gap-1" style={{ minWidth: "12rem" }}>
            <span className="font-semibold">Tickets</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={10}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="min-h-11 rounded-xl border-2 px-3 py-2"
              style={{
                borderColor: "var(--color-brand)",
                background: "var(--surface)",
                color: "var(--page-fg)",
              }}
            />
          </label>
          <p className="flex flex-col gap-1" style={{ minWidth: "12rem" }}>
            <span className="font-semibold">Estimated cost</span>
            <output className="font-display text-2xl font-bold" aria-live="polite">
              {price === 0 ? "Free" : `${costLabel(price, count)} (${count} × $${price})`}
            </output>
          </p>
        </div>
        <p className="text-sm" style={{ color: "var(--page-fg-soft)" }}>
          Don&apos;t enter your name, email or health details. This demo doesn&apos;t need them.
        </p>
        <button type="submit" className="rounded-full bg-brand px-6 py-3 font-bold text-white">
          Request demo booking
        </button>
      </form>
      {error ? (
        <p
          role="alert"
          className="rounded-xl p-3 text-sm"
          style={{ background: "var(--status-confirm-bg)", color: "var(--status-confirm-fg)" }}
        >
          {error}
        </p>
      ) : null}
      {result ? (
        <div
          role="status"
          className="space-y-1 rounded-2xl p-4"
          style={{ background: "var(--surface-soft)" }}
        >
          <h3 className="font-display text-base font-bold">Demo booking request saved</h3>
          <p>
            <strong>Reference:</strong> {result.ref}
          </p>
          <p>
            <strong>Tickets:</strong> {result.qty} · <strong>Estimated cost:</strong> {result.cost}
          </p>
          <p className="text-sm" style={{ color: "var(--page-fg-soft)" }}>
            Prototype only. No ticket was issued, no payment was taken and nothing was sent to the
            organiser. Confirm tickets with the organiser. This request is saved only in this
            browser.
          </p>
        </div>
      ) : null}
    </section>
  );
}
