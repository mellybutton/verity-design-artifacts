---
name: elicitation-challenger
description: >
  Introduces adversarial challenge to any artifact in the elicitation loop
  and produces a balanced synthesis from all previous learnings. Takes a
  prototype or idea, re-enters the loop at Step 1 using either (A) adversarial
  synthetic personas not in the primary eval set — Darnell (AI skeptic),
  Priya (over-truster), Carlos (low tenure), Hyun (VP, low patience) — or
  (B) a conflicting research tradition that makes competing predictions about
  the mechanism. Produces a Synthesis Position that integrates all challenge
  rounds without discarding prior learnings. Use when Melanie says: "run the
  challenger", "stress test with different users", "what does opposing research
  say", "dialectical test", "iterate with conflict", "adversarial pass",
  "what would a skeptic think", or any variation of wanting to test an artifact
  against inputs it wasn't designed for. Never replaces the original — appends
  challenger rounds and a synthesis position. Rounds accumulate over time,
  building an iteration history on high-value artifacts.
---

# elicitation-challenger — v1

**Layer 7 of the Six-Layer System.** Takes any artifact from the loop, re-enters
at Step 1 using either adversarial synthetic personas or competing/conflicting
research, and produces a balanced synthesis that holds all prior rounds in view.

**Triggers on:** "run the challenger", "stress test with different users",
"what does opposing research say", "challenger loop", "dialectical test",
"iterate with conflict", "adversarial pass", "what would a skeptic think",
"what does the conflict say", "challenge this design"

**Runs after:** `elicitation-eval-loop` has scored the target artifact at least once
**Feeds into:** `elicitation-ui-lab` (if synthesis recommends redesign) or
`verity-evidence-brief` (if synthesis confirms design under challenge)

---

## What it does

The loop so far produces refinements that optimize along one research axis —
whatever finding kicked off the original `because-elicitation-research` session.
The challenger introduces a second axis: either a different user population
(adversarial personas) or a research tradition that makes competing predictions.

Output is NOT a replacement. It's a synthesis — a design position that integrates
all rounds, labeled with what it's trading off. Every prior round stays visible.

---

## Two challenge modes

### Mode A — Adversarial Personas

Use when: the original eval scored well with Jordan/Alex/Morgan but the design
may be over-fitted to a particular user type or organizational context.

**Challenger persona set:**

| Persona | Role | Attitude | Key failure mode to test |
|---------|------|----------|--------------------------|
| **Darnell** | CS Lead, 40-person team | AI skeptic — resents tool overhead | Does the friction pattern read as red tape? |
| **Priya** | Implementation Manager | Over-truster, high automation comfort | Does she shortcut reasoning in a way Morgan wouldn't? |
| **Carlos** | CS Rep, 6 months tenure | Low ownership, missing context | Does the design assume more than he knows? |
| **Hyun** | VP Customer Success | Strategic, low patience for micro-tasks | Does the prompt feel beneath her? |

Run the same eval rubric from `elicitation-eval-loop`:
1. First encounter: 0–2
2. Completion attempt: 0–2
3. Reasoning quality: 0–2

Per-persona max: 6 pts. Use 2 personas per session (most relevant to the artifact).

### Mode B — Conflicting Research

Use when: the original design is strongly grounded in one research tradition
and iteration is feeling directionally confident.

**Conflicting research pairings:**

| Primary domain (loop research) | Conflicting domain | Tension |
|---|---|---|
| Friction design — resistance preserves reasoning | Cognitive Load Theory — excess friction degrades performance | Is this friction generative or just expensive? |
| Self-explanation effect — generating reasoning improves quality | Testing effect — retrieval > generation for durable learning | Should BECAUSE be written or recalled? |
| Accountability / named reader chips | Audience effect — social evaluation anxiety impairs performance | Does naming the reader help Jordan or make her freeze? |
| Deliberate practice — effortful engagement sustains quality | Expertise reversal effect — scaffolding hurts experts | As Jordan becomes expert, does the prompt become a hindrance? |
| Reflection prompts as learning intervention | Action bias — reflection feels slow; people route around it | Will Jordan actually pause, or find the shortest path through? |

For Mode B: search 1–2 conflicting domains, extract the competing prediction,
test whether the artifact mechanism holds up.

---

## Session format

### Step 1 — Load the target artifact

Accept one of:
- A prototype from Notion Elicitation Lab (Status: Pilot Ready or Under Review)
- An idea from the idea library (Status: Idea or Prototyped)
- An artifact described in conversation

Confirm: name, mechanism it implements, research finding it was originally grounded in,
and any prior challenger rounds already logged.

### Step 2 — Select challenge mode

If user specifies A or B: use that.
If not specified:
- Default to **Mode B** if target composite eval score ≥ 0.75 (theoretical challenge)
- Default to **Mode A** if score < 0.75 or unknown (user-type challenge first)

### Step 3 — Run the challenge

