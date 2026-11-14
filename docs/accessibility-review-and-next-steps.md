# Accessibility review & next steps

_Parramatta Explorer — prototype review following the accessibility and community-feature iteration._

## What this iteration shipped

- Rebrand to **Parramatta Explorer**, new palette and fonts (Inter + Space Grotesk) drawn from the
  reference design, keeping only the "explore / search what's on" concept.
- **Explore home**: search, category chips, price and distance sliders, 15 real City of Parramatta
  events, each linking to an access plan.
- **Settings**: light/dark, colourblind modes (protan, deuter, tritan, high-contrast mono) and text
  size (100–137%), saved per device.
- **Text-to-speech** on every page and every section (Web Speech API, on-device).
- **Sign-in** with role selection (attendee vs Council organiser), non-invasive organiser
  verification, and a no-personal-data attendee path.
- **Report-a-problem rework**: event → feature → issue (with "Other" in both dropdowns), community
  status voting (still there / being resolved / resolved), **no moderator**, with anti-abuse
  safeguards.
- **After-event feedback**: one-tap happy/neutral/sad face + optional note.
- **Onboarding guide**, updated **About & data** (incl. how to add map data), and removal of the old
  attendance scenario and admin/moderation page.

## Are the suggested measures feasible and helpful?

| Measure                                     | Feasible?                                          | Helpful?                                                            | Notes / caveats                                                                                                                                                          |
| ------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TTS on every page & section                 | Yes — browser Web Speech API, free, on-device      | High — helps low-vision, cognitive, literacy and multitasking users | Voice quality varies by device; no SSML control; long pages need a clear "Stop"; hidden automatically when unsupported                                                   |
| Light/dark, colourblind, text-size settings | Yes — done via CSS variables + `data-*` attributes | High                                                                | Colourblind palettes must be paired with non-colour cues; every status also carries a text label                                                                         |
| Offline map during the event                | Yes — service worker + cached tiles/plan           | High — venues often have weak signal                                | Prototype ships a tiny schematic SVG + "save for offline"; production needs tile + JSON caching                                                                          |
| After-event face rating                     | Yes — one tap, anonymous                           | Good — improves freshness of data                                   | Self-selection bias: treat as a signal, not ground truth                                                                                                                 |
| Community status voting, no moderator       | Yes — done                                         | High — fast, transparent, no bottleneck                             | ==🟠No moderator risks spam/abuse, so we added: fixed choices, length caps, profanity + PII screening, per-device rate limiting, and community flagging with auto-hide== |
| Non-invasive organiser verification         | Yes — work-email magic link or invite code         | High — no documents, low friction                                   | Shared inboxes are a weak point; production should use Council SSO                                                                                                       |
| Attendee privacy (no disability data)       | Yes — needs kept in-browser only                   | High — removes a major trust barrier                                | Reports are screened to strip emails, phone numbers and URLs                                                                                                             |

## Additional accessibility features worth adding

- Forced-colors / Windows High Contrast support (`forced-colors` media query) and an explicit
  reduce-motion toggle (we already respect `prefers-reduced-motion`).
- Dyslexia-friendly font toggle plus letter/line-spacing controls.
- Easy Read and translated summaries of key event information.
- Captions / Auslan for event video; live captions at talks.
- Pictogram or photo support for features (helps cognitive and language needs).
- Minimum 44×44px hit targets and generous spacing for motor impairments.
- Colourblind simulation preview inside Settings.
- Voice input for search; step-free turn-by-turn routing.
- Automated axe-core + Playwright accessibility tests, and manual testing with NVDA, JAWS,
  VoiceOver and TalkBack, targeting WCAG 2.2 AA.

## Known gaps / remaining improvements

- The map is a **schematic SVG prototype**; the production path is MapLibre GL over OpenStreetMap.
- Data lives in an **in-memory store** and resets on restart — needs a database.
- No real auth/session: role is kept in `localStorage` only.
- Offline support is a "save" affordance, not yet a real service worker.
- No automated accessibility tests or CI checks yet.
- No internationalisation.
- Voting is per-request, not per-device — add lightweight device dedupe.
- Event dates are recurring/annual labels, not live listings.

## Next steps (prioritised)

1. Add a **service worker** for true offline use (app shell + plan JSON + map tiles).
2. Add **automated a11y tests** (axe-core + Playwright) to CI, and a WCAG 2.2 AA manual audit.
3. Replace the in-memory store with a **small database** and stricter API validation.
4. Add **forced-colors** and **reduce-motion** toggles plus a dyslexia-friendly font option.
5. Add **Easy Read / translated** summaries for key events.
6. Integrate **MapLibre GL** with cached OSM tiles to replace the schematic map.
7. Add per-device dedupe for community voting.
