# Alarm Thresholds — verity-signal-tracker

Predicted ranges, watch zones, and alarm thresholds for all five pilot signals.
Each signal maps to a tier, owner, and response action when alarming.

---

## Signal Definitions

### boilerplate_rate

**What it measures:** % of BECAUSE fields classified as generic/boilerplate
(non-specific phrases that could apply to any rule)

| Zone | Range | Label |
|------|-------|-------|
| Healthy | ≤ 20% | Within predicted range |
| Watch | 21–35% | Trending toward threshold |
| Alarm | > 35% in any 7-day window | Action required |

**When alarm fires:**
- Tier: 1 — Prompt fix
- Owner: Melanie
- Action: Update contrastive prompts in extraction system prompt; review
  few-shot pool for boilerplate examples; check if new rule domain was
  added without domain-specific prompting
- Latency: Hours

---

### tautology_rate

**What it measures:** % of BECAUSE fields that restate the IF or THEN clause
(detected by > 40% word overlap with rule text)

| Zone | Range | Label |
|------|-------|-------|
| Healthy | ≤ 15% | Within predicted range |
| Watch | 16–25% | Trending toward threshold |
| Alarm | > 25% in any 7-day window | Action required |

**When alarm fires:**
- Tier: 1 — Prompt fix
- Owner: Melanie
- Action: Add explicit anti-tautology instruction to BECAUSE elicitation prompt;
  add "Do not restate the rule" as a scaffold constraint
- Latency: Hours

---

### morgan_match_rate

**What it measures:** % of Morgan's queries that retrieve a rule scored as
relevant by `jordan_relevance_confirmed`

| Zone | Range | Label |
|------|-------|-------|
| Healthy | ≥ 70% | Within predicted range |
| Watch | 55–69% over 50+ queries | Monitor retrieval quality |
| Alarm | < 55% over 50 queries | Action required |

**When alarm fires:**
- Tier: 2 — Embedding fix
- Owner: Hilary
- Action: Review embedding strategy; check if query domain is underrepresented
  in confirmed rules; consider re-indexing with updated `when_embedding` values
- Latency: Days

**Note:** Requires `jordan_relevance_confirmed` to be populated in `decision_log`.
If this field is null, morgan_match_rate cannot be computed — flag as Missing.

---

### quality_composite_mean

**What it measures:** Mean `quality_composite_score` across all confirmed rules
in the measurement window

| Zone | Range | Label |
|------|-------|-------|
| Healthy | ≥ 0.65 | Within predicted range |
| Watch | 0.50–0.64 over 30-rule window | Elicitation quality degrading |
| Alarm | < 0.50 over 30-rule window | Action required |

**When alarm fires:**
- Tier: 1 + UX review
- Owner: Melanie
- Action: Run `because-elicitation-research` for domain-specific scaffolding;
  review contrastive prompt effectiveness; check if Jordan engagement is
  declining (see `jordan_confirmation_rate`)
- Latency: Hours–days

**Compound signal:** If quality_composite_mean alarms alongside
jordan_confirmation_rate declining → check for Jordan fatigue (session
length, rule count per session) before updating prompts.

---

### jordan_confirmation_rate

**What it measures:** % of AI-extracted rule candidates Jordan confirms
(confirms or confirms-with-edit) vs. dismisses

| Zone | Range | Label |
|------|-------|-------|
| Healthy | ≥ 60% | Within predicted range |
| Watch | 40–59% over 50+ candidates | Extraction may be miscalibrated |
| Alarm | < 40% over 50 candidates | Action required |

**When alarm fires:**
- Tier: 1 — Prompt fix
- Owner: Melanie
- Action: Review dismissed candidates for patterns; update EXTRACT_RULE prompt
  to avoid the most common false-positive pattern; check if new ticket types
  are being processed without domain-specific tuning
- Latency: Hours

---

## Multiple Alarms Firing Simultaneously

Priority order when multiple alarms fire:
1. **Tier 1 first** (hours) — address prompt before embedding
2. **Tier 2 second** (days) — retrieval fix after prompt is stable
3. Never let retrieval work block prompt work
4. Log all alarms simultaneously — don't wait to log Tier 2 until Tier 1 is resolved

---

## Pre-Pilot Readiness Gates

Before the first pilot session, confirm these fields exist and are being written:

| Field | Table | Owner | Status check |
|-------|-------|-------|--------------|
| `quality_composite_score` | `rules` | Hilary | Must be written at Jordan's confirmation event |
| `morgan_query_text` | `decision_log` | Hilary | Must be written at every Morgan query event |
| `jordan_relevance_confirmed` | `decision_log` | Hilary | Must be written after Jordan's relevance review |

If any field is missing → create a `blocker` Jira ticket in DEV immediately.
Labels: `schema`, `hilary-owns`, `blocker`, `board-08`.

---

## Signal Log Format

Append to Notion Session Log after every tracker run:

```
| [date] | boilerplate:[X%] tautology:[X%] match:[X%] quality:[X] confirm:[X%] | [alarm count] | [tier(s)] |
```

Healthy run example:
```
| 2026-03-15 | boilerplate:12% tautology:8% match:74% quality:0.71 confirm:68% | 0 alarms | — |
```

Alarm run example:
```
| 2026-03-22 | boilerplate:38% tautology:11% match:72% quality:0.69 confirm:65% | 1 alarm | T1 — Melanie |
```

---

*alarm-thresholds v1 · March 15, 2026*
