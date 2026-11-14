"use client";

import { useEffect, useState } from "react";

/**
 * Text-to-speech button. Uses the browser Web Speech API.
 * - Pass `text` to read a specific section, or omit it to read the whole page.
 * - Gracefully hidden if the browser has no speech synthesis support.
 */
export function SpeakButton({
  text,
  label = "Listen",
  className = "",
}: {
  text?: string;
  label?: string;
  className?: string;
}) {
  const [supported, setSupported] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) {
        setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
      }
    })();
    return () => {
      cancelled = true;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function resolveText() {
    if (text) return text;
    const main = document.getElementById("main");
    return main ? main.innerText : document.body.innerText;
  }

  function toggle() {
    if (!supported) return;
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const content = resolveText().trim();
    if (!content) return;
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = "en-AU";
    utterance.rate = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(utterance);
    setSpeaking(true);
  }

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={speaking}
      aria-label={speaking ? "Stop reading aloud" : `${label} — read aloud`}
      className={`inline-flex items-center gap-1.5 rounded-full border border-current px-3 py-1 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 ${className}`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {speaking ? (
          <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
        ) : (
          <>
            <path d="M11 5 6 9H3v6h3l5 4z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18 6a9 9 0 0 1 0 12" />
          </>
        )}
      </svg>
      {speaking ? "Stop" : label}
    </button>
  );
}
