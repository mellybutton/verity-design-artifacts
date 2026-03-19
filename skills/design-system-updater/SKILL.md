---
name: design-system-updater
description: >
  Reads upcoming UI-involved Jira tickets and updates the Verity design system
  (verity-design-system-v[n].html) to reflect new components, token changes, or
  interaction patterns required by those tasks. Trigger when the user says
  things like: "update the design system for [ticket]", "does the DS cover this
  UI task", "what design tokens do I need for [feature]", "prep the design
  system for the next sprint", "check the DS against Jira", "does the design
  system need updating", or any variation of wanting the design system kept
  current with upcoming build work. Also runs proactively when a UI ticket is
  created or discussed that introduces a new component, interaction pattern, or
  layout not yet in the DS.
---

# design-system-updater — v3

Reads upcoming UI-involved Jira tickets and updates `verity-design-system-v[n].html`
to reflect new components, token changes, or interaction patterns required by those tasks.

**Trigger phrases:** "update the design system for [ticket]", "does the DS cover this UI task",
"check the DS against Jira", "prep the design system for the next sprint", any variation of
wanting DS kept current with upcoming build work.

**Also triggers proactively** when a UI ticket is discussed that introduces a new component,
interaction pattern, or layout not yet in the DS.

---

## Steps

### 1. Pull the ticket(s)
Via Atlassian MCP by ticket ID, or by searching DEV project for `To Do` / `In Progress` UI
tickets. Extracts: component/pattern, required states, personas, surface (Slack vs. dashboard).

### 2. Audit the DS
Read `verity-design-system-v[n].html` from `/mnt/project/`. Flag each ticket requirement as:
- `gap` — new pattern needed, does not exist anywhere in DS
- `extend` — existing pattern needs a new variant or state
- `no change` — already covered

### 3. Atom audit (for any `gap` or `extend`)
Before drafting new molecules or pattern sections, identify net-new atoms the new component
introduces. For each candidate atom, check whether it already exists in DS foundations:

| Atom type | Check against |
|---|---|
| New color usage | Primitive palette — if outside palette, flag and stop |
| New typographic treatment | Type scale |
| New spacing value | 4px grid |
| New input type (slider, toggle, etc.) | Inputs & Forms page |
| New badge/chip variant | Badges & Tags page |
| New feedback pattern (callout, strip, etc.) | Feedback & Alerts page |
| New interactive state (hover, focus, disabled, error) | Relevant component page |
| New icon convention | Check existing SVG usage |

For each net-new atom:
- If it uses existing tokens in a new combination → add to the correct DS page as a documented
  usage pattern with demo, do/don't guidance, and implementation note
- If it requires a net-new token → flag explicitly: "This introduces a new semantic token:
  `--token-name`. Add to foundations?" Wait for confirmation before proceeding.

**Never add atoms that require design decisions not yet made. Flag and stop.**

New atoms go into their correct DS page (Inputs, Badges, Feedback, etc.) — not into a new
section, not inline with the molecule that introduced them.

### 4. Draft the update
Write new sections in DS style:
- CSS custom properties only — never hardcoded hex values
- DM Sans body, Fraunces display, DM Mono for code
- Component header, light + dark demo, token annotation table, usage note
- Do/don't guidance block for each new component
- Implementation notes for any non-obvious behavior

### 5. Output the file
- Bump version in `<title>` and `.wordmark-version`
- Add changelog comment at top of `<head>`: `<!-- v[n]: [description] · [date] -->`
- Write to `/mnt/user-data/outputs/verity-design-system-v[n].html`

### 6. Update Notion DS page
Notion page ID: `324a4646-1113-817c-b801-f05676a54f3d`

Make three targeted updates using `update_content`:

**a. Latest version block** — replace the version number, date, and download link:
```
## ⬇️ Latest version

**v[n] — [short description]** · [date]

[**Download verity-design-system-v[n].html**]([Drive link — ask Melanie to update after upload])
```
Note: the Drive link cannot be updated automatically — flag it in the reupload reminder.

**b. What's in this version table** — update the relevant row(s) to reflect what changed.
Add ✦ new in v[n] callouts for genuinely new sections or atoms. Remove stale callouts from
prior versions.

**c. Version history table** — prepend a new row at the top:
```
| v[n] | [date] | [what changed — one line per section touched] | [Drive link placeholder] |
```

### 7. Report and remind
Report: which tickets had gaps / extends / no change; what atoms were added and to which pages;
what changed; current version number.

Always end with:

> ⬆️ Design system updated to v[n]. Three things to do:
> 1. **Claude Project** — replace `verity-design-system-v[n].html` in Verity project knowledge (do this first so future skill runs read the right file)
> 2. **Google Drive** — upload the new file to the Moonkat shared folder (right-click existing file → Manage versions → Upload new version)
> 3. **Notion DS page** — paste the new Drive URL into the "Latest version" download link and the Version History row for v[n] (the Notion page is already updated except for the Drive link)
>
> Notion page: https://www.notion.so/324a46461113817cb801f05676a54f3d

---

## Current DS Coverage

| Section | Page | Status |
|---|---|---|
| Foundations (tokens, type, spacing, shadows, radii, easing, dark mode) | Foundations | ✅ Complete |
| Buttons (5 sizes × 3 variants) | Components | ✅ Complete |
| Inputs & Forms (text, textarea, input groups) | Inputs & Forms | ✅ Complete |
| **Range Slider** | Inputs & Forms | ✅ Added v2.3 |
| Select, Checkbox, Radio | Selection | ✅ Complete |
| Badges & Tags (status badges, tags/chips) | Badges & Tags | ✅ Complete |
| **State-driven Indicator Badge** | Badges & Tags | ✅ Added v2.3 |
| Feedback & Alerts (banners, toasts, progress, skeleton, empty state) | Feedback & Alerts | ✅ Complete |
| **Inline Conditional Callout** | Feedback & Alerts | ✅ Added v2.3 |
| **Resolved State Strip** | Feedback & Alerts | ✅ Added v2.3 |
| Rule cards (IF/THEN/BECAUSE anatomy, expanded, annotation sidebar) | Rule Card Library | ✅ Complete |
| Slack Block Kit cards + escalation routing | Slack Interactions | ✅ Complete |
| Stat cards, popovers, breadcrumbs, pagination | Product Patterns | ✅ Complete |
| Inline AI Suggestions | Inline AI Suggestions | ✅ Complete |
| **H3 Governing Rules + AI Authored Label + Source Indicator + Confidence Low Fallback** | AI Suggestions | ✅ Added v2.5 |
| **Elicitation Molecules** (promoted from Seven-Layer Loop lab) | Elicitation Molecules | ⚙️ Managed by `elicitation-ds-promoter` — do not edit |
| Dashboard / full-page layouts | Page Layouts | ⚠️ Gap (DEV-46, DEV-47, DEV-48) |
| Settings pages | — | ⚠️ Gap (DEV-48) |
| Provenance / audit trail views | — | ⚠️ Gap (DEV-49) |
| AI critique / thin-draft fallback card state | — | ⚠️ Partial — DEV-15 (v2.5 adds AI Authored Label + Confidence Low Fallback; full critique card TBD) |

---

## Elicitation Molecules — hands-off rule

The **Elicitation Molecules** page is owned exclusively by `elicitation-ds-promoter`.
This skill must not:
- Add new molecules to that page
- Modify existing elicitation molecule entries
- Rename or reorganize elicitation molecule subsections

Note: atoms that elicitation molecules introduce (e.g. Range Slider, Inline Conditional Callout)
**do** belong in their correct foundational pages and **are** managed by this skill. The
hands-off rule applies only to the Elicitation Molecules page itself, not to the atoms those
molecules use.

If a Jira ticket references an elicitation pattern, flag it: "This component lives in the
Elicitation Molecules page, managed by elicitation-ds-promoter. Run that skill instead."

---

## Guardrails

- Never change primitive color hex values — they are the source of truth
- Never alter rule card IF/THEN/BECAUSE structure or BECAUSE attribution styling
- Never introduce colors outside the Verity palette
- Never redesign existing components without explicit instruction
- If a ticket implies a design decision not yet made, flag and stop — do not invent layout
- Never write to the Elicitation Molecules page (see above)
- Always run the atom audit (Step 3) before drafting any new molecule or pattern — never skip it

---

*design-system-updater v3 · March 15, 2026.*
*v3: Added atom audit as Step 3 — explicit check for net-new atoms before any molecule draft.*
*Updated DS coverage table to reflect v2.3 atoms (Range Slider, State-driven Indicator Badge,*
*Inline Conditional Callout, Resolved State Strip). Step 5 (Notion update) rewritten with*
*specific field targets matching the new Notion-first version registry structure.*
*Reupload reminder updated: Claude Project first, then Drive, then paste Drive link into Notion.*
*Coverage table updated March 16, 2026 to reflect v2.5 additions.*
