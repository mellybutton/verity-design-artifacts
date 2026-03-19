---
name: verity-evidence-brief
description: >
  Translates Verity quality scores and pilot metrics into investor and buyer
  language. Takes raw data (quality_composite_score, confirmation rates,
  BECAUSE completion rates, coverage percentages) and produces a one-page
  evidence brief framed for three audiences: Sam (CEO buyer), investor
  (Flybridge / PearX), and CS Director (operational buyer). Use this skill
  whenever Melanie says anything like: "turn these scores into investor
  language", "evidence brief", "what do these numbers mean to a buyer",
  "translate the pilot data", "how do I talk about quality", "make the data
  investor-ready", "buyer brief from pilot metrics", or any variation of
  wanting to convert internal product metrics into external narrative.
  Also runs automatically after verity-signal-tracker produces a healthy
  signal report that includes quality scores.
---

# verity-evidence-brief — v1

Layer 4 of the Six-Layer System. Translates internal quality scores into
investor and buyer language — the bridge between product measurement and
external narrative.

**Runs after:** `verity-signal-tracker` (Layer 5) produces metrics, OR
after any pilot session with quality data
**Feeds into:** Investor conversations, discovery call follow-ups, Sam's dashboard narrative
**Score translations:** See `references/score-translations.md`

---

## What it does

Takes one or more quality metrics and produces a one-page brief with three
audience-specific framings. No metric stands alone — every number gets a
"so what" statement appropriate to the reader.

---

## Session format

### Step 1 — Collect the metrics

Ask for or pull from context:
- `quality_composite_score` (0–1.0) — overall BECAUSE quality
- `jordan_confirmation_rate` (%) — how often Jordan confirms candidates
- `because_completion_rate` (%) — how often confirmed rules have a BECAUSE
- `coverage_rate` (%) — % of active CS scenarios with a confirmed rule
- `boilerplate_rate` (%) — % of BECAUSE fields flagged as generic
- Session date range and rule count

If any metric is missing, proceed with what's available and note the gap.

### Step 2 — Load translations

Read `references/score-translations.md` to get the appropriate language
for each metric range before writing.

### Step 3 — Produce the brief

Output three sections, each written for a different reader:

**Section A — For Sam (CEO / Buyer)**
- 3–4 sentences max
- Frame around: defensibility, coverage, team knowledge vs. AI risk
- Avoid technical metric names — translate to outcomes
- End with one forward-looking statement

**Section B — For Investor**
- 5–6 sentences
- Frame around: evidence of behavior change, moat signal, data flywheel
- Include at least one specific number
- Reference the BECAUSE boundary as the trust primitive
- Connect to the "why now" argument if scores are strong

**Section C — For CS Director (Operational Buyer)**
- 4–5 sentences
- Frame around: Jordan's adoption rate, quality trend, rule lifecycle
- Mention attribution and drift detection as retention/trust signals
- Include what a low score would mean (risk of generic AI behavior)

### Step 4 — Flag gaps

After the brief, one line per missing metric:
> ⚠️ `coverage_rate` not available — omitted from Sam section. Collect before next investor meeting.

---

## Constraints

- Never round up scores — use actual numbers
- Never claim a metric is "strong" without the threshold from score-translations.md
- If `because_completion_rate` < 70%, do not use "high adoption" language
- If `boilerplate_rate` > 25%, do not use "high quality" language — flag instead

---

*verity-evidence-brief v1 · March 15, 2026*
