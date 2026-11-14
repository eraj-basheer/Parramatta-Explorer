"use client";

import { useEffect, useState } from "react";
import { useSettings, type ColourMode, type TextSize, type Theme } from "./ThemeProvider";
import { StatusBadge } from "./StatusBadge";

const THEMES: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const COLOUR_MODES: { value: ColourMode; label: string; hint: string }[] = [
  { value: "none", label: "Default", hint: "Standard colours" },
  { value: "protan", label: "Protanopia", hint: "Red-blind safe palette" },
  { value: "deuter", label: "Deuteranopia", hint: "Green-blind safe palette" },
  { value: "tritan", label: "Tritanopia", hint: "Blue-blind safe palette" },
  { value: "mono", label: "High contrast", hint: "Monochrome, maximum contrast" },
];

const TEXT_SIZES: { value: TextSize; label: string; hint: string }[] = [
  { value: "base", label: "100%", hint: "Default" },
  { value: "lg", label: "112%", hint: "Large" },
  { value: "xl", label: "125%", hint: "Extra large" },
  { value: "xxl", label: "137%", hint: "Largest" },
];

function Group<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: { value: T; label: string; hint?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="rounded-2xl border p-4" style={{ borderColor: "var(--border)" }}>
      <legend className="px-1 font-display text-sm font-bold">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={`rounded-xl border px-3 py-2 text-left text-sm ${
                active
                  ? "border-brand bg-brand text-white"
                  : "hover:bg-black/5 dark:hover:bg-white/10"
              }`}
              style={active ? undefined : { borderColor: "var(--border)" }}
            >
              <span className="block font-semibold">{o.label}</span>
              {o.hint ? <span className="block text-xs opacity-80">{o.hint}</span> : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SettingsControls() {
  const { settings, set } = useSettings();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) setMounted(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!mounted) {
    return (
      <p className="text-sm" style={{ color: "var(--page-fg-soft)" }}>
        Loading your saved preferences…
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <Group
        legend="Theme"
        options={THEMES}
        value={settings.theme}
        onChange={(theme) => set({ theme })}
      />
      <Group
        legend="Colour mode (for colour blindness)"
        options={COLOUR_MODES}
        value={settings.cb}
        onChange={(cb) => set({ cb })}
      />
      <Group
        legend="Text size"
        options={TEXT_SIZES}
        value={settings.text}
        onChange={(text) => set({ text })}
      />

      <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border)" }}>
        <p className="font-display text-sm font-bold">Preview</p>
        <p className="mt-1 text-xs" style={{ color: "var(--page-fg-soft)" }}>
          Colour mode changes the status colours used across the app. This is how they look right
          now.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusBadge status="verified" />
          <StatusBadge status="requires_confirmation" />
          <StatusBadge status="missing" />
        </div>
      </div>
    </div>
  );
}
