# Parramatta Explorer

An accessible event-discovery and access-planning web app for Parramatta. People can find
local events, see what accessibility features each venue actually has (verified, missing, or
needing confirmation), plan a visit before / during / after the event, and report problems or
leave feedback.

Built as a working prototype aligned with City of Parramatta Council's access and inclusion
priorities. See `docs/` for the product idea, responsible-AI statement, data register and risk
register.

## Features

- **Explore** (`/`) — search and category filtering across real City of Parramatta events.
- **Access plans** (`/plan/[eventId]`) — before / during / after view: an interactive map,
  per-feature access cards with provenance, save-for-offline, nearest facilities, and
  after-event feedback.
- **Organiser workspace** (`/organiser/[eventId]`) — access checklist, risk register,
  AI-suggestion review, and publish.
- **Community reports** (`/report`) — report a problem with an event/feature, vote on the
  current status, with anti-abuse screening (no moderator).
- **Sign in** (`/signin`) — attendee (no account needed) or council organiser
  (work-email / invite-code verification).
- **Settings** (`/settings`) — light/dark, colourblind modes, and text size, with a live preview.
- **Guide** (`/guide`) and **About** (`/about`) — onboarding plus data and responsible-AI notes.
- **Text-to-speech** — a "listen" button on every section (Web Speech API).

## Tech stack

- [Next.js 16](https://nextjs.org) — App Router, Turbopack, Cache Components / Partial Prefetching
- React 19 and TypeScript
- Tailwind CSS 4
- [MapLibre GL](https://maplibre.org) with free, keyless OpenStreetMap tiles
  ([OpenFreeMap](https://openfreemap.org)); an offline schematic map is used as a fallback

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

No environment variables or API keys are required.

## Project structure

```
src/
  app/                 App Router routes (pages + API route handlers)
    page.tsx           Explore home
    plan/[eventId]/    Access plan (attendee)
    organiser/[eventId]/  Organiser workspace
    report/ signin/ settings/ guide/ about/
    api/issues/ api/feedback/ api/ai/suggest/
  components/          UI components (PlanView, ExploreView, LiveMap, AccessMap, ...)
  lib/                 Data + domain logic
    events.ts          Event dataset
    data/seed.ts       Seed access plans; getPlan()
    status.ts          Verification-status model and helpers
    community.ts       In-memory issues + feedback store
    moderation.ts      Profanity / PII screening and rate limiting
    reportOptions.ts   Report feature + issue options
    types.ts           Shared domain types
docs/                  Product brief, responsible-AI, data + risk registers
```

## Routes

| Route | Description |
| --- | --- |
| `/` | Explore home — search and browse events |
| `/plan/[eventId]` | Access & inclusion plan (before / during / after) |
| `/organiser/[eventId]` | Organiser workspace |
| `/report` | Community report board |
| `/signin` | Role selection and verification |
| `/settings` | Accessibility settings |
| `/guide` | How to use the app |
| `/about` | Data sources and responsible-AI notes |
| `GET/POST/PATCH /api/issues` | Community issue list / create / vote |
| `GET/POST /api/feedback` | After-event feedback |
| `POST /api/ai/suggest` | AI suggestion review (organiser) |

## Data and map notes

- Events and access plans are seeded from `src/lib/events.ts` and `src/lib/data/seed.ts`.
- Community issues and feedback are stored **in memory** (`src/lib/community.ts`), so they reset
  on redeploy or cold start. A database would be the next step for persistence.
- The map uses MapLibre GL with the free OpenFreeMap "liberty" style. If the device is offline
  (or tiles fail to load), the app falls back to a schematic map so the during-event view still
  works without a signal.

## Accessibility

- Text-to-speech on every section, keyboard-operable controls, and ARIA-labelled regions.
- Light/dark themes, colourblind palettes, and four text sizes — all persisted locally.
- Status is never conveyed by colour alone: every status also has a text label.
- A text list of access features accompanies the map for screen-reader and no-JS use.

See `docs/accessibility-review-and-next-steps.md` for the review and planned improvements.

## Deployment

Deployed on [Vercel](https://vercel.com): https://parramatta-explore.vercel.app

Pushing to `main` triggers a production deployment. The app is a prototype — it is not a
production council service and the data is illustrative.
