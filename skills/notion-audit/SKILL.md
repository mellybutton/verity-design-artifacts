---
name: notion-audit
description: >
  Audits the Verity Claude Artifacts Notion workspace from top to bottom, checking for
  versioning errors (stale vs current docs), missing Jira/Notion cross-links, duplicate or
  redundant pages, and broken or orphaned pages. Produces a structured audit report with
  findings by category and a prioritized fix list. Use this skill whenever Melanie says
  anything like: "audit notion", "check for broken links", "notion health check", "find
  stale docs", "anything outdated in notion", "notion audit", "check for duplicates",
  "is notion consistent", "what's orphaned", "missing jira links", "notion cleanup",
  "notion review", or any variation of wanting to verify the structural integrity of the
  Verity workspace. Also use proactively when a major batch of Jira tickets has been created
  or when the marketing page has been versioned, as these are the most common sources of
  drift.
---

# Notion Audit

Audits the **Verity Claude Artifacts** Notion workspace for structural integrity issues across
four categories. Produces a prioritized audit report and optional fix list.

---

## Scope

**In scope:** Everything under the Verity Claude Artifacts library root.
- Parent page ID: `323a3817-5c33-81db-b0ec-ce0fac10d230`
- All child pages, databases, and inline databases within this tree

**Out of scope:** All other Notion workspaces and pages not under this parent.

---

## Audit Categories

### 1. Versioning Errors
Things to catch:
- Multiple versions of the same document with no clear "current" marker
- A page titled `v2.X` but a newer `v2.Y` exists without the older being archived or labeled `[ARCHIVED]`
- Marketing pages or skill files where the version number in the title doesn't match the version inside the doc
- Pages with a version number in the title but no version number inside the body (version drift)
- Docs referenced in Jira tickets that point to an older version than what's current

Flag pattern: `[DOC NAME] — version mismatch` or `[DOC NAME] — stale reference`

### 2. Missing Jira / Notion Cross-links
Things to catch:
- Notion pages that describe work corresponding to a Jira epic or ticket but have no Jira link
- Notion pages that reference a Jira ticket key (e.g., DEV-196) in their body but the link is not embedded
- Index tables on parent pages that reference child pages but are missing the Notion page link
- Any page in the Ops Layer (Decision Log, Manual Task Log) that references a Jira ticket without a link
- Skill pages that describe workflows implemented in Jira without cross-referencing the relevant epic

Flag pattern: `[PAGE NAME] — missing Jira link (expected: DEV-XXX)` or `[PAGE NAME] — unlinked reference`

### 3. Duplicate / Redundant Pages
Things to catch:
- Two or more pages with identical or near-identical titles
- Pages whose body content substantially overlaps with another page (same purpose, different home)
- Index entries that point to two different pages describing the same artifact
- Duplicate database rows in Decision Log or Manual Task Log (same decision or task logged twice)

Flag pattern: `[PAGE A] + [PAGE B] — possible duplicate`

### 4. Broken / Orphaned Pages
Things to catch:
- Pages that exist in the workspace but are not reachable from any index table or parent page
- Pages referenced in an index table but whose Notion link returns a 404 or is missing
- Pages with no title, no content, and no parent index entry
- Database rows with all fields blank except the title
- Pages created as stubs (title only, no body) older than 14 days

Flag pattern: `[PAGE NAME] — orphaned` or `[PAGE NAME] — broken link in index`

---

## Audit Protocol

### Step 1 — Fetch workspace structure

Use `notion-fetch` to load the root page (`323a3817-5c33-81db-b0ec-ce0fac10d230`) and
enumerate all immediate child pages. Then recursively enumerate children of children until
the full page tree is mapped.

Build an internal index:
```
[page_id] → { title, parent_id, url, has_body, last_edited, child_ids[] }
```

### Step 2 — Fetch index tables

For each page that contains an index table (parent pages, section pages), read the table
and extract: linked page titles, linked page IDs, version numbers mentioned.

### Step 3 — Run checks per category

For each category, apply the detection logic described above across the full page index.
Collect findings as structured objects:

```
{
  category: "versioning" | "cross-links" | "duplicates" | "orphaned",
  severity: "high" | "medium" | "low",
  page_title: string,
  page_id: string,
  finding: string,        // human-readable description
  suggested_fix: string   // one-line action
}
```

**Severity guide:**
- `high` — blocks navigation, creates real confusion, or risks outdated info being used
- `medium` — structural gap that should be fixed but isn't immediately harmful
- `low` — cosmetic, nice-to-have cleanup

### Step 4 — Produce audit report

Output a structured report in this format:

---

```
NOTION AUDIT REPORT
Workspace: Verity Claude Artifacts
Date: [today]
Pages scanned: [N]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 High severity:   N findings
🟡 Medium severity: N findings
🟢 Low severity:    N findings
Total:              N findings

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. VERSIONING ERRORS (N)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[severity] [page title]
Finding: [description]
Fix: [one-line action]

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. MISSING CROSS-LINKS (N)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. DUPLICATES / REDUNDANCIES (N)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. BROKEN / ORPHANED PAGES (N)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRIORITIZED FIX LIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. [Fix action] → [page] — [severity]
2. ...
```

---

### Step 5 — Offer to fix

After presenting the report, ask:

**"Want me to fix any of these? I can handle: adding missing links, archiving stale versions,
and merging duplicate index entries. Deleting pages requires you to do it manually."**

If the user says yes to specific fixes, execute them using the appropriate Notion MCP tools
(`notion-update-page`, `notion-update-view`, `notion-create-pages`).

Fixes Claude can do automatically:
- Add missing Jira links to page bodies
- Update index table entries with correct links
- Add `[ARCHIVED]` prefix to stale version pages
- Add cross-links between related pages

Fixes that require Melanie:
- Permanently deleting pages (prohibited action — instruct user to do manually)
- Merging page content (offer a draft, but user must approve and commit)
- Resolving ambiguous duplicates where both versions may contain unique content

---

## Notes

- Do not modify any page without telling the user what you're about to change
- When in doubt about whether two pages are duplicates, flag and ask — don't assume
- The audit is read-heavy; expect multiple `notion-fetch` and `notion-search` calls
- If the workspace is large and tool calls are running long, prioritize high-severity findings
  and surface a partial report rather than timing out silently
- Re-run after any major Jira batch, marketing page version bump, or skill update session
