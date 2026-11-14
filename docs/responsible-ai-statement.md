# Responsible AI Statement — AccessReady Parramatta

**Challenge:** City of Parramatta, Parramatta Possibilities — Challenge 2 (PS-07 / PS-08 / PS-09)
**Date:** 11 November 2026 · **Status:** Prototype

## 1. Tool and purpose

AccessReady uses an AI assistant to help an event organiser turn messy, scattered information into a **verified access & inclusion plan**. Specifically, AI is used to:

1. **Structure unstructured text into access attributes** — convert venue pages, organiser notes and public documents into structured fields (e.g. `step_free`, `door_width_cm`, `ramp`, `surface`, `changing_table_type`, `hearing_loop`, `quiet_space`) with a confidence score and provenance for each.
2. **Retrieve requirements** from approved public Council documents (Disability Inclusion Action Plan, Major Events and Festivals Strategy, Smart City and Innovation Strategy) to surface what an organiser may have missed.
3. **Draft a risk register** (PS-09) and an **attendance/resource scenario range** (PS-07).
4. **Summarise a plain-language assistance pathway** for the attendee.

## 2. Human oversight (the decision point)

- AI output is **never published automatically**. Every AI-generated attribute, risk and scenario is labelled **"AI-suggested — requires human confirmation."**
- An **event organiser or Council access officer must explicitly approve or reject** each AI suggestion before it appears on the published plan.
- The prototype records **who approved what, and when** (append-only). If AI is unavailable, the workflow still functions with manual entry.

## 3. What AI must never do

- It must **not** make a consequential decision autonomously (no auto-publishing, no automatic risk acceptance).
- It must **not** assert that a venue is accessible without human verification.
- It must **not** process personal information, faces, number plates, precise household locations or sensitive attributes.
- It must **not** machine-translate safety-critical access content without human review.

## 4. Known risks and mitigations

| Risk | Mitigation |
|------|------------|
| Hallucinated or over-confident access claims | AI fields start **unverified**; only human approval flips them to **verified** |
| Bias / uneven coverage across suburbs, languages, abilities | Coverage is **reported, not hidden**; "unverified" is a first-class, visible state |
| Poor or outdated source data producing unreliable output | Provenance + freshness on every field; **confidence decays** with age |
| Unsafe machine translation | Human-reviewed access content; translation limited to UI strings; RTL support |
| Uneven impacts across languages, ages, abilities, digital access | Bias testing across need profiles; accessible-by-default UI (WCAG 2.2 AA) |

## 5. Containment and correction

Any record or AI output can be **removed, corrected, suspended and reviewed**. The prototype uses append-only version history, a moderator queue, a revert function and a user **report-a-problem** loop. Wrong data is correctable, not permanent.

## 6. Transparency

- Every published fact shows **source, date, verification status and freshness**.
- AI involvement is **disclosed** in the UI and in this statement.
- Observed facts are visually and structurally **separated from AI suggestions and assumptions**.
- The tool clearly states it is **best-effort and community-verified, not a substitute for official venue information**, and is **not endorsed, funded or procured by Council**.

## 7. Data handled

Only public, licensed or participant-created data, plus clearly labelled synthetic data. No personal information beyond what is minimally required for moderated edits. See `docs/data-register.csv` and `docs/data-quality-log.md`.
