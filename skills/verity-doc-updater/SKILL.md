---
name: verity-doc-updater
description: >
  Updates the Verity project reference documents when new strategic, product,
  positioning, design, or sales insights are discovered in conversation.
  Trigger when the user says things like "add this to our docs", "update the
  reference files", "save this to the project", or "this should go in the story
  map / sales motion / competitive framing / positioning / data schema / persona
  map". Also trigger when a conversation concludes with new canonical Verity
  knowledge, or the user makes a significant product framing, ICP, buyer language,
  data model, persona, or competitive decision to preserve for future conversations.
  Also handles updates to Marketing (versioned HTML pages, archive links), Skills
  (packaging and pushing updated .skill files), and Scratchpad (low-ceremony
  working drafts). Reads the relevant project file, integrates the update, outputs
  a replacement file, AND pushes to the Verity Claude Artifacts Notion library —
  updating the child page AND index tables on the parent and section pages.
---

# Verity Doc Updater — v8

*v5: March 15, 2026*
*v6: March 15, 2026 — Expanded SK-1 skill list to all 15 known skills; expanded Reference Docs Page ID table to all tracked child pages; added Pilot and Engineering section routing; added dedup check before any Notion page creation; added "Parent Index absent" fallback to Step FINAL*
*v7: March 16, 2026 — Added Notion page ID for research-digest (325a4646-1113-811c-a937-c4054f9565b5)*
*v8: March 16, 2026 — Added verity-behavioral-specification-layer-v1.md to Reference Docs extended table (Notion ID: 326a4646-1113-81b3-9568-f9c7d3ab0342)*

Verity maintains canonical reference documents across six sections in the **Verity Claude Artifacts** Notion library. This skill:

1. Routes the update to the correct section
2. Reads the relevant file and integrates the change
3. Outputs a replacement file
4. Pushes updated content to the corresponding Notion child page
5. Updates the section index table
6. Updates the parent Artifact Index (if the index table exists — see Step FINAL)

**Only pages listed in this skill are touched.** No other Notion pages are written to.

---

## Library Structure

```
📁 Verity Claude Artifacts        ← parent (ID known, hardcoded)
├── 🔬 Pilot                      ← pilot signal log, model feedback, elicitation gallery (ID known)
├── 📚 Reference Docs             ← canonical .md and .html files (ID known)
├── 📣 Marketing                  ← versioned HTML pages + archive links (ID known)
├── 🛠 Skills                     ← packaged .skill files (ID known)
├── 🧪 Scratchpad                 ← working drafts, fragments (ID known)
└── ⚙️ Engineering                ← schema, MCP spec, harness notes, Jira structure (ID known)
```

---

## Page ID Reference

### Section pages
| Page | Notion Page ID | Notion URL |
|---|---|---|
| 🗂 Verity Claude Artifacts (parent) | `323a4646-1113-8106-a8fd-ec1de24d7330` | https://www.notion.so/323a464611138106a8fdec1de24d7330 |
| 🔬 Pilot (section) | `324a4646-1113-810a-a734-d40f2272ee3b` | https://www.notion.so/324a46461113810aa734d40f2272ee3b |
| 📣 Marketing (section) | `323a4646-1113-8101-bf66-cc60209d03ab` | https://www.notion.so/323a464611138101bf66cc60209d03ab |
| 📚 Reference Docs (section) | `323a4646-1113-81dc-8a9f-e9c61d0eb125` | https://www.notion.so/323a4646111381dc8a9fe9c61d0eb125 |
| 🛠 Skills (section) | `323a4646-1113-8149-b9f4-c97b62f72397` | https://www.notion.so/323a464611138149b9f4c97b62f72397 |
| 🧪 Scratchpad (section) | `323a4646-1113-81bc-aa89-e6a53e781d25` | https://www.notion.so/323a4646111381bcaa89e6a53e781d25 |
| ⚙️ Engineering (section) | `324a4646-1113-8148-8829-c30ec1c24f10` | https://www.notion.so/324a4646111381488829c30ec1c24f10 |

> **Note:** The parent page contains child page links but may not have an Artifact Index table. See Step FINAL for fallback behavior.

