---
name: verity-signal-tracker
description: >
  Captures whether Verity's pilot predictions held and alarms on divergence.
  Compares predicted metric ranges against observed pilot data across five
  signals (boilerplate_rate, tautology_rate, morgan_match_rate,
  quality_composite_mean, jordan_confirmation_rate), determines which alarms
  are firing, and routes each alarm to the correct response tier. Use this
  skill whenever Melanie says anything like: "check the signals", "are our
  predictions holding", "run the signal tracker", "is anything diverging",
  "pilot health check", "compare predicted vs observed", "what's alarming",
  "signal check", or any variation of wanting to know whether the pilot is
  behaving as expected. Also runs automatically when pilot-observation-router
  classifies a finding — signal-tracker provides the baseline context for
  whether the signal is an anomaly or a known divergence.
---

# verity-signal-tracker — v1

Layer 5 of the Six-Layer System. Compares predicted pilot metric ranges
against observed data and alarms on divergence. The signal log is the
source of truth for whether the pilot is healthy.

**Runs after:** Any pilot session that produces metric data
**Feeds into:** `model-feedback-protocol` (Layer 6) when alarms fire;
`verity-evidence-brief` (Layer 4) when signals are healthy
**Thresholds:** See `references/alarm-thresholds.md`

---

## What it does

Takes observed pilot metrics, compares them against predicted ranges, and
produces a signal health report. Healthy signals → evidence brief.
Alarming signals → model-feedback-protocol routing.

---

## Session format

### Step 1 — Collect observed metrics

Ask for or pull from context:

```
boilerplate_rate:          [%]
tautology_rate:            [%]
morgan_match_rate:         [%]
quality_composite_mean:    [0-1]
jordan_confirmation_rate:  [%]
```

Also collect: date range, rule count, tenant ID if available.

### Step 2 — Load thresholds

Read `references/alarm-thresholds.md` for the predicted ranges and
alarm thresholds for each signal.

### Step 3 — Compare and flag

For each signal, determine status:

| Status | Symbol | Meaning |
|--------|--------|---------|
| Healthy | ✅ | Within predicted range |
| Watch | 🟡 | Approaching threshold — monitor |
| Alarm | 🔴 | Crossed threshold — action required |
| Missing | ⚪ | Metric not collected — note gap |

### Step 4 — Produce signal report

```
Signal Health Report — [date range]
Rules in window: [N]

✅ / 🟡 / 🔴  boilerplate_rate:          [X%] (predicted: < 20%, alarm: > 35%)
✅ / 🟡 / 🔴  tautology_rate:            [X%] (predicted: < 15%, alarm: > 25%)
✅ / 🟡 / 🔴  morgan_match_rate:         [X%] (predicted: > 70%, alarm: < 55%)
✅ / 🟡 / 🔴  quality_composite_mean:    [X]  (predicted: ≥ 0.65, alarm: < 0.50)
✅ / 🟡 / 🔴  jordan_confirmation_rate:  [X%] (predicted: > 60%, alarm: < 40%)

Overall: [All Healthy / N alarm(s) firing]
```

### Step 5 — Route alarms

For each 🔴 alarm:
- State the tier (from `references/alarm-thresholds.md`)
- State the owner
- State the recommended action
- Create a Jira ticket via Atlassian MCP if Tier 1 or 2

For 🟡 watch signals: log only, no ticket. Note the trend direction.

### Step 6 — Append to signal log

Append one row to the Notion signal log (Scratchpad, Session Log page):

```
| [date] | [all 5 metrics] | [alarm count] | [tier(s) triggered] |
```

### Step 7 — Hand off

- If any alarm fires → trigger `model-feedback-protocol` (Layer 6)
- If all healthy → trigger `verity-evidence-brief` (Layer 4) with current metrics

---

## Pre-pilot mode

Before pilot launch, no observed data exists. In pre-pilot mode:
- Report all signals as ⚪ Missing
- Confirm whether the three pre-pilot schema fields are in place:
  - `quality_composite_score` on `rules` table
  - `morgan_query_text` on `decision_log`
  - `jordan_relevance_confirmed` on `decision_log`
- If any field is missing → create a blocker ticket in DEV

---

*verity-signal-tracker v1 · March 15, 2026*
