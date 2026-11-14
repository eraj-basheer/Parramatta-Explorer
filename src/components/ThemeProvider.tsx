"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type ColourMode = "none" | "protan" | "deuter" | "tritan" | "mono";
export type TextSize = "base" | "lg" | "xl" | "xxl";

export interface Settings {
  theme: Theme;
  cb: ColourMode;
  text: TextSize;
}

const DEFAULT: Settings = { theme: "light", cb: "none", text: "base" };

function readSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT;
  try {
    return {
      theme: (localStorage.getItem("pe-theme") as Theme) || "light",
      cb: (localStorage.getItem("pe-cb") as ColourMode) || "none",
      text: (localStorage.getItem("pe-text") as TextSize) || "base",
    };
  } catch {
    return DEFAULT;
  }
}

const SettingsContext = createContext<{
  settings: Settings;
  set: (patch: Partial<Settings>) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(readSettings);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", settings.theme);
    root.setAttribute("data-cb", settings.cb);
    root.setAttribute("data-text", settings.text);
    try {
      localStorage.setItem("pe-theme", settings.theme);
      localStorage.setItem("pe-cb", settings.cb);
      localStorage.setItem("pe-text", settings.text);
    } catch {
      /* storage may be blocked; theme still applies for this session */
    }
  }, [settings]);

  function set(patch: Partial<Settings>) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  return (
    <SettingsContext.Provider value={{ settings, set }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside ThemeProvider");
  return ctx;
}
