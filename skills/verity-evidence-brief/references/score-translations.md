# Score Translations — verity-evidence-brief

Maps raw quality metrics to buyer/investor language by range.
Read this before writing any section of the evidence brief.

---

## quality_composite_score (0–1.0)

Overall BECAUSE reasoning quality across confirmed rules.

| Score | Internal label | Buyer language | Investor language |
|-------|---------------|----------------|-------------------|
| ≥ 0.80 | Excellent | "Your team's reasoning is thoroughly captured — each rule carries the specific context that makes AI behavior defensible" | "Quality composite above 0.80 — BECAUSE fields are specific, non-generic, and auditable. This is the condition required for the data flywheel to operate." |
| 0.65–0.79 | Good | "The majority of rules contain strong reasoning — a small portion still need refinement" | "Quality composite in the 0.65–0.80 range — strong baseline, room for prompt calibration" |
| 0.50–0.64 | Marginal | "Reasoning quality is mixed — some rules are ready to govern AI behavior, others need Jordan's attention" | "Quality below threshold — elicitation scaffolding needs adjustment before this corpus can reliably govern inference" |
| < 0.50 | Poor | Do not use quality language — address the problem first | "Below acceptable threshold — not ready for investor narrative. Fix prompt layer." |

---

## jordan_confirmation_rate (%)

% of AI-extracted rule candidates Jordan confirms.

| Rate | Buyer language | Investor language |
|------|----------------|-------------------|
| ≥ 70% | "Jordan is actively confirming the system's suggestions — the AI extraction is well-calibrated to your team's actual practice" | "70%+ confirmation rate signals extraction accuracy. Jordan's time is being spent on reasoning, not rejection." |
| 50–69% | "About half of AI suggestions match Jordan's judgment — normal at this stage as the system learns your domain" | "Confirmation rate in 50–70% range — expected in early calibration. Watch for trend direction." |
| < 50% | "The AI extraction needs calibration — Jordan is spending time rejecting candidates rather than confirming them" | "Below 50% confirmation — Tier 1 prompt fix required. Do not present this metric externally." |

---

## because_completion_rate (%)

% of confirmed rules that have a non-null BECAUSE field.

| Rate | Buyer language | Investor language |
|------|----------------|-------------------|
| ≥ 85% | "Nearly all of your confirmed rules carry Jordan's reasoning — they're ready to govern AI behavior" | "85%+ BECAUSE completion — the confirmation model is working. Each confirmed rule is AI-eligible." |
| 70–84% | "Most rules have reasoning attached — a small queue still needs Jordan's attention" | "70–85% BECAUSE completion — functional but not optimal. Watch if it trends down." |
| < 70% | Do not use "high adoption" language | "Below 70% — BECAUSE elicitation needs UX attention before this can be framed as governance." |

---

## coverage_rate (%)

% of active CS scenarios (from `domain_policy`) with at least one confirmed rule.

| Rate | Buyer language | Investor language |
|------|----------------|-------------------|
| ≥ 60% | "The majority of your team's common scenarios now have a confirmed rule — the foundation for consistent AI behavior is in place" | "60%+ coverage — meaningful governance surface. Enough rules to demonstrate the flywheel." |
| 30–59% | "Coverage is growing — about [X]% of your team's known scenarios have a confirmed rule so far" | "Coverage in 30–60% range — early but meaningful. Show the trend, not the absolute." |
| < 30% | "Early stage — the library is being populated. Coverage will grow as Jordan confirms more rules" | "Below 30% — too early to use coverage as an investor signal. Use rule count + quality instead." |

---

## boilerplate_rate (%)

% of BECAUSE fields flagged as generic/boilerplate.

| Rate | Action |
|------|--------|
| ≤ 15% | Safe to use quality language in all sections |
| 16–25% | Note in brief: "A small portion of BECAUSE fields are still generic — elicitation scaffolding will address this" |
| > 25% | Do not use "high quality" language. Flag as: "Boilerplate rate above threshold — Tier 1 prompt fix required before this corpus represents governed AI behavior" |

---

## Compound signals (use when multiple metrics are available)

**Strong corpus signal (use in investor section):**
- quality_composite ≥ 0.75 AND because_completion ≥ 80% AND boilerplate ≤ 20%
- Language: "The corpus shows the hallmarks of a governed rule library — high reasoning quality, high completion, low boilerplate. This is the data condition that makes the BECAUSE field a moat, not a feature."

**Coverage + quality signal (use in Sam section):**
- coverage ≥ 50% AND quality_composite ≥ 0.70
- Language: "More than half of your common scenarios are now governed by rules that carry Jordan's reasoning. When your AI agent faces those scenarios, it's running on your team's judgment, not a generic model."

---

*score-translations v1 · March 15, 2026*