### Reference doc child pages (canonical strategy docs)
| File | Notion Page ID | What it covers |
|---|---|---|
| `verity-story-map-v2_4.md` | `323a4646-1113-819d-8edd-dee16c58bd3a` | Full product narrative, characters, loop mechanism, timing argument, category claim |
| `verity-sales-motion-v2_2.md` | `323a4646-1113-8165-9c83-d774f8809021` | ICP, buyer map, conversation structure, objection handling, pilot structure |
| `verity-competitive-framing-v2_5.md` | `323a4646-1113-8154-be28-d474150984f1` | Competitor landscape, one-line contrasts, AI readiness objection handling |
| `verity-positioning-v2_3.md` | `323a4646-1113-810d-9597-e90539ee05db` | Three buyer briefs (CEO, PM, CS Director), mechanism statement |
| `verity-data-schema-v4.md` | `323a4646-1113-811e-a795-f3b8ff096265` | Full schema, skill graph node model, founding constraints |
| `verity-persona-map-v2.html` | `324a4646-1113-8171-a1cf-f92c903711f6` | Four principals + one user, naming rules, buyer/user/principal reference table |

### Reference doc child pages (extended — added v6)
| File | Notion Page ID | What it covers |
|---|---|---|
| `verity-why-now-and-ai-mechanism-v1.md` | `324a4646-1113-81d6-853d-d4ea1624f0e0` (Engineering) | Why-now argument, AI mechanism framing |
| `verity-backlog-addendum-v6.md` | `324a4646-1113-8165-9e6b-c9e6a6a338eb` | Backlog items, refinements, decisions, watch flags |
| `verity-unit-economics-v2.md` | `324a4646-1113-81c6-ab46-cd5123e50e3c` | Unit economics model |
| `verity-funding-strategy-v2_1.md` | `324a4646-1113-81fb-93d4-e9de99f45aec` | Funding strategy, investor targets |
| `verity-competitive-threat-matrix-v1.md` | `324a4646-1113-8152-9314-dfae4e4c65ef` | Competitive threat matrix, moat vs commodity mapping |
| `verity-ticket-enrichment-v1_1.md` | `324a4646-1113-81fd-9f72-ccd013202c50` | Ticket enrichment spec |
| `verity-personas-v1_1.md` | `324a4646-1113-8104-9244-c703f8958544` | Persona detail docs |
| `verity-design-system-v2_1.html` | `324a4646-1113-817c-b801-f05676a54f3d` | Design system tokens, components, patterns |
| `seven-layer-loop-v2.md` | `325a4646-1113-8135-8703-e76d5048ffad` | Eight-node elicitation loop map |
| `verity-harness-engineering-notes-v1.md` | `324a4646-1113-81fa-add4-fc91f302d446` | Harness engineering architecture notes |
| `verity-mcp-spec-v1.md` | `324a4646-1113-8116-b7ca-dce6b58355be` | MCP server spec |
| `verity-behavioral-specification-layer-v1.md` | `326a4646-1113-81b3-9568-f9c7d3ab0342` | Post-pretraining positioning research; behavioral specification layer framing; competitive landscape; academic grounding (Nisbett & Wilson, Process Reward Models, neurosymbolic AI); investor language |

### Skills child pages
| Skill | Notion Page ID |
|---|---|
| `verity-doc-updater` | `324a4646-1113-8169-babd-c2a4894b082c` |
| `ai-ux-design` | `324a4646-1113-8133-bdd0-e95b08f6d3fa` |
| `research-digest` | `325a4646-1113-811c-a937-c4054f9565b5` |
| `because-elicitation-research` | `324a4646-1113-81e6-aac4-e51a3459bb0a` |
| `elicitation-ui-lab` | `324a4646-1113-8148-95e9-f4af07310ac8` |
| `elicitation-eval-loop` | `324a4646-1113-81a2-955b-cbf55ca431fc` |
| `elicitation-prospect-validator` | `325a4646-1113-8149-8661-d648019eb6b6` |
| `elicitation-challenger` | `325a4646-1113-81a1-850e-e3c6be5a5fc6` |
| `verity-evidence-brief` | `324a4646-1113-81be-a59f-ff6e65a620dd` |
| `verity-signal-tracker` | `324a4646-1113-816f-9298-cdc9905a9bdf` |
| `pilot-observation-router` | `324a4646-1113-817c-a8ab-e504baaa2c26` |
| `html-nav-mode` | `324a4646-1113-81c7-ab42-c474cf247ef2` |
| `jira-link-audit` | `324a4646-1113-81c2-83cc-d3d478caca1d` |
| `backlog-auto-updater` | `324a4646-1113-81fd-ae21-f2cae044314d` |
| `design-system-updater` | `324a4646-1113-8108-99a0-f853bc320a34` |

