---
name: backlog-auto-updater
description: >
  Automatically appends structured items to the Verity backlog addendum after
  any feedback loop session produces findings, decisions, or observations that
  affect the product. Trigger when the user says things like: "update the
  backlog from this", "log this to the backlog", "close the loop on the
  backlog", "this should go in the backlog", "backlog update", "log this
  observation", or after completing any of these skills: research-digest,
  because-elicitation-research, elicitation-ui-lab, or design-system-updater.
  Also triggers automatically at the end of any session where a product, schema,
  technical, or design decision was made and not yet logged. Never runs
  standalone — always runs after a session that produced findings worth
  preserving.
---

# backlog-auto-updater — v1

Appends structured items to `verity-backlog-addendum` after any feedback loop session produces findings, decisions, or observations worth preserving. Append only — never rewrites or reorganizes existing content.

**Trigger phrases:** "update the backlog from this", "log this to the backlog", "backlog update", "close the loop on the backlog", "this should go in the backlog", end of any session with unlogged decisions.

**Also triggers automatically** after: `research-digest`, `because-elicitation-research`, `elicitation-ui-lab`, `design-system-updater`.

---

## Steps

1. **Collect findings** — reads session output and classifies each finding as: Type A (new item), Type B (refinement to existing item), Type C (decision log entry), Type D (watch item). Ambiguous → defaults to Type A + flags `[needs triage]`.

2. **Read current backlog** — reads `/mnt/project/verity-backlog-addendum-v6.md`. Finds highest item number, checks for Decision Log and Watch sections.

3. **Format entries** — uses exact canonical formats (see below).

4. **Write updated file** — appends to correct sections, bumps version (v6 → v7), writes to `/mnt/user-data/outputs/verity-backlog-addendum-v7.md`.

5. **Push to Notion** — updates Notion page ID `324a4646-1113-8165-9e6b-c9e6a6a338eb`.

6. **Reports** — count of items added by type; any `[needs triage]` flags; download instruction.

---

## Entry Formats

**Type A — New item:**
```
### [A-NNN] [Short title] *(added [date])*
**Source:** [skill or session]
**Type:** [feature / investigation / schema / prompt / UI / infrastructure / design]
**Owner:** [Melanie / Hilary / Board 09 / TBD]
**Priority:** [R1 / R2 / R3 / R4 / Watch]
**Summary:** [1–2 sentences]
**Depends on:** [blocking items or "none"]
**Links:** [Jira / Notion / "none"]
```

**Type B — Refinement:** Appended under existing item as `> **Update [date] (from [source]):** [what changed]`

**Type C — Decision:** Date · title · decided · rationale · made by · supersedes

**Type D — Watch:** Date · title · 1 sentence · source · revisit trigger

---

## Guardrails

- Append only — never edit or remove existing content
- One version bump per session regardless of number of items
- Contradictions with existing items → flag explicitly, do not silently overwrite
- No item may instruct that BECAUSE fields be AI-generated, pre-filled, or skipped
- If ownership isn't clear → default to TBD, ask user before pushing

---

*backlog-auto-updater v1 · March 15, 2026*
