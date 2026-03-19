---
name: pilot-observation-router
description: >
  Routes a pilot or research observation to the right action: classifies it by
  tier (prompt fix / embedding fix / UI change / schema change / new feature),
  identifies the owner (Melanie / Hilary / both), drafts a Jira ticket in the
  DEV project with full context, creates it via the Atlassian MCP, and appends
  a one-line entry to the backlog addendum. Use this skill whenever Melanie says
  anything like: "log this observation", "this is a finding", "log this pilot
  signal", "add this to the backlog from what we just saw", "Jordan is doing X
  and it's a problem", "the boilerplate rate is high", "retrieval is failing",
  "this is a Tier 1/2/3 thing", "log this to the backlog", "finding from pilot",
  "observation to ticket", or any variation of wanting to turn a product or pilot
  insight into a tracked, routed action item. Also runs automatically at the end
  of any session where a finding was discussed but not yet logged.
---

# pilot-observation-router — v1

> Routes a pilot or research observation to the right action: classifies it, identifies the owner, drafts a Jira ticket, creates it, and appends to the backlog addendum. One pass, no copy-paste.

---

## Trigger phrases

"log this observation", "this is a finding", "log this pilot signal", "Jordan is doing X and it's a problem", "the boilerplate rate is high", "retrieval is failing", "this is a Tier 1/2/3 thing", "log this to the backlog", "finding from pilot", "observation to ticket"

Also runs automatically at the end of any session where a finding was discussed but not yet logged.

---

## What it does (ELI5)

You describe something you noticed — "Jordan keeps writing boilerplate BECAUSE fields" or "Morgan is retrieving wrong rules" — and the skill figures out:

- **What kind of problem is this?** (extraction prompt / embedding / UX / schema / new feature)
- **Who owns it?** (Melanie / Hilary / both)
- **How urgent?** (hours / days / weeks)

Then it drafts a Jira ticket with full context, shows it to you for a quick confirm, creates it in the DEV project, and adds a one-liner to the backlog addendum.

---

## Classification table

| Signal | Tier | Owner | Latency |
|---|---|---|---|
| BECAUSE fields are generic / boilerplate | Tier 1 — Prompt fix | Melanie | Hours |
| BECAUSE fields restate the rule (tautology) | Tier 1 — Prompt fix | Melanie | Hours |
| AI extraction candidates are low quality | Tier 1 — Prompt fix | Melanie | Hours |
| Few-shot pool too small | Tier 1.5 — Fallback review | Melanie | Hours |
| Morgan retrieving wrong rules | Tier 2 — Embedding fix | Hilary | Days |
| Jordan not confirming / low engagement | Tier 1 + UX | Melanie | Hours–days |
| Schema field missing or wrong | Schema patch | Hilary | Hours (blocker if pre-pilot) |
| UI causing confusion | UX ticket | Melanie | Days |
| New domain / rule type not covered | Feature | Both | Days–weeks |
| Corpus near fine-tune threshold | Board 09 flag | Both | Flag only |

---

## Tools required

- Atlassian MCP (create Jira ticket) — cloudId: `788b3269-7c05-4f86-acf6-f81ce6f5fd0f`, project key: DEV
- Notion MCP (append to backlog addendum)
- Project knowledge search (read schema + backlog context before classifying)

---

## Jira ticket template

```
Summary: [Tier label] — [one-line description of the problem]

Description:
## Observation
[What was observed. One paragraph.]

## Evidence
[Metric / threshold / quote / frequency.]

## Classification
- Signal type:
- Tier:
- Owner:
- Latency:

## Proposed Action
[What specifically should happen.]

## Acceptance Criteria
- [ ] Specific testable condition
- [ ] Signal tracker alarm cleared for N days post-change
- [ ] Reviewed and confirmed by Melanie

## Originating Signal
- Source: pilot / research / eval / internal
- Date:
- Linked doc:
```

---

## Backlog addendum entry format

```
| [DEV-KEY] | [Tier label] — [description] | [Owner] | [Date] | From: [source] |
```

---

*pilot-observation-router v1 · March 15, 2026*