---

## Step 0: Route the Update

Before doing anything, classify what section this update belongs to:

| Section | Route when… |
|---|---|
| **Reference Docs** | Strategic, product, positioning, sales, schema, or persona insight → any canonical file |
| **Marketing** | A new versioned marketing page (HTML) is ready, or an existing one is being archived/replaced |
| **Skills** | An updated `.skill` file is being pushed |
| **Scratchpad** | A working draft, fragment, or exploratory note with no permanent home yet |
| **Pilot** | Pilot signal logs, model feedback protocol, elicitation UI gallery entries |
| **Engineering** | Schema specs, MCP spec, harness notes, Jira structure docs, Claude Code norms |
| **Parent** | Only touched as part of another section update — never alone |

If the classification is ambiguous, ask the user before proceeding.

A single update may span multiple sections (e.g., a new marketing page AND updated positioning). Handle each section in sequence.

### Dedup check (required before any page creation)

Before calling `notion-create-pages`, fetch the parent section and scan existing child page titles. If a page with the same (or very similar) title already exists:
- **Update** the existing page instead of creating a new one.
- Log to the user: "Found existing page [title] — updating instead of creating."

This prevents duplicate pages accumulating in Reference Docs and Skills.

---

## Reference Docs Path

### When to update each file
| File | Trigger conditions |
|---|---|
| `verity-story-map` | New framing, new characters, mechanism changes, new moat arguments |
| `verity-sales-motion` | New buyer signals, new objections, refined entry points, pilot learnings |
| `verity-competitive-framing` | New competitors surfaced, sharper contrast language, new objection types |
| `verity-positioning` | Refined value props, new one-liners, updated target customer definition |
| `verity-data-schema` | Schema changes, new rule fields, skill graph model updates, constraint changes |
| `verity-persona-map` | New principal types, naming rule changes, buyer/user/principal table updates |
| `seven-layer-loop` | New layers, layer renaming, flow changes, skill table changes |
| `verity-design-system` | New tokens, new components, new interaction patterns |
| `verity-backlog-addendum` | New backlog items, refinements, decisions (usually via backlog-auto-updater) |

### RD-1: Read the target file

Use the `view` tool to read from `/mnt/project/`. The canonical filenames are:
- `/mnt/project/verity-story-map-v2_4.md`
- `/mnt/project/verity-sales-motion-v2_2.md`
- `/mnt/project/verity-competitive-framing-v2_5.md`
- `/mnt/project/verity-positioning-v2_3.md`
- `/mnt/project/verity-data-schema-v4.md`
- `/mnt/project/verity-persona-map-v2.html`
- `/mnt/project/seven-layer-loop-v2.md`
- `/mnt/project/verity-design-system-v2_1.html`
- `/mnt/project/verity-backlog-addendum-v6.md`

> **Note on `.html` files:** Can be read with the `view` tool. Preserve `.html` extension in output path.

**If the file is not found in `/mnt/project/`:**
Check whether the file was uploaded directly into the conversation. If so, read it from there.
If neither source is available, stop and tell the user: "I can't find [filename] — please upload it to the conversation and I'll continue."
Do NOT proceed to RD-1b unless this is a genuinely new document type that has never existed.

### RD-1b: New File (new document type only)

1. Draft the new `.md` file with the same header structure as existing files (title, version, What changed section, body)
2. Filename: `verity-[name]-v1.md`
3. Run dedup check against Reference Docs section before creating
4. In the Notion step, **create** a new child page under Reference Docs (`323a4646-1113-81dc-8a9f-e9c61d0eb125`) using `notion-create-pages`
5. Add the new doc to the Page ID Reference table in this SKILL.md on next skill push

### RD-2: Integrate the update

- **Additions**: Insert at the most logical location. Don't append to bottom unless it's a genuinely new top-level section.
- **Replacements**: Replace only the specific passage that is now superseded.
- **Refinements**: Update the specific line, phrase, or argument. Preserve surrounding context.
- **Structural changes**: Reorganize only the relevant section.

