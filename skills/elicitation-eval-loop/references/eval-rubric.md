# Eval Rubric — Elicitation Eval Loop

Scoring dimensions for BECAUSE elicitation UI sketches.
Used in Step 3 of `elicitation-eval-loop`.

---

## Per-Persona Scoring (0–6 per persona)

### Dimension 1: First Encounter Clarity (0–2)

Does the persona understand what the interface is asking them to do?

| Score | Description |
|-------|-------------|
| 2 | Immediately clear — no re-reading, no hesitation |
| 1 | Uncertain — reads twice, proceeds with mild confusion |
| 0 | Confused — would click away, ask for help, or abandon |

**Common failure signal:** Interface assumes domain knowledge the persona doesn't have.

---

### Dimension 2: Completion Attempt (0–2)

Does the persona actually fill in the BECAUSE field?

| Score | Description |
|-------|-------------|
| 2 | Completes without hesitation |
| 1 | Completes but with friction (multiple restarts, hedging) |
| 0 | Skips or submits without completing |

**Common failure signal:** Prompt is too open-ended ("Why does this exist?") — triggers boilerplate reflex.

**Contrastive prompts score 2 reliably** when tested with Jordan:
- "What would go wrong if this rule didn't exist?"
- "What case does this rule handle that the next-closest rule doesn't?"
- "What does someone need to know to apply this correctly?"

---

### Dimension 3: Reasoning Quality (0–2)

If the persona completed the field, is the reasoning actually useful?

| Score | Description |
|-------|-------------|
| 2 | Defensible and specific — cites a case, a consequence, or a context |
| 1 | Partially specific — some detail, but still mostly generic |
| 0 | Tautology or boilerplate — restates the rule, or generic filler |

**High-quality BECAUSE markers (from `knowledge-extraction-failure-modes-v1.md`):**
- Contains a specific customer type, edge case, or exception
- References a consequence if the rule is violated
- Cannot be copy-pasted to a different rule without modification
- Would survive the "challenge" question: "What if someone argued the opposite?"

**Tautology detection:**
If BECAUSE field contains > 40% of the same words as the IF or THEN clause → score 0.

---

## Composite Score Interpretation

**Formula:** Sum of all per-persona scores / (6 × number of personas tested)

| Range | Verdict | Action |
|-------|---------|--------|
| 0.80–1.0 | ✅ Pass | Promote sketch to Pilot Ready in Notion Elicitation Lab |
| 0.60–0.79 | ⚠️ Conditional | Revise the lowest-scoring dimension before piloting |
| < 0.60 | ❌ Fail | Return sketch to elicitation-ui-lab with specific revision note |

**Hard rule:** Jordan's individual score cannot be below 4/6 regardless of composite.
Jordan is the primary author — if the sketch fails her, it fails, period.

---

## Known Failure Mode Patterns

These patterns consistently produce low scores. Flag immediately if observed:

| Pattern | Dimension | Fix |
|---------|-----------|-----|
| Open-ended "why" prompt | Completion (D2) | Replace with contrastive prompt |
| BECAUSE field pre-filled with AI suggestion | Quality (D3) | Remove — violates BECAUSE boundary |
| Rule text repeated in BECAUSE | Quality (D3) | Add structural hint ("What edge case?") |
| No visual distinction between IF/THEN/BECAUSE | Clarity (D1) | Increase visual hierarchy |
| BECAUSE field optional in UI | Completion (D2) | Make required or add gate |
| Session > 8 rules | All dimensions | Cap session or add break prompts |

---

*eval-rubric v1 · March 15, 2026*
