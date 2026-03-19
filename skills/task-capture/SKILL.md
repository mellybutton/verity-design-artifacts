---
name: task-capture
description: >
  Scans the current conversation for outstanding manual tasks — things Melanie or a collaborator
  (Jimmy, Michael, etc.) still needs to do by hand — and writes them to the Manual Task Log
  database in the Verity Claude Artifacts Notion workspace. Use this skill whenever Melanie says
  anything like: "log this task", "capture the outstanding tasks", "what do I still need to do",
  "manual tasks from this session", "task log", "what's on my plate", "save the to-dos",
  "what needs to happen next", or any variation of wanting to track things that require human
  action. Also triggers automatically at the natural end of a session when manual tasks were
  identified, assigned, or deferred during the conversation without being logged. If there's any
  chance a manual task was surfaced and not tracked, activate this skill — don't wait to be asked.
---

# Task Capture

Scans the current conversation for outstanding manual tasks and writes each one as a row to the
**Manual Task Log** Notion database inside the Verity Claude Artifacts Ops Layer.

---

## Notion Setup (first run only)

On first run, check whether the Ops Layer page and Manual Task Log database already exist.

**Ops Layer parent:**
- Parent page ID: `323a3817-5c33-81db-b0ec-ce0fac10d230` (Verity Claude Artifacts library root)
- Page title: `⚙️ Ops Layer`
- If Decision Capture already created this page, reuse it — do not create a duplicate

**Manual Task Log database schema:**

| Property | Type | Notes |
|---|---|---|
| Task | title | One-line action-oriented description (starts with a verb) |
| Status | select | `Outstanding` \| `Done` |
| Owner | select | `Melanie` \| `Jimmy` \| `Michael` \| `Hilary` \| `TBD` |
| Priority | select | `High` \| `Medium` \| `Low` |
| Context | rich_text | Why this task exists; what it unblocks |
| Steps / Notes | rich_text | Any substeps or clarifications mentioned in conversation |
| Blocked By | rich_text | What's preventing completion (if anything) |
| Project / Area | select | `Verity` \| `OKRly` \| `Helm` \| `Ops` \| `Other` |
| Source | rich_text | Brief description of the conversation this came from |
| Logged | date | Today's date |

---

## Extraction Protocol

### Step 1 — Scan the conversation

Read the full conversation history and identify manual tasks — things that require a human to do,
that have not yet been completed. Do NOT capture:
- Tasks Claude already completed during the session
- Hypothetical tasks ("you could...") with no commitment
- Tasks described in the past tense as already done

**Signal phrases for outstanding tasks:**
- "you'll need to", "don't forget to", "make sure to", "remember to"
- "still need to", "needs to happen", "pending", "TODO", "action item"
- "Melanie will", "Jimmy should", "Michael needs to"
- A clear next step was identified but not actioned
- A handoff was called out (e.g., "that's on you")

**Ownership signals:**
- Named person → assign to them
- "you" directed at Melanie → `Melanie`
- Technical/engineering tasks → `Jimmy`
- OKR/methodology tasks → `Michael`
- Unspecified → `TBD`

**Priority signals:**
- Blocking something else, time-sensitive, or flagged as urgent → `High`
- Normal next step → `Medium`
- Nice-to-have, low urgency → `Low`
- When unclear → `Medium`

### Step 2 — Surface to user before writing

Present a clean summary:

```
TASKS FOUND — [N] outstanding

1. [Task title — starts with a verb]
   Owner: [name] | Priority: [H/M/L]
   Context: [why it matters]
   Blocked by: [if applicable]

2. ...
```

Ask: **"Does this look right? Anything to add, change, or mark as already done?"**

Wait for confirmation. Make any edits the user requests.

### Step 3 — Write to Notion

For each confirmed task:
1. Use `notion-create-pages` to create a row in the Manual Task Log database
2. Set `Status` to `Outstanding`
3. Fill all available fields from the conversation
4. Set `Logged` to today's date
5. Set `Project / Area` based on conversation context (default: `Verity`)

### Step 4 — Confirm

After writing, report:
```
✅ Logged N tasks to Notion Manual Task Log.
  Outstanding: N | High priority: N
  → [link to Ops Layer page if available]
```

---

## Auto-trigger Behavior

When running automatically (end of session, no explicit user request):

1. Scan for outstanding tasks silently
2. If none found → do nothing, say nothing
3. If found → surface the summary and ask for confirmation before writing
   (never write without confirmation, even in auto mode)

---

## Idempotency

Before writing, scan the existing Manual Task Log for near-duplicate titles. If a task
already exists with the same or very similar title and is still `Outstanding`:
- Do not create a duplicate
- Flag it: "This one may already be logged: [title]. Want to update it or log as new?"

---

## Notes

- Task titles must start with a verb: "Set epic parent links in Jira", not "Epic parent links"
- One row per discrete task. Do not bundle multiple actions into one row.
- If a task has substeps, put them in `Steps / Notes` — keep the title as the single action
- Tasks with no clear owner default to `TBD`, not `Melanie`
- If a task was assigned to Claude (not a human), do not log it here — this log is for manual human tasks only