**Versioning rules:**
- Update the version number in the document title (e.g., `v2.4` → `v2.5`)
- Update the `*Updated from...` line at the top
- Add a bullet to the **What changed** section

**Never:**
- Change the BECAUSE field rules or attribution model
- Alter the IF/THEN/BECAUSE structure of rule card references
- Remove content without explicit user instruction
- Change core vocabulary: "context and harness layer", "the model never sees raw documentation", "the gap"

### RD-3: Output the file

Write the complete updated document to `/mnt/user-data/outputs/` using the same filename. Use `present_files`.

### RD-4: Push to Notion child page

Use `notion-update-page` with the child page ID from the Page ID Reference table.

**Standard page content format:**
```
**Current version:** vN.N
**Notion page ID:** [page-id]
**Managed by:** `verity-doc-updater` skill
**Last updated:** [today's date]

---

> This page is updated automatically by the `verity-doc-updater` skill. Do not edit manually — changes will be overwritten on next skill push.

---

[full .md content here]
```

### RD-5: Update section index

Re-fetch `323a4646-1113-81dc-8a9f-e9c61d0eb125`. Find the reference docs table if present. Update the **Version** and **Last Updated** cells. If new, append a row.

---

## Marketing Path

### MK-1: Identify the operation

- **New page**: A new versioned HTML file is being added (e.g., `verity-marketing-v2.30.html`)
- **Archive**: The current "latest" is being superseded by a newer version
- **Replace**: An existing draft page is being overwritten with no version bump

### MK-2: Output the file

Write the HTML to `/mnt/user-data/outputs/verity-marketing-vN.NN.html`. Use `present_files`.

### MK-3: Check for pending fixes before archiving

When archiving the current "latest" (e.g., pushing v2.30 and archiving v2.29), check whether the Notion Marketing page has a `## Pending Fixes` section for the outgoing version. If it does:
- List any unchecked items to the user.
- Ask: "These pending fixes were on [version] — should I create Jira tickets for any unresolved ones?"
- If yes, create Jira tickets in project DEV before proceeding.

### MK-4: Push to Notion

- **New page**: Use `notion-create-pages` under Marketing section (`323a4646-1113-8101-bf66-cc60209d03ab`). Run dedup check first. Title: `verity-marketing-vN.NN`. Status: `Current`.
- **Archive previous latest**: Re-fetch the Marketing section, find the previous "latest" child page, update its status to `Archived`.

Standard page content format (same header as Reference Docs, with version + managed-by block), then embed the full HTML as a code block.

### MK-5: Update Marketing section index

Re-fetch `323a4646-1113-8101-bf66-cc60209d03ab`. Update the section index table:
- Previous latest → Status: `Archived`
- New page → Status: `Current (latest)`, with today's date

---

## Skills Path

### SK-0: Read the source file

Read the skill's `SKILL.md` from `/mnt/skills/user/[skill-name]/SKILL.md`.
If that path is not accessible, check for a `SKILL.md` uploaded directly into the conversation.
If neither is available, stop and tell the user: "I can't find the SKILL.md for [skill-name] — please upload it and I'll continue."

### SK-1: Identify the skill

Which skill file is being pushed? Match against the known skills list:

**User skills (15 known):**
`verity-doc-updater`, `ai-ux-design`, `research-digest`, `because-elicitation-research`, `elicitation-ui-lab`, `elicitation-eval-loop`, `elicitation-prospect-validator`, `elicitation-challenger`, `verity-evidence-brief`, `verity-signal-tracker`, `pilot-observation-router`, `html-nav-mode`, `jira-link-audit`, `backlog-auto-updater`, `design-system-updater`

**Public skills (read-only, not pushed via this skill):**
`docx`, `pdf`, `pptx`, `xlsx`, `product-self-knowledge`, `frontend-design`

If the skill name does not match any known skill, treat as new and run dedup check before creating a child page.

### SK-2: Output the file

Write the updated `SKILL.md` to `/mnt/user-data/outputs/`. Use `present_files`.

### SK-3: Push to Notion

- **Update existing**: Use `notion-update-page` with the child page ID from the Page ID Reference → Skills table. If not listed, fetch the Skills section (`323a4646-1113-8149-b9f4-c97b62f72397`) and match by title.
- **New skill**: Run dedup check. If clear, use `notion-create-pages` under the Skills section.

