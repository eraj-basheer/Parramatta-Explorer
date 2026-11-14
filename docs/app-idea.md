# AccessReady Parramatta — App Idea One-Pager

**Challenge:** City of Parramatta, Parramatta Possibilities — Challenge 2 (PS-07 / PS-08 / PS-09)
**Working name:** AccessReady Parramatta
**Status:** Prototype concept · **Date:** 11 November 2026

## The idea in one sentence

> A verified, offline-capable **Access & Inclusion Plan** for a specific Parramatta event — telling a person with an access need exactly what is **confirmed, missing or needs checking**, and the assistance pathway, before they leave home — produced by the same readiness workflow an organiser uses to plan the event.

## The problem

Parramatta runs major events, but access conditions are scattered across unrelated websites, stale, or missing. "Accessible" is often claimed without evidence. A wheelchair user cannot reliably answer "can I get there, get in, and use a toilet?" before leaving home — and organisers have no single workflow to check their event against real access needs.

## Primary user (one group)

A **wheelchair / mobility-aid user** attending a specific Parramatta event.
*Secondary actors (not user groups):* the **event organiser** (builds the plan) and the **Council access officer** (verifies it).

## The one workflow (one object, two faces)

- **Organiser face — "Readiness check":** a checklist across **mobility, sensory, cognitive, language, cultural, family and digital-access** needs. Every item is set to **verified / known / missing / requires confirmation**. AI drafts the risk register and flags gaps; a **human approves**.
- **Attendee face — "Before / during / after journey":** before = the verified plan and assistance pathway; during = nearest accessible toilet, quiet space, entrance, live-ish status, report-a-problem; after = one-tap "did this match reality?" that feeds verification.
- **The loop:** report → append-only history → moderation → confidence decay → re-verify. Nothing is a dead end.

## What AI does (and the human gate)

AI **structures messy text into access attributes**, **retrieves requirements** from approved Council documents, and **drafts the PS-09 risk register and PS-07 attendance/resource scenario**. Every AI output is labelled **"AI-suggested — requires human confirmation"** and **cannot be published without an approver recorded**. See `docs/responsible-ai-statement.md`.

## Evidence & data

Public and licensed data (OpenStreetMap, TfNSW Open Data, Council published info and strategies), participant-created corrections, and **clearly labelled synthetic** attendance data. Every fact carries **source, date, status and freshness**. See `docs/data-register.csv` and `docs/data-quality-log.md`.

## Council alignment

- **PS-08 (primary):** readiness checklist across all seven need dimensions, distinguishing verified info from assumptions.
- **PS-09:** human-approved risk register (likelihood, consequence, control, role, escalation trigger, residual).
- **PS-07:** attendance/resource **scenario range** (not a point prediction).
- **PS-04/05/06 (linked):** surfaces missing info early; feeds operational load; reports access outcomes.
- Aligns to the **Disability Inclusion Action Plan**, **Major Events and Festivals Strategy 2025–2030**, **Smart City & Innovation Strategy** and **Parramatta Ways**.

## Council boundary

**Partner** (Council hosts the workflow and owns verified data) · **Facilitate** (distribute the plan via event channels) · **Advocate** (for access conditions Council does not control — station lifts, private venues — the tool emits an advocacy brief to TfNSW or the venue owner).

## Success measure

A participant can identify **access conditions, journey options and an assistance pathway without searching across multiple unrelated websites** — and can tell what is verified versus unconfirmed.

## What it is not

Not an event calendar, not a trip planner, not a review site, not a crowd-monitoring or facial-recognition tool.

---

## Future expansion — how the same app grows to new needs and use cases

The core insight is that AccessReady is **not a wheelchair app**. It is a **"need profile × verified attribute set × honest status" engine**. Mobility is simply the first need profile. Expansion is therefore additive — new need profiles and new places reuse the same data model, trust loop and AI-with-human-approval pattern. **Nothing needs to be rebuilt; new modules are plugged in.**

### The expansion model (why this scales)

- **Need profile** → selects which attributes, checklist items and filters surface. Adding a need = adding an **attribute set + checklist module**, not a new app.
- **Feature/attribute model** → any place or service is a set of typed features (`entrance`, `toilet`, `quiet_space`, `hearing_loop`, `changing_table`, `parking_bay`, …) with structured attributes and a status.
- **Trust loop** → the same verified/missing/requires-confirmation, provenance, decay, report and moderation rails apply to every new dataset.
- **One AI pattern** → structure text, retrieve requirements, draft suggestions, **human approves** — reused for every new need.

### Phase 1 — More needs (same place: events)

Add need profiles one at a time, each as a checklist module and attribute set:

| Need profile | New attributes / checklist items |
|---|---|
| **Sensory / neurodivergent** | quiet spaces, crowd-level estimate, noise & lighting notes, predictable route |
| **Deaf / hard of hearing** | hearing loop, Auslan interpreter schedule, captions / live transcript, visual alerts, text support |
| **Parents with young children** | changing-table type & location, pram-friendly paths, family/feed rooms, pram parking |
| **Low vision / blind** | tactile paving, audio turn-by-turn, high-contrast and large-type plan, text directions |
| **Cognitive / low digital literacy** | simplified plan, plain language, phone fallback, step-by-step text |
| **Language / cultural** | human-reviewed key info in top languages, RTL, multilingual support contacts, cultural/faith needs |
| **Transport-confidence** | accessible stops, wheelchair boarding, last-mile confidence, assistance meeting points |

### Phase 2 — More places (same needs)

The plan object generalises from "event" to "**place or service**": everyday venues (libraries, pools, parks, community centres), precincts, and **permanent** accessibility (not just event-day). Indoor venue maps and live facility feeds (lifts, accessible toilets) are added as data sources, not new products.

### Phase 3 — More audiences and network effects

- **Two-sided growth:** more organisers publish plans → more attendees trust the app → more reports → better data.
- **Assistance requests & bookings:** request a spot, an interpreter, a Changing Place key, or staff assistance.
- **Community action:** printable plans, QR story trails, in-person hosts — the low-tech + digital activation Council suggests.

### Phase 4 — More councils and open data

- **White-label** the same engine for other LGAs; **federate** verified records between councils.
- **Open API / partnership:** expose verified access data to event platforms, map providers and trip planners so access information reaches people wherever they already look.
- **Advocacy at scale:** aggregate verified gaps (e.g. broken lifts, missing Changing Places) into evidence for state and federal advocacy.

### What stays constant (the invariants)

1. **Honest status** — verified / missing / requires confirmation, always visible.
2. **Provenance & freshness** on every fact.
3. **Human accountability** — AI suggests, a person approves.
4. **Containment & correction** — wrong data can be removed, corrected, suspended and reviewed.
5. **Accessible by default** — the app itself meets WCAG 2.2 AA.
6. **Need-based, not label-based** — users pick what they need, not what they "are."

> Expansion is not a redesign. It is the same engine pointed at more needs, more places and more partners — which is what makes a small pilot credible as the start of a city-wide (and eventually multi-council) capability.
