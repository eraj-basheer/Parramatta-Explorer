"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Map as MLMap, Marker as MLMarker } from "maplibre-gl";
import type { Feature, NeedId } from "@/lib/types";
import { STATUS_META, statusFill, featureStatus } from "@/lib/status";

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function LiveMap({
  features,
  selectedNeeds,
  onFail,
}: {
  features: Feature[];
  selectedNeeds: NeedId[];
  onFail?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const modRef = useRef<typeof import("maplibre-gl") | null>(null);
  const markersRef = useRef<MLMarker[]>([]);
  const loadedRef = useRef(false);
  const onFailRef = useRef(onFail);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    onFailRef.current = onFail;
  });

  useEffect(() => {
    let cancelled = false;
    const watchdog = window.setTimeout(() => {
      if (!loadedRef.current) onFailRef.current?.();
    }, 8000);

    (async () => {
      try {
        const mod = await import("maplibre-gl");
        if (cancelled || !containerRef.current) return;
        modRef.current = mod;

        const lats = features.map((f) => f.geo.lat);
        const lngs = features.map((f) => f.geo.lng);
        const center: [number, number] = [
          lngs.reduce((a, b) => a + b, 0) / lngs.length,
          lats.reduce((a, b) => a + b, 0) / lats.length,
        ];

        const map = new mod.Map({
          container: containerRef.current,
          style: STYLE_URL,
          center,
          zoom: 15,
          attributionControl: { compact: true },
        });
        map.addControl(new mod.NavigationControl({ showCompass: false }), "top-right");
        map.on("error", (e) => {
          if (!loadedRef.current) onFailRef.current?.();
          else console.warn("Map tile error", e.error);
        });
        map.on("load", () => {
          if (cancelled) return;
          loadedRef.current = true;
          window.clearTimeout(watchdog);
          map.resize();
          setReady(true);
        });
        mapRef.current = map;
      } catch {
        window.clearTimeout(watchdog);
        onFailRef.current?.();
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(watchdog);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
      modRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mod = modRef.current;
    const map = mapRef.current;
    if (!ready || !mod || !map) return;

    const visible = features.filter((f) => f.needs.some((n) => selectedNeeds.includes(n)));
    const points = visible.length ? visible : features;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = points.map((f) => {
      const status = featureStatus(f);
      const el = document.createElement("div");
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.borderRadius = "9999px";
      el.style.background = statusFill(status);
      el.style.border = "2px solid #ffffff";
      el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.45)";
      el.setAttribute("aria-hidden", "true");

      const popup = new mod.Popup({ offset: 16 }).setHTML(
        `<strong>${escapeHtml(f.name)}</strong><br/>` +
          `<span style="color:#444">${escapeHtml(f.locationNote)}</span><br/>` +
          `<span>${escapeHtml(STATUS_META[status].label)}</span>`,
      );

      return new mod.Marker({ element: el })
        .setLngLat([f.geo.lng, f.geo.lat])
        .setPopup(popup)
        .addTo(map);
    });

    if (points.length > 1) {
      const bounds = new mod.LngLatBounds();
      points.forEach((f) => bounds.extend([f.geo.lng, f.geo.lat]));
      map.fitBounds(bounds, { padding: 56, maxZoom: 17, duration: 0 });
    } else if (points.length === 1) {
      map.setCenter([points[0].geo.lng, points[0].geo.lat]);
    }
  }, [ready, features, selectedNeeds]);

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="Interactive map of access features. The text list below gives the same information."
      className="h-64 w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950"
    />
  );
}
