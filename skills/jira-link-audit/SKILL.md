---
name: jira-link-audit
description: >
  Scans the Jira DEV project backlog for tickets that reference document files
  (.md or other types), checks whether each referenced document is linked in the
  ticket and uploaded to the Moonkats Notion reference page, imports missing
  documents, and backfills Notion links into Jira ticket descriptions. Trigger
  this skill whenever the user says "link audit", "audit the backlog", "jira link
  audit", "check my jira for missing links", or any variation of wanting to find
  unlinked documents in Jira. Use proactively whenever documents or reference
  files are mentioned alongside Jira maintenance tasks.
---

# Jira Link Audit Skill

Keeps the DEV Jira backlog clean by ensuring every referenced document has a
corresponding Notion link in its ticket description.

---

## Constants

| Name | Value |
|------|-------|
| Jira project | `DEV` |
| Notion reference page (search name) | `📚 Reference Docs` (search by name — do NOT use a hardcoded URL, page IDs change) |
| Fallback file source | "verity-new" Claude Project (user must supply files not found in Notion) |

> **Important**: Always search Notion for the Reference Docs page by title rather than using a hardcoded URL. Use `notion-search` with query `Reference Docs` and select the page titled `📚 Reference Docs`.

---

## Tools Required

- **Atlassian MCP** — read and update Jira tickets
- **Notion MCP** — read and write to the Reference Docs page

---

## Workflow

### Step 1 — Fetch tickets

Use the Atlassian MCP to fetch all DEV tickets that are:
- Status: **Backlog** (explicit board column), OR
- Status: any **open/non-done** state (not Done, Closed, Resolved, Cancelled, or equivalent)

Retrieve the full description and all comments for each ticket.

### Step 2 — Extract document references

For each ticket, scan the description and all comments for:
- Any filename with a file extension (e.g. `rules.md`, `onboarding-guide.pdf`, `schema.json`)
- Focus on `.md` files but catch any extension that looks like a reference document

Build a deduplicated list: `{ filename → [list of ticket keys that reference it] }`

### Step 3 — Check for existing Notion links in tickets

For each ticket that has at least one document reference:
- Check whether the ticket description already contains a Notion link (`notion.so/...`) pointing to that document
- If yes: mark as ✅ already linked — skip
- If no: add to the **needs-link** queue

### Step 4 — Check the Notion Reference Docs page

For each document in the needs-link queue:
- Use the Notion MCP to fetch the Reference Docs page: `323a4646111381dc8a9fe9c61d0eb125`
- Search its child pages and blocks for a page whose title matches the filename (fuzzy-match on base name, ignore extension if needed)
- If found: capture the Notion page URL → proceed to **Step 5**
- If not found: proceed to **Step 6**

### Step 5 — Backfill Notion link into Jira

For each document that was found on the Notion reference page:
- Append the following to the Jira ticket description (for every ticket that references this file):

```
---
📎 Reference Doc: [filename](notion-page-url)
```

- Use the Atlassian MCP to update the ticket description
- Log: `✅ Updated [TICKET-KEY] with Notion link for [filename]`

### Step 6 — Import missing documents to Notion

For each document **not** found on the Notion reference page:

**6a — Attempt to locate the file**
- Check the current conversation context for the file content
- If not present: stop and ask the user:
  > "I couldn't find `[filename]` in the current context or Notion. This file is referenced in: `[TICKET-KEY, TICKET-KEY, ...]`. Could you paste or upload it so I can import it to Notion?"
- Wait for the user to provide the file before continuing

**6b — Import to Notion**
- Create a new child page on the Reference Docs page (`323a4646111381dc8a9fe9c61d0eb125`)
- Page title: the filename (without extension, title-cased)
- Page content: the document contents, formatted as Notion blocks
- Capture the new page's URL

**6c — Backfill Jira tickets**
- For every ticket that references this file, append the Notion link (same format as Step 5)
- Log: `✅ Imported [filename] to Notion and updated [TICKET-KEY, ...]`

### Step 7 — Final verification pass

After all updates are complete:
- Re-fetch all DEV open/backlog tickets
- Re-scan for document references
- Confirm every referenced filename now has a `notion.so` link in the ticket description
- Report:
  - ✅ Tickets fully linked
  - ⚠️ Any remaining tickets with unresolved references (e.g. files the user hasn't provided yet)
  - 📊 Summary counts: tickets scanned / files found / links added / files imported

---

## Output Format

Always conclude with a summary table:

| File | Status | Tickets Updated |
|------|--------|-----------------|
| rules.md | ✅ Linked (already in Notion) | DEV-12, DEV-34 |
| onboarding.md | ✅ Imported + Linked | DEV-7 |
| schema.json | ⏳ Awaiting user upload | DEV-19 |

---

## Edge Cases

- **Same file referenced in many tickets**: update all of them in one pass, don't repeat the Notion import
- **Filename appears in a code block or inline code**: still count it as a reference
- **Notion page title doesn't exactly match filename**: fuzzy match on base name (e.g. `onboarding-guide` matches `onboarding-guide.md`); confirm with user if ambiguous
- **Ticket description is empty**: treat as needing update, append the link block as the full description
- **File already linked but link is broken/wrong domain**: flag it with ⚠️ but don't overwrite without asking
- **Future-artifact files** (e.g. `prompt_changelog.md`, files the ticket itself creates): skip — these don't exist yet and can't be imported. Log as `⏭ Future artifact — skip`
- **Backlog / planning documents** (e.g. `verity-backlog-v4.md`, `verity-ticket-enrichment-v1.md`, any file whose name or content suggests it defines or describes Jira tickets): skip entirely. A ticket should never point to a backlog doc for its own instructions — that content belongs inline in the ticket description. Flag these as `⚠️ Backlog doc reference — content should be inline, not linked` and ask the user whether to inline the relevant content instead.
- **Marketing site HTML files** (e.g. `verity-marketing-v2.24.html`): look for a `📣 Marketing` page in Notion rather than a standalone file page. The marketing file lives as a download on that page. Use the Marketing page URL with the relevant anchor if available
