"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Map as MLMap, Marker as MLMarker } from "maplibre-gl";
import type { ParraEvent } from "@/lib/events";

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
const CENTER: [number, number] = [151.0011, -33.8151];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface PlaceGroup {
  geo: { lat: number; lng: number };
  events: ParraEvent[];
}

function groupByPlace(events: ParraEvent[]): PlaceGroup[] {
  const groups = new Map<string, PlaceGroup>();
  for (const event of events) {
    const key = `${event.geo.lat.toFixed(4)},${event.geo.lng.toFixed(4)}`;
    const existing = groups.get(key);
    if (existing) existing.events.push(event);
    else groups.set(key, { geo: event.geo, events: [event] });
  }
  return [...groups.values()];
}

function subscribeOnline(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export function EventsMap({ events }: { events: ParraEvent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const modRef = useRef<typeof import("maplibre-gl") | null>(null);
  const markersRef = useRef<MLMarker[]>([]);
  const loadedRef = useRef(false);

  const [ready, setReady] = useState(0);
  const [failed, setFailed] = useState(false);
  const online = useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true,
  );

  useEffect(() => {
    if (!online) return;
    let cancelled = false;
    const watchdog = window.setTimeout(() => {
      if (!loadedRef.current) setFailed(true);
    }, 8000);

    (async () => {
      try {
        const mod = await import("maplibre-gl");
        if (cancelled || !containerRef.current) return;
        modRef.current = mod;

        const map = new mod.Map({
          container: containerRef.current,
          style: STYLE_URL,
          center: CENTER,
          zoom: 14,
          attributionControl: { compact: true },
        });
        map.addControl(new mod.NavigationControl({ showCompass: false }), "top-right");
        map.on("error", (e) => {
          if (!loadedRef.current) setFailed(true);
          else console.warn("Map tile error", e.error);
        });
        map.on("load", () => {
          if (cancelled) return;
          loadedRef.current = true;
          window.clearTimeout(watchdog);
          map.resize();
          setReady((n) => n + 1);
        });
        mapRef.current = map;
      } catch {
        window.clearTimeout(watchdog);
        setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(watchdog);
      loadedRef.current = false;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
      modRef.current = null;
    };
  }, [online]);

  useEffect(() => {
    const mod = modRef.current;
    const map = mapRef.current;
    if (!ready || !mod || !map) return;

    const groups = groupByPlace(events);
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = groups.map((group) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "ev-marker";
      el.setAttribute("aria-label", group.events.map((e) => e.title).join(", "));
      el.textContent = group.events[0].emoji || "📍";
      if (group.events.length > 1) {
        const count = document.createElement("span");
        count.className = "n";
        count.setAttribute("aria-hidden", "true");
        count.textContent = String(group.events.length);
        el.appendChild(count);
      }

      const items = group.events
        .map(
          (e) =>
            `<li><a href="/plan/${encodeURIComponent(e.id)}">` +
            `${e.emoji ? `<span class="ev-emoji" aria-hidden="true">${e.emoji}</span> ` : ""}` +
            `${escapeHtml(e.title)}</a> · ${e.price > 0 ? `$${e.price}` : "Free"}</li>`,
        )
        .join("");
      const popup = new mod.Popup({ offset: 26, maxWidth: "280px" }).setHTML(
        `<strong>${escapeHtml(group.events[0].place)}</strong><ul class="pop-list">${items}</ul>`,
      );

      return new mod.Marker({ element: el })
        .setLngLat([group.geo.lng, group.geo.lat])
        .setPopup(popup)
        .addTo(map);
    });

    if (groups.length > 1) {
      const bounds = new mod.LngLatBounds();
      groups.forEach((group) => bounds.extend([group.geo.lng, group.geo.lat]));
      map.fitBounds(bounds, { padding: 64, maxZoom: 16, duration: 0 });
    } else if (groups.length === 1) {
      map.setCenter([groups[0].geo.lng, groups[0].geo.lat]);
    }
  }, [ready, events]);

  if (!online || failed) {
    return (
      <p
        className="rounded-2xl border-2 p-4 text-sm"
        style={{ borderColor: "var(--border)", background: "var(--surface-soft)", color: "var(--page-fg-soft)" }}
      >
        {online ? "The map could not load." : "The live map needs a connection."} The list below has the
        same events.
      </p>
    );
  }

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="Map of event locations. The list below has the same events."
      className="h-96 w-full overflow-hidden rounded-2xl border-2"
      style={{ borderColor: "var(--border)", background: "var(--surface-soft)" }}
    />
  );
}