Standard page content format. Embed the full `SKILL.md` content.

### SK-4: Update Skills section index

Re-fetch `323a4646-1113-8149-b9f4-c97b62f72397`. Update the **Version** and **Last Updated** cells for the changed skill. If new, append a row.

---

## Scratchpad Path

Low ceremony. No versioning required.

### SC-1: Create or update the child page

- **New fragment**: Run dedup check. Use `notion-create-pages` under Scratchpad (`323a4646-1113-81bc-aa89-e6a53e781d25`). Title: short descriptive label + today's date (e.g., `hero-subhead-experiments 2026-03-15`).
- **Update existing**: Fetch the existing page and use `notion-update-page`.

No output file required unless the user asks for one.

### SC-2: No index update needed

Scratchpad items are not tracked in section index tables or the parent. Do not update any index tables for scratchpad-only changes.

---

## Pilot Path

Routes updates to the Pilot section (`324a4646-1113-810a-a734-d40f2272ee3b`).

### PI-1: Identify the child page type

| What's being updated | Route to |
|---|---|
| Model feedback protocol | Fetch `324a4646-1113-8105-a8a8-e2b1b8d66e91` (v1) or `324a4646-1113-8144-99e1-c3ca4a7337a2` (v2) |
| Elicitation UI Gallery | Fetch `325a4646-1113-8199-87dc-efe9ad43d352` |
| Pilot readiness / next steps | Fetch `7dba4646-1113-83dd-ab9a-01f656ee91dc` |
| New pilot document | Run dedup check, create under Pilot section |

### PI-2: Standard push

Same push format as Reference Docs (version block + managed-by + content). No output file required unless user asks.

---

## Engineering Path

Routes updates to the Engineering section (`324a4646-1113-8148-8829-c30ec1c24f10`).

### EN-1: Identify the child page type

| File | Notion Page ID |
|---|---|
| `verity-mcp-spec-v1.md` | `324a4646-1113-8116-b7ca-dce6b58355be` |
| `verity-harness-engineering-notes-v1.md` | `324a4646-1113-81fa-add4-fc91f302d446` |
| `verity-jira-proposed-v3.md` | `324a4646-1113-81d6-853d-d4ea1624f0e0` (labeled "verity-jira-proposed") |
| Claude Code Working Norms — Hilary | `324a4646-1113-8159-a2a1-d6971d245557` |
| Verity Rule Schema v1 | `7c8a4646-1113-824c-b8f6-8110fb458cc6` |

### EN-2: Standard push

Same push format. No output file required unless user asks.

---

## Step FINAL: Update the Parent Artifact Index

After **any** section update (Reference Docs, Marketing, or Skills — not Scratchpad, Pilot, or Engineering), attempt to update the parent index.

Re-fetch `323a4646-1113-8106-a8fd-ec1de24d7330`.

**If an Artifact Index table exists:** Find the table and update:
- **Current Version** cell for the changed document(s)
- **Last Updated** cell with today's date
- **Status** → `Current`

**If no Artifact Index table exists:** Skip this step silently. Log to the user: "Parent page has no index table — skipping parent index update." Do not create a table unless the user explicitly asks.

If a brand-new document was added and the table exists, append a new row.

**Do not touch any other tables or content on this page.**

---

## Step TELL: Tell the User

Summarize:
1. What changed (one sentence per change)
2. What version it is now
3. Which Notion child page was updated (link)
4. Which index tables were touched
5. "Download this and replace the existing file in your verity project."

If multiple files were updated, summarize per file.

---

## Guardrails

- If the new insight contradicts existing content, flag the contradiction before integrating. Ask the user which version is canonical.
- If the change affects more than one file, list all affected files and confirm with the user before updating all of them.
- If the user says "update everything" or "add this everywhere it's relevant", use judgment — only update files where the insight materially changes the content.
- Always preserve existing document structure. This skill edits documents; it doesn't redesign them.
- If a Notion push fails (access error, rate limit), tell the user and provide the file download only. Do not block on Notion availability.
- **Scope boundary**: Only write to pages listed in this skill, plus any new child pages created under the six tracked sections. Never write to pages outside the Verity Claude Artifacts library.
- **Dedup always**: Never call `notion-create-pages` without first fetching the target section and confirming no page with the same title exists.
