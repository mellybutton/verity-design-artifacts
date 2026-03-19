---
name: decision-capture
description: >
  Scans the current conversation for decisions — both pending (still unresolved) and made
  (already resolved) — and writes them to the Decision Log database in the Verity Claude
  Artifacts Notion workspace. Use this skill whenever Melanie says anything like: "log this
  decision", "capture that decision", "what decisions are outstanding", "what have we decided",
  "decisions from this session", "save the decisions", "decision log", or any variation of
  wanting to track choices made or choices still needed. Also triggers automatically at the
  natural end of a session when decisions have been made or deferred during the conversation
  without being explicitly logged. If there's any chance a decision was made or deferred and
  not yet logged, activate this skill — don't wait to be asked.
---

# Decision Capture

Scans the current conversation for decisions — pending and made — and writes each one as a
row to the **Decision Log** Notion database inside the Verity Claude Artifacts Ops Layer.

---

## Notion Setup (first run only)

On first run, check whether the Ops Layer page and Decision Log database already exist.

**Ops Layer parent:**
- Parent page ID: `323a3817-5c33-81db-b0ec-ce0fac10d230` (Verity Claude Artifacts library root)
- Page title: `⚙️ Ops Layer`
- Create this page if it doesn't exist, then store its page ID for database creation

**Decision Log database schema:**

| Property | Type | Notes |
|---|---|---|
| Decision | title | One-line summary of the decision |
| Status | select | `Pending` \| `Made` |
| Context | rich_text | Why this decision came up; what problem it solves |
| Options Considered | rich_text | Alternatives that were on the table (if any) |
| Chosen Option | rich_text | What was decided (leave blank if Pending) |
| Rationale | rich_text | Why this option; the BECAUSE (leave blank if Pending) |
| Project / Area | select | `Verity` \| `OKRly` \| `Helm` \| `Ops` \| `Other` |
| Source | rich_text | Brief description of the conversation this came from |
| Logged | date | Today's date |

---

## Extraction Protocol

### Step 1 — Scan the conversation

Read the full conversation history and identify:

**Made decisions** — something that was resolved, chosen, or agreed upon. Signal phrases:
- "we'll go with", "let's do", "decided to", "agreed on", "going with", "we're using"
- A clear recommendation was accepted without pushback
- A fork was resolved (e.g., between two options)

**Pending decisions** — something explicitly deferred, unresolved, or flagged as needing a
choice. Signal phrases:
- "we need to decide", "TBD", "still open", "haven't decided", "need to figure out",
  "come back to this", "your call", "open question"
- A choice was surfaced but not resolved

### Step 2 — Surface to user before writing

Present a clean summary of what you found:

```
DECISIONS FOUND — [N] total

✅ MADE (N)
1. [One-line summary]
   Context: [why it came up]
   Chosen: [what was decided]
   Rationale: [why]

⏳ PENDING (N)
1. [One-line summary]
   Context: [why it came up / what's blocking resolution]
```

Ask: **"Does this look right? Anything to add, remove, or correct before I log these?"**

Wait for confirmation. Make any edits the user requests.

### Step 3 — Write to Notion

For each confirmed decision:
1. Use `notion-create-pages` to create a row in the Decision Log database
2. Set Status to `Made` or `Pending` accordingly
3. Fill all available fields from the conversation
4. Leave `Chosen Option` and `Rationale` blank for Pending decisions
5. Set `Logged` to today's date
6. Set `Project / Area` based on conversation context (default: `Verity`)

### Step 4 — Confirm

After writing, report:
```
✅ Logged N decisions to Notion Decision Log.
  Made: N | Pending: N
  → [link to Ops Layer page if available]
```

---

## Auto-trigger Behavior

When running automatically (end of session, no explicit user request):

1. Scan for decisions silently
2. If none found → do nothing, say nothing
3. If found → surface the summary and ask for confirmation before writing
   (never write without confirmation, even in auto mode)

---

## Idempotency

Before writing, scan the existing Decision Log for near-duplicate titles. If a decision
already exists with the same or very similar title:
- Do not create a duplicate
- Flag it to the user: "This one looks like it may already be logged: [title]. Update it
  instead, or log as new?"

---

## Notes

- One row per discrete decision. Do not bundle multiple decisions into one row.
- If a decision is complex, err toward splitting into sub-decisions rather than combining.
- The `Chosen Option` field should be the answer, not the options. Options go in `Options Considered`.
- For Pending decisions, `Rationale` can describe what's blocking resolution.
