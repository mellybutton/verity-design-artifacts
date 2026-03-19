# Synthetic Personas — Elicitation Eval Loop

Reference file for `elicitation-eval-loop`. Each persona profile defines
behavioral tendencies in simulated BECAUSE elicitation scenarios.

---

## Jordan / CS Principal / Senior CSM / CS Team Lead / Author

**Primary use:** BECAUSE authoring sketches, confirmation flow evals
**Expertise:** Deep CS domain knowledge, 5+ years at company
**Workload:** High — averaging 40+ customer interactions/week
**Relationship to Verity:** Author and rule confirmer

**Behavioral tendencies:**
- Will complete BECAUSE if the prompt is specific and contrastive
- Skips generic prompts ("Why does this rule exist?") — has seen them before
- Responds well to "What would go wrong if this didn't exist?" framing
- After 15+ confirmations, begins pattern-matching to previous BECAUSEs
- Fatigue sets in after 8+ rules in one session
- Highly motivated by attribution — "This is my rule" framing increases completion

**Failure modes this persona triggers:**
- Boilerplate if prompt is non-specific
- Tautology if rule text is repeated in BECAUSE field
- Skip if interface friction is > 2 interactions to reach BECAUSE field

**Pass threshold:** 4/6 minimum — Jordan's pass is required for any sketch to advance

---

## Alex / PM Principal / Product Manager / Product Lead / Spec writer

**Primary use:** Rule consumer sketches, spec integration evals
**Expertise:** Product specification, translating CS input to eng tickets
**Workload:** Medium — managing 2–3 active sprints
**Relationship to Verity:** Reads confirmed rules to write specs

**Behavioral tendencies:**
- Wants rules with strong BECAUSE fields — low-quality BECAUSE = unusable for specs
- Will not complete a BECAUSE field if not prompted (not her job)
- Evaluates sketches for "does this give me something I can put in a ticket?"
- High tolerance for UI complexity if the output is clear
- Will flag rules with missing BECAUSE as incomplete and request re-elicitation

**Simulation focus:** Does the sketch surface enough context for Alex to act on the rule?

---

## Morgan / CS Generalist / CSM / Rule reader

**Primary use:** Rule retrieval sketches, query interface evals
**Expertise:** Newer CSM, relies on rule library for edge cases
**Workload:** High — frequent customer-facing situations
**Relationship to Verity:** Queries rules at inference time

**Behavioral tendencies:**
- Needs rules to be immediately actionable — no interpretation overhead
- Skips rules with generic or missing BECAUSE fields ("this doesn't tell me anything")
- High value placed on the EXCEPT condition — real-world situations have exceptions
- Will abandon a retrieval interface with > 2 steps to an answer
- Responds well to plain-language BECAUSE fields; technical language reduces trust

**Simulation focus:** Does the sketch produce rules Morgan would actually act on?

---

## Sam / CEO Principal / CEO / Founder / Executive

**Primary use:** Dashboard/summary sketches, coverage signal evals
**Expertise:** Company strategy, investor narrative, commitment management
**Workload:** Extreme — limited attention per interaction
**Relationship to Verity:** Buyer, dashboard user, commitment tracker

**Behavioral tendencies:**
- Will not read individual rules — wants aggregate signals
- Responds to: "X% of your CS knowledge is now governed" framing
- Needs a clear answer to "is this building something defensible?"
- Distrusts dashboards without attribution — "who said this?" is always in mind
- Very low tolerance for setup friction — if onboarding > 10 min, abandons

**Simulation focus:** Does the sketch communicate defensibility and coverage clearly?

---

## Riley / Eng Principal / Senior Engineer / Tech Lead / Ticket recipient

**Primary use:** Provenance/audit sketches, source tracing evals
**Expertise:** Codebase, ticket lifecycle, deployment
**Workload:** Medium — sprint-focused
**Relationship to Verity:** Provenance and audit user; receives ticket context

**Behavioral tendencies:**
- Wants to trace rule origin to a specific ticket or decision
- Trusts rules with clear `source_reference` — distrusts rules without provenance
- Will not act on a rule that can't be traced back to an artifact
- Low interest in elicitation UX — focused on output reliability
- High interest in rule lifecycle: when was this confirmed, by whom, has it drifted?

**Simulation focus:** Does the sketch produce rules Riley would trust to act on?

---

*synthetic-personas v1 · March 15, 2026*
