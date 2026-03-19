---
name: elicitation-eval-loop
description: >
  Tests BECAUSE elicitation UI sketches from elicitation-ui-lab against
  synthetic personas before real users see them. Runs each sketch through
  Jordan, Alex, Morgan, Sam, and Riley in simulated scenarios and scores
  them on reasoning quality, completion rate, and engagement. Produces a
  pass/fail verdict with a revision recommendation. Use this skill whenever
  Melanie says anything like: "run the eval loop", "test this sketch", "would
  Jordan do this", "synthetic persona test", "pre-user eval", "does this hold
  up", "score this design", or any variation of wanting to pressure-test an
  elicitation UI pattern before piloting it with real users. Always runs after
  elicitation-ui-lab produces a new sketch — treat it as the mandatory next
  step before promoting any sketch to Prototyped status.
---

# elicitation-eval-loop — v1

Layer 3 of the Six-Layer System. Tests elicitation UI sketches against
synthetic personas to catch failure modes before real users encounter them.

**Runs after:** `elicitation-ui-lab` produces a sketch
**Feeds into:** `verity-evidence-brief` (Layer 4) if scores are strong
**Source personas:** See `references/synthetic-personas.md`
**Scoring rubric:** See `references/eval-rubric.md`

---

## What it does

Takes one sketch from elicitation-ui-lab (or a sketch described in
conversation) and runs it through 3–5 synthetic persona simulations.
Each simulation asks: would this persona complete the BECAUSE field, and
would the reasoning be any good?

Outputs: per-persona verdict, composite score, top failure mode, revision
recommendation.

---

## Session format

### Step 1 — Load the sketch

Either:
- Pull the most recent sketch from Notion Elicitation Lab (Status = Prototyped)
- Or accept a sketch described in conversation

Confirm sketch name and the interaction mechanism being tested.

### Step 2 — Select personas

Default: run Jordan + one of [Alex, Morgan, Sam] based on sketch purpose.
- BECAUSE authoring sketches → Jordan (primary) + Alex (secondary)
- Rule consumer sketches → Morgan (primary) + Riley (secondary)
- Dashboard/summary sketches → Sam (primary) + Jordan (secondary)

Full persona profiles in `references/synthetic-personas.md`.

### Step 3 — Run simulations

For each selected persona, simulate:

1. **First encounter** — Does the persona understand what's being asked?
   Score 0–2: 0 = confused, 1 = uncertain but proceeds, 2 = immediately clear

2. **Completion attempt** — Does the persona fill in the BECAUSE field?
   Score 0–2: 0 = skips, 1 = fills with boilerplate, 2 = genuine reasoning

3. **Reasoning quality** — If completed, is the reasoning useful?
   Score 0–2: 0 = tautology/generic, 1 = partially specific, 2 = defensible + specific

Per-persona max: 6 pts. Flag any score below 4 as a failure.

### Step 4 — Score and verdict

**Composite score:** average per-persona score / 6

| Range | Verdict |
|-------|---------|
| 0.80–1.0 | ✅ Pass — promote to pilot |
| 0.60–0.79 | ⚠️ Conditional — minor revision before pilot |
| < 0.60 | ❌ Fail — return to elicitation-ui-lab |

### Step 5 — Output

```
Sketch: [name]
Personas tested: [list]
Composite score: [X/6 = Y%]
Verdict: [Pass / Conditional / Fail]

Per-persona breakdown:
  Jordan: [score] — [one-line note]
  [Persona 2]: [score] — [one-line note]

Top failure mode: [one sentence]
Revision recommendation: [one sentence, or "none needed"]
```

### Step 6 — Update Notion

Update the sketch's page in Elicitation Lab (DB: `f2cdce94-4b22-48aa-94a3-de602bccdfc6`):
- Add eval score and verdict to page content
- If Pass: Status → Pilot Ready
- If Fail: Status → Needs Revision, add revision note

---

## Design constraints

- Never auto-generate BECAUSE field content even in simulation
- Personas simulate behavior, not opinion — report what they'd *do*, not what they'd *think*
- A passing sketch must clear Jordan. Her score alone cannot be below 4/6.

---

*elicitation-eval-loop v1 · March 15, 2026*
