---
name: canonical-coherence-enforcer
description: "Automatically scans changes to canonical Verity documents and syncs updates across all design artifacts while maintaining messaging coherence. Detects and fixes ICP drift, outdated references, positioning misalignment, persona mismatches, voice inconsistency, domain vocab conflicts, schema drift, and copy inconsistency. Tier-based confirmation: Critical/High always confirm, Medium asks, Low auto-applies. Triggers on demand (sync-from-canonical), post-hook (after verity-doc-updater), or audit-only. Use when canonical docs change, before pitching, or when checking artifact alignment."
---

# Canonical Coherence Enforcer

## Purpose

When canonical documents (positioning, personas, schema, design system, elicitation principles, sales motion) change, the **artifacts** that contain, reference, or depend on that information risk becoming incoherent. This skill automatically:

1. **Detects changes** in canonical docs against a stored baseline
2. **Flags coherence conflicts** (ICP mismatches, outdated references, positioning drift, persona inconsistencies)
3. **Updates artifacts** surgically to reflect canonical truth
4. **Versions & logs** each artifact with full provenance
5. **Tracks lineage** — which canonical docs triggered which artifact updates

## Core Concepts

### Canonical Documents
These are the source of truth and should never be mutated by artifact updates:
- `verity-positioning-v2_3.md` — Core positioning, buyer language, key claims
- `verity-competitive-framing-v2_5.md` — Competitive positioning, moat language
- `verity-personas-v1_1.md` — Jordan, Sam, Alex, Riley, Morgan definitions
- `verity-data-schema-v4.md` — IF/THEN/BECAUSE structure, domain vocab
- `verity-elicitation-principles-v1.md` — BECAUSE field philosophy, methodology
- `verity-sales-motion-v2_2.md` — Use cases, buyer journeys, objection handling
- `verity-design-system-v2_6.html` — Design tokens, component library, voice

### Design Artifacts
These depend on canonical docs and are eligible for sync:

**Marketing/Pitch:**
- `verity-marketing-v2_29.html` — Public landing page
- `verity-kindergarten-pitch-v1.md` — Founding story, why now
- `verity-funding-playbook-v1.jsx` — Investor-facing playbook
- `verity-fund-analysis-v2.jsx` — Fund research + thesis matching

**Internal/Design:**
- `sf-009-dashboard-v2.html` — Pilot dashboard
- `sf-005-clusters-v1.html` — Cluster visualization
- `sf-006-settings-v1_0.html` — Settings surface
- `verity-persona-map-v2.html` — Persona visualization
- `verity-demo-cards-v1.jsx` — Demo rule cards

**Strategic:**
- `verity-strategy-ladder-v1.md` — Strategic positioning ladder
- `verity-story-map-v2_4.md` — Story map with positioning

### Coherence Signals (8 Total, Tiered by Severity)

| Tier | Signal | Definition | Example | Confirmation |
|------|--------|------------|---------|--------------|
| **CRITICAL** | ICP Drift | Canonical buyer persona doesn't match artifact targeting | Canonical: "Jordan / CS Principal"; Artifact: "CS leaders" | Always confirm |
| **CRITICAL** | Positioning Misalignment | Core positioning language changed but artifact uses old | Canonical: "skill graph"; Artifact: "knowledge base" | Always confirm |
| **HIGH** | Outdated Reference | Artifact mentions use case/example no longer in canonical | Canonical removed "Optera"; Marketing still features it | Always confirm |
| **HIGH** | Persona Mismatch | Artifact persona name/role doesn't match canonical definition | Canonical: "Morgan / CS Generalist / CSM"; Artifact: "Morgan (CSM)" | Always confirm |
| **HIGH** | Voice Inconsistency | Artifact copy sounds off-brand or auto-generated | Canonical: aphoristic; Artifact: "Verity enables teams to..." | Always confirm |
| **MEDIUM** | Domain Vocab Conflict | Domain list in artifact differs from canonical | Canonical: ['onboarding', 'escalation']; Artifact: ['onboarding', 'support'] | Ask in Manual mode |
| **MEDIUM** | Schema Drift (breaking) | IF/THEN/BECAUSE structure incompatible with canonical | BECAUSE optional in artifact; required in canonical | Ask in Manual mode |
| **LOW** | Copy Inconsistency | Wording variation with no meaning change | One says "harness", another says "context layer" | Auto-apply |
| **LOW** | Design Token Drift | Style values differ (colors, fonts, spacing) | Color: #3340D4 to #2D2AA3 | Auto-apply |
| **LOW** | Schema Drift (compatible) | Backward-compatible schema change | Added optional field; old format still works | Auto-apply |