**Mode A:** Simulate the 2 selected challenger personas using the eval rubric.
Report per-persona score, one-line behavioral note, composite.

**Mode B:**
1. Web search the conflicting domain (1–2 searches)
2. Summarize the competing finding in 1–2 sentences (paraphrase, no direct quotes)
3. State the competing prediction explicitly:
   "This finding predicts that [mechanism] will [fail/backfire/degrade] because [reason]."
4. Assess artifact robustness: robust / partially vulnerable / directly contradicted

### Step 4 — Synthesis

The key output. Produce a **Synthesis Position** — a design recommendation
that balances ALL rounds to date, not just the challenger and original.

```
Artifact: [name]
Challenge round: [N]
Mode: [A — personas / B — conflicting research]

Original grounding: [1-sentence research basis from first iteration]
Prior rounds: [list previous challenge rounds with one-line verdict each]
This challenge: [what was introduced and what it revealed]

SYNTHESIS POSITION
  What holds: [what the design gets right under all challenges — 1–2 sentences]
  What over-optimizes: [what keeps getting flagged — 1 sentence]
  Balanced recommendation: [design adjustment that honors all learnings — 1–2 sentences]
  Trade-off acknowledged: [what this design sacrifices to hold the above — 1 sentence]

Route:
  [ ] Redesign → return to elicitation-ui-lab with synthesis as brief
  [ ] Confirm → pass to verity-evidence-brief
  [ ] Hold → needs one more round of [A/B] before routing
```

### Step 5 — Update Notion

Update the artifact's page in Elicitation Lab (DB: `f2cdce94-4b22-48aa-94a3-de602bccdfc6`):

- Append a new **`Challenger Round [N]`** section. NEVER overwrite prior rounds.
  Format: date · mode · challenge input · synthesis position · route decision
- If Mode A composite < 0.60: update Status → Needs Revision
- If Mode B reveals direct contradiction: add flag "Theoretical conflict — Challenger Round [N]"
- If routing to redesign: update Status → Needs Revision with synthesis brief as note
- If routing to confirm: update Status → Pilot Ready (challenger-confirmed)

**Why rounds must stay visible:** The synthesis position is only meaningful in the context
of what it's integrating. Overwriting prior rounds destroys the intellectual provenance
and makes future challengers weaker.

### Step 6 — Post to Slack — #new-design-artifacts

```
Challenger round [N]: [Prototype Name]

Original mechanism: [1 sentence on what this design does]
Challenge introduced: [Mode A — which personas / Mode B — which conflicting finding]

What held: [1 sentence]
What shifted: [1 sentence]

Synthesis: [balanced recommendation — 1–2 sentences]
Route: [Redesign / Confirm / Hold — and why]

Notion entry: [link]
```

---

## Recurring conflict detection

After each session, check: has this conflict shown up in prior challenger rounds
on other artifacts? If the same theoretical tension has appeared in 3 or more
challenger rounds across different artifacts, flag it:

> "Recurring tension: [conflict name] has appeared in Challenger Rounds for
> [artifact 1], [artifact 2], [artifact 3]. This may warrant a dedicated
> `because-elicitation-research` session focused on resolving the conflict
> rather than continuing to route around it."

Log this flag as a note in the Notion page and mention it in the Slack post.

---

## Design constraints

- Never produce a synthesis that says "the new learning supersedes the old" —
  the synthesis must acknowledge what the original grounding was right about
- Never run the challenger on an artifact that hasn't been through
  `elicitation-eval-loop` at least once
- Challenger rounds accumulate — each run adds depth, not replacement
- Personas simulate behavior, not opinion — report what they'd *do*, not feel
- A Mode A challenger pass does NOT require Jordan to clear; challenger personas
  are not gatekeepers, they are stress inputs
- Mode B never produces a verdict that a design is "wrong" — it produces a
  verdict that a design has a theoretical vulnerability that the synthesis
  must account for

---

## Relationship to the Six-Layer System

```
Layer 1  because-elicitation-research    research → ideas
Layer 2  elicitation-ui-lab              ideas → interactive prototypes
Layer 3  elicitation-eval-loop           prototypes → eval (primary personas)
Layer 4  verity-evidence-brief           strong scores → buyer language
Layer 5  verity-signal-tracker           predictions vs pilot data
Layer 6  pilot-observation-router        findings → tickets
Layer 7  elicitation-challenger          artifacts → dialectical iteration → synthesis
         ↕
         Re-enters at Layer 2 (redesign) or exits to Layer 4 (confirm)
```

The challenger is the only layer that moves backward in the loop by design.
Its output can send work back to Layer 2 with a richer brief than the original,
or forward to Layer 4 with stronger theoretical grounding.

---

*elicitation-challenger v1 · March 15, 2026 · Layer 7 of the Six-Layer System.*
*Mode A: adversarial personas (Darnell, Priya, Carlos, Hyun).*
*Mode B: conflicting research traditions. Synthesis accumulates — never overwrites.*
