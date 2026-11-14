# Data Cleaning & Quality Log — AccessReady Parramatta

Every dataset used must state: **source and date, unit of analysis, geographic coverage, cleaning/transformations, missing or biased groups, at least one human validation step, AI disclosure, and a separation of observed facts from assumptions.**

## Quality gate

> **Never display an unlabelled assertion.** Every fact shown to a user carries:
> - `source` (e.g. OpenStreetMap, Council page, participant report)
> - `last_verified_at` (date)
> - `status` ∈ { `verified`, `missing`, `requires_confirmation` }
> - `confidence` (decays with age)

## Log

| # | Dataset | Issue found | Cleaning action | Transformation | Records in → out | Notes | Date |
|---|---------|-------------|-----------------|----------------|------------------|-------|------|
| 1 | OpenStreetMap (Overpass) | Duplicate elements for the same entrance | Deduplicated by name + proximity (< 8 m) | Normalise units to cm / percent | 41 → 33 | Manual review queue for near-matches | 2026-11-11 |
| 2 | OpenStreetMap | Missing `surface` / `kerb` tags on paths | Retained as `missing` (not inferred) | None — flagged for confirmation | 33 → 33 | Missing is shown, not guessed | 2026-11-11 |
| 3 | OpenStreetMap | Inconsistent place names ("Parramatta Sq", "Parramatta Square") | Standardised to canonical venue names | Name normalisation map | 33 → 33 | Documented alias list | 2026-11-11 |
| 4 | TfNSW Open Data | Stop names differ from venue names | Conflated by geospatial proximity to venue | Join on nearest accessible stop | 12 → 9 | Manual review for ambiguous matches | 2026-11-11 |
| 5 | Council event info | Not machine-readable | Transcribed manually for the demo event | Structured event record | 1 → 1 | Attribution recorded | 2026-11-11 |
| 6 | Synthetic attendance | No real Council attendance data | Created plausible range from published event scale | Range (low/expected/high) not a point | n/a | **Clearly labelled dummy** | 2026-11-11 |
| 7 | All imports | No timestamps on source rows | Stamped `last_verified_at` = import date | Timestamp added | all | Enables confidence decay | 2026-11-11 |

## Unit of analysis

One **accessibility attribute of one feature** (e.g. "Riverside Theatres — main entrance — step-free: verified").

## Geographic coverage

Parramatta CBD event precinct (illustrative). Outside this area, data is explicitly shown as **not covered**.

## Missing / biased groups (stated honestly)

- **Sensory and cognitive** access data is the weakest — rarely published, so mostly `requires_confirmation`.
- **Private venues** may be under-represented because data is not open.
- **Language**: only UI strings are translated; access content is English unless human-reviewed.
- **Digital access**: the app requires a smartphone; a phone-fallback number is provided.

## Human validation

- At least one field verification or organiser confirmation per published plan.
- Co-design / user test session with a person with an access need (logged in the submission).

## AI disclosure

AI assists with structuring text, drafting the risk register and scenario range. All AI output is labelled **"AI-suggested — requires human confirmation"** and cannot be published without approval. See `docs/responsible-ai-statement.md`.