## Workflow

### Initialization (First Run)

Run this once to establish baselines:

```
canonical-coherence-enforcer: initialize
```

This:
1. Reads all canonical docs from `/mnt/project/` and `/mnt/skills/user/`
2. Extracts key fields (ICP, domains, personas, positioning language, schema, use cases)
3. Reads all artifacts from `/mnt/project/*.html`, `/mnt/project/*.jsx`, `/mnt/project/*.md`
4. Creates a **baseline snapshot** stored in Notion: 🗂 Verity Claude Artifacts → 🔧 Artifact Coherence → `Baseline Snapshot` (text block)
5. Flags all current artifacts with their canonical "parent" (which doc(s) they depend on)

### Run Modes

#### Mode A: Manual Trigger
```
canonical-coherence-enforcer: sync-from-canonical
```

1. Compare current canonical docs against stored baseline
2. Identify which docs changed (diff by section, not just timestamp)
3. For each changed doc, identify downstream artifacts
4. Run coherence checks on each artifact
5. **Tier-based confirmation:**
   - **CRITICAL conflicts** → Always wait for user confirmation
   - **HIGH conflicts** → Always wait for user confirmation
   - **MEDIUM conflicts** → Present options, wait for decision
   - **LOW conflicts** → Propose together, wait for final approval to batch-apply
6. **Wait for user confirmation** before updating artifacts
7. Update artifacts, increment versions, log changes, link old versions in Notion

#### Mode B: Post-Update Hook
Automatically triggers after `verity-doc-updater` completes (if called from that skill).
Same as Mode A, but:
- **CRITICAL/HIGH conflicts** → Present, wait for confirmation (safety first)
- **MEDIUM conflicts** → Ask for confirmation (or auto-confirm if user previously approved this signal type)
- **LOW conflicts** → Auto-apply silently (no interruption needed)
- Chains directly if `verity-doc-updater` passes the changed doc list

#### Mode C: Notion Webhook (Advanced)
If Notion webhooks are available, trigger whenever a canonical page is edited.
Creates a **real-time coherence guard** — edits to canonical docs immediately check for downstream artifact impact.

#### Mode D: Coherence Audit
```
canonical-coherence-enforcer: audit-all-artifacts
```

Runs coherence checks against ALL artifacts without requiring canonical changes.
Outputs:
- Conflict matrix (which artifacts flag which coherence signals)
- Risk-ranked list (highest-impact conflicts first)
- Recommended fixes by artifact

### Coherence Check Procedure

For each artifact, extract these fields and compare against canonical:

| Field | Extracted From | Canonical Source | Conflict = ? |
|-------|---|---|---|
| ICP personas | artifact copy + headings | `verity-personas-v1_1.md` | Any persona name/role mismatch |
| Use case examples | artifact body | `verity-sales-motion-v2_2.md` | Example not in current use cases |
| Positioning language | artifact key phrases | `verity-positioning-v2_3.md` | Phrase not in canonical positioning |
| Competitive framing | artifact comparisons | `verity-competitive-framing-v2_5.md` | Competitor mention not in canonical framing |
| Domain vocab | artifact dropdowns/lists | `verity-data-schema-v4.md` preseeded domains | Domain not in current preseeded list |
| Schema structure | artifact rule cards | `verity-data-schema-v4.md` | IF/THEN/BECAUSE form differs from canonical |
| Design tokens | artifact colors/fonts | `verity-design-system-v2_6.html` | Token value differs from design system |
| Voice/tone | artifact copy style | `verity-design-system-v2_6.html` AI voice section | Copy sounds auto-generated or off-brand |

### Artifact Update Strategy

When updating an artifact:

1. **Preserve structure** — only replace the specific section that changed
2. **Keep ownership** — never mutate code that the user hand-authored (unless user confirms)
3. **Maintain design quality** — when updating copy, match the artifact's existing voice and formatting
4. **HTML-specific** — for `.html` artifacts, locate the section by ID or heading, replace content in place
5. **JSX-specific** — for `.jsx` artifacts, update props/constants but preserve component structure
6. **Markdown-specific** — for `.md` artifacts, replace section between markers but preserve outline

