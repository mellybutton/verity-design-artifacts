---
name: seed-library-generator
description: >
  Generates a pilot-ready IF/THEN baseline seed library for any prospect company.
  Takes a company name, researches them via web search, generates domain-specific
  CS rules across 6 domains (onboarding, escalation, exceptions, pricing, compliance,
  renewal), and outputs Supabase-ready JSON, CSV, and SQL insert files. Optionally
  loads directly into Supabase via MCP. Use this skill whenever Melanie or Hilary says
  anything like: "seed a library for [company]", "generate baseline rules for [company]",
  "prep a seed library", "create rules for [prospect]", "baseline for [company name]",
  "seed [company]", "generate rules for pilot", or any variation of wanting to create
  a pre-seeded rule library for a new or prospective customer. Also use when someone
  says "run the seed generator" or drops a company name in the context of pilot prep.
  The React artifact version (seed-library-generator-v1.jsx on GitHub) is the interactive
  UI version — this skill is the CLI/conversation version that produces downloadable files.
---

# seed-library-generator — v1

> Enter a company name → get a pilot-ready IF/THEN seed library with CSV, JSON, and SQL outputs.

---

## Trigger phrases

"seed a library for [company]", "generate baseline rules for [company]", "prep a seed library", "create rules for [prospect]", "baseline for [company]", "seed [company]", "generate rules for pilot", "run the seed generator", "seed library for [company name]"

---

## What it does (ELI5)

You give it a company name. It researches the company, figures out their vertical, CS complexity areas, and customer lifecycle challenges, then generates ~47 domain-specific IF/THEN rules that are specific enough to provoke real confirmation decisions from Jordan CS Principal. Outputs three files ready for Hilary to load.

---

## Inputs

| Input | Required | Default | Notes |
|---|---|---|---|
| Company name | YES | — | The prospect or pilot customer |
| Rule count | no | 47 | Range: 20–80. 47 matches the Settings UI baseline |
| tenant_id | no | auto-generated UUID | Override if loading into existing Supabase tenant |

---

## Step 1: Research the company

Use `web_search` to find:
- What the company does (product/service, 1–2 sentences)
- Their target market and customer type (SMB / mid-market / enterprise)
- Their industry vertical (e.g., fintech, healthtech, carbon/ESG, legaltech, edtech, proptech)
- Company stage (startup / growth / enterprise)
- 4–6 key CS operational complexity areas
- 3–5 customer lifecycle challenges specific to their space
- Why each of the 6 domains matters for this company specifically

Run 2–3 searches to get solid coverage. Typical queries:
- `[company name] product what does it do`
- `[company name] customer success challenges`
- `[company name] crunchbase funding stage`

Compile findings into a **Company Research Profile** and present it to the user for confirmation before proceeding. Format:

```
## Company Research Profile

**Company:** [name]
**Product:** [1–2 sentence description]
**Vertical:** [vertical]
**Target market:** [market segment]
**Stage:** [stage]

**CS Complexity Areas:**
- [area 1]
- [area 2]
- ...

**Customer Lifecycle Challenges:**
- [challenge 1]
- [challenge 2]
- ...

**Domain Relevance:**
- Onboarding: [why this matters for them]
- Escalation: [why]
- Exceptions: [why]
- Pricing: [why]
- Compliance: [why]
- Renewal: [why]
```

Wait for user confirmation. If the user corrects anything (wrong vertical, missing complexity area, etc.), update the profile before proceeding.

---

## Step 2: Generate rules

Using the confirmed research profile, generate IF/THEN rules across all 6 domains.

### Domain distribution

Weight toward the most relevant domains for the vertical. Approximate distribution for a 47-rule library:

| Domain | Typical count | Notes |
|---|---|---|
| onboarding | 8–10 | Always heavy — first-touch is universal |
| escalation | 7–9 | Heavier for regulated/enterprise verticals |
| exceptions | 7–9 | Heavier for complex-product verticals |
| pricing | 6–8 | Heavier for usage-based/multi-tier pricing |
| compliance | 5–7 | Heavier for regulated verticals (health, finance, legal) |
| renewal | 7–9 | Heavier for high-NRR businesses |

### Quality bar

Each rule MUST meet these criteria:

**GOOD rules (generate these):**
- Specific enough that a senior CSM would pause and think "do we actually do this?"
- Include compound conditions (AND/OR) — not just single triggers
- Reference real operational context (account age, MRR thresholds, usage patterns, stakeholder changes)
- Mix broad rules with edge-case rules
- Use the company's vertical language (not generic CS playbook language)

**BAD rules (never generate these):**
- "IF customer is unhappy THEN escalate" → too vague, 100% confirmation, no signal
- "IF customer asks about pricing THEN refer to pricing page" → trivially obvious
- Generic rules that could apply to any company regardless of vertical
- Rules that restate common sense

**Target outcome:** ~24% divergence rate (Jordan edits the rule), ~28% dismiss rate (Jordan says "not applicable"). If every rule would get confirmed without thought, the baseline is too easy and produces no signal.

### Rule schema

Each rule must have:

| Field | Value | Notes |
|---|---|---|
| `when_clause` | text | The IF condition. Do NOT prefix with "IF" |
| `then_clause` | text | The action. Do NOT prefix with "THEN" |
| `because_clause` | null | **ALWAYS null.** Never AI-generated. Jordan authors this. |
| `domain` | one of: `onboarding`, `escalation`, `exceptions`, `pricing`, `compliance`, `renewal` | |
| `scope` | one of: `compliance`, `workflow`, `advisory` | Drives tie-break policy |
| `hedge_tag` | one of: `always`, `usually`, `sometimes`, `it_depends` | |
| `confidence` | 3 | Always 3 for baseline rules |
| `source` | `generated` | Always `generated` for seed rules |
| `status` | `pending` | Always `pending` — awaiting Jordan's review |
| `author_id` | `verity-baseline-[vertical-slug]` | e.g., `verity-baseline-healthtech` |

---

## Step 3: Present for review

Show the generated rules in a compact table grouped by domain. For each rule show:
- Domain badge
- Scope
- IF clause
- THEN clause
- Hedge tag

Ask the user: "Review the rules above. Tell me to cut, edit, or add any before I export. Or say 'export' to generate all output files."

If the user requests edits, apply them and re-present the affected rules.

---

## Step 4: Generate output files

Once the user approves, generate THREE output files using the Python script at `scripts/generate_seed_files.py`:

### 4a. Run the generation script

```bash
cd /home/claude
python3 /path/to/seed-library-generator/scripts/generate_seed_files.py \
  --input /home/claude/seed-rules-raw.json \
  --company "[company name]" \
  --vertical "[vertical]" \
  --tenant-id "[tenant_id or auto]"
```

If the script is not available, generate the files manually following the specs below.

### 4b. Output file specs

**File 1: CSV** (`verity-seed-library-[company-slug]-v1.csv`)
- Headers: `when_clause,then_clause,domain,scope,hedge_tag,confidence,vertical`
- One row per rule
- All values quoted, commas in values escaped
- Purpose: Human review, spreadsheet import, sharing with customer

**File 2: JSON** (`verity-seed-library-[company-slug]-v1.json`)
- Array of objects matching the `rules` table schema exactly
- Every field from the schema populated (nulls where appropriate)
- UUIDs generated for `rule_id`
- `revision_id`: 1
- `tenant_id`: provided or auto-generated UUID
- `because_clause`: null
- `confirmed_by`: null
- `effective_from`: null
- `effective_to`: null
- `priority`: null
- `specificity`: computed (count AND/OR conditions in when_clause)
- `dependencies`: `{}`
- `regulatory_citation`: null
- `last_used_at`: null
- `staleness_status`: "fresh"
- `when_embedding`: null
- `source_reference`: `{ "type": "review", "external_id": "seed-gen-v1", "url": null }`
- `created_at` / `updated_at`: current ISO timestamp
- Purpose: Direct Supabase import via `supabase.from('rules').insert()`

**File 3: SQL** (`verity-seed-library-[company-slug]-v1.sql`)
- `INSERT INTO rules (...) VALUES (...)` statements
- One INSERT per rule (not bulk — easier to debug)
- All UUIDs, enums, and timestamps properly formatted for PostgreSQL
- Includes a header comment with company name, vertical, rule count, and generation date
- Purpose: Direct paste into Supabase SQL Editor or psql

### 4c. Copy all files to outputs

```bash
cp /home/claude/verity-seed-library-*.{csv,json,sql} /mnt/user-data/outputs/
```

Present all three files to the user with `present_files`.

---

## Step 5: Optional — Load into Supabase

If the Supabase MCP is available and the user wants to load directly:

1. Confirm the target project and tenant_id
2. Use `Supabase:execute_sql` to run the SQL file contents
3. Verify with a count query: `SELECT domain, count(*) FROM rules WHERE author_id = 'verity-baseline-[vertical]' GROUP BY domain`
4. Report results

If Supabase MCP is not available, tell the user: "Supabase MCP isn't toggled on — Hilary can load the JSON via the Supabase client library or paste the SQL file into the SQL Editor."

---

## Step 6: Summary

After export, summarize:

```
## Seed Library Generated

**Company:** [name]
**Vertical:** [vertical]
**Rules:** [count] across [domain count] domains
**Distribution:** onboarding ([n]), escalation ([n]), exceptions ([n]), pricing ([n]), compliance ([n]), renewal ([n])

**Files:**
- CSV: verity-seed-library-[slug]-v1.csv (human review)
- JSON: verity-seed-library-[slug]-v1.json (Supabase JS client)
- SQL: verity-seed-library-[slug]-v1.sql (SQL Editor / psql)

**Schema alignment:** rules table v4 (verity-data-schema-v4.md)
**BECAUSE fields:** all null — awaiting Jordan CS Principal authorship
**Status:** all `pending` — awaiting practitioner review
```

---

## Guardrails

- BECAUSE is **always null**. If you catch yourself writing a because_clause, stop. This is the moat.
- Never generate rules so generic they'd get 100% confirmation — that's a useless baseline.
- Never generate rules so niche they'd get 100% dismissal — that's an annoying baseline.
- `source` is always `generated`, `status` is always `pending`, `confidence` is always 3.
- `author_id` follows the pattern `verity-baseline-[vertical-slug]` (lowercase, hyphens, no spaces).
- All three output files must be generated — never just one format.
- The CSV is the human-readable review artifact. The JSON is the machine-loadable artifact. The SQL is the DBA artifact. All three serve different users.

---

## Tools required

- `web_search` (company research)
- `bash_tool` / `create_file` (file generation)
- `present_files` (deliver outputs)
- `Supabase:execute_sql` (optional — direct load)

---

*seed-library-generator v1 · March 20, 2026*