Example HTML update:
```html
<!-- ARTIFACT HEADER (DO NOT EDIT) -->
<div id="version-history">
  <p>Version 2.3 (2026-03-18)</p>
  <p><em>Updated from canonical docs: verity-positioning-v2_3.md, verity-personas-v1_1.md</em></p>
  <p><a href="https://www.notion.so/[link-to-old-v2_2]">← Version 2.2</a></p>
  <details>
    <summary>Changelog</summary>
    <ul>
      <li>Updated ICP from "CS Principal / Senior CSM" to "Jordan / CS Principal / Author" — canonical sync</li>
      <li>Replaced use case: "Optera carbon accounting" → "Acme customer success" — canonical sales motion updated</li>
      <li>Updated positioning: "knowledge base" → "skill graph" — aligns with verity-positioning-v2_3.md</li>
    </ul>
  </details>
</div>
```

### Version Incrementing

**Increment rule:**
- Major (v2 → v3): Structural change (new section, removed feature)
- Minor (v2.1 → v2.2): Content update (copy changed, example updated, persona renamed)
- Patch (v2.2.3 → v2.2.4): Bugfix or typo (design token value corrected)

**Version placement:**
- In artifact filename: `verity-marketing-v2_29.html` → `verity-marketing-v2_30.html`
- In artifact header: `<h1>Verity Marketing v2.30</h1>` or JSX prop `version="2.30"`
- In Notion child page title (if archiving old version): rename to `[name] v2.29 (archived — 2026-03-17)`

### Changelog & Provenance

Every artifact update must include:

1. **What changed** — specific field(s) updated
2. **Why it changed** — which canonical doc(s) triggered the update
3. **When** — timestamp
4. **Link to old version** — Notion archive link or GitHub commit hash (if tracked)

**Changelog format** (inside artifact header, details tag):
```
- Updated [field]: "[old value]" → "[new value]" — canonical [doc] [section] updated [date]
- Resolved [conflict signal]: [explanation]
```

**Notion tracking:**
- Create subsection: 🗂 Verity Claude Artifacts → 🔧 Artifact Coherence (new, same level as ⚙️ Engineering, 🔬 Pilot)
- Create database: `Artifact Version History` under that subsection
- Baseline Snapshot: Simple text block with last-scanned timestamp + list of canonical docs
- Fields in Version History DB: artifact_name, version, published_date, canonical_sources_updated, changelog, link_to_old_version, conflicts_resolved, severity_max
- Sync this DB from each artifact update automatically

## Implementation

### Data Flow

```
┌─ Canonical Docs
│  └─ [baseline snapshot]
│     └─ Change detection (diff against baseline)
│        └─ Downstream artifact identification
│           └─ Coherence check (all signals)
│              ├─ Conflict matrix
│              └─ Proposed updates
│                 └─ [await user confirm or auto-sync]
│                    └─ Update artifacts (surgical replace)
│                       └─ Increment versions
│                          └─ Log changes
│                             └─ Archive old version in Notion
│                                └─ Update version history DB
│                                   └─ Report
└─ Design Artifacts (updated state)
```

### Key Decisions

1. **Change detection is diff-based, not timestamp-based** — allows catching changes that were made externally or in prior sessions
2. **Confirmation step in manual mode** — prevents accidental overwrites; skip in post-hook mode for speed
3. **Artifacts are the mutable layer** — canonical docs are never changed by this skill
4. **Notion is the audit trail** — all updates logged there for retrieval and compliance
5. **HTML/JSX/MD all supported** — handles Verity's mixed artifact formats

## Failure Modes

1. **Canonical doc is malformed** → Coherence check fails gracefully, reports which doc and section
2. **Artifact section can't be found** → Flags as "manual intervention required", doesn't update
3. **Conflict signals are ambiguous** → Returns both sides of ambiguity, asks for clarification
4. **Webhook misconfigured** → Falls back to manual mode, no silent failures
5. **Notion API limits hit** → Batches remaining updates, returns partial completion

## Integration Points

- **verity-doc-updater** — Can be called as post-hook after doc updates
- **Notion MCP** — Reads/writes baselines, archives old versions, updates version history DB
- **Atlassian MCP** — Could create tickets for high-priority coherence conflicts (future)
- **Filesystem Archive** (`/mnt/project-archive/`) — Old artifact versions stored with timestamps and metadata

---

## Quick Start

**First time:**
```
canonical-coherence-enforcer: initialize
```

**After canonical doc changes:**
```
canonical-coherence-enforcer: sync-from-canonical
```

**Check for conflicts anytime:**
```
canonical-coherence-enforcer: audit-all-artifacts
```

**Track all updates:**
Check Notion → Verity Claude Artifacts → Artifact Coherence → Artifact Version History DB
