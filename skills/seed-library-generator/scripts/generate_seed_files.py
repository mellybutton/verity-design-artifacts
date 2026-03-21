#!/usr/bin/env python3
"""
seed-library-generator: generate_seed_files.py
Converts a raw rules JSON array into three output formats:
  1. CSV  — human review / spreadsheet
  2. JSON — Supabase JS client import
  3. SQL  — Supabase SQL Editor / psql

Usage:
  python3 generate_seed_files.py \
    --input seed-rules-raw.json \
    --company "Lyra Health" \
    --vertical "healthtech" \
    [--tenant-id UUID] \
    [--count 47] \
    [--output-dir /mnt/user-data/outputs]

Input JSON shape (array of objects):
  [
    {
      "when_clause": "...",
      "then_clause": "...",
      "domain": "onboarding|escalation|exceptions|pricing|compliance|renewal",
      "scope": "compliance|workflow|advisory",
      "hedge_tag": "always|usually|sometimes|it_depends",
      "confidence": 3
    }
  ]

v1 · March 20, 2026
"""

import argparse
import csv
import io
import json
import re
import sys
import uuid
from datetime import datetime, timezone


def slugify(text: str) -> str:
    """Convert text to lowercase hyphenated slug."""
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def count_predicates(when_clause: str) -> int:
    """Count AND/OR conditions in a when_clause for specificity field."""
    tokens = re.findall(r"\b(?:AND|OR|and|or)\b", when_clause)
    return len(tokens) + 1  # base condition + each conjunction


def build_full_record(rule: dict, vertical: str, tenant_id: str, now_iso: str) -> dict:
    """Expand a raw rule into a full rules-table-compatible record."""
    return {
        "rule_id": str(uuid.uuid4()),
        "revision_id": 1,
        "tenant_id": tenant_id,
        "scope": rule.get("scope", "workflow"),
        "vertical": vertical,
        "domain": rule.get("domain", "onboarding"),
        "when_clause": rule["when_clause"],
        "then_clause": rule["then_clause"],
        "because_clause": None,
        "hedge_tag": rule.get("hedge_tag", "usually"),
        "confidence": rule.get("confidence", 3),
        "source": "generated",
        "source_reference": {
            "type": "review",
            "external_id": "seed-gen-v1",
            "url": None,
        },
        "status": "pending",
        "author_id": f"verity-baseline-{slugify(vertical)}",
        "confirmed_by": None,
        "effective_from": None,
        "effective_to": None,
        "priority": None,
        "specificity": count_predicates(rule["when_clause"]),
        "dependencies": {},
        "regulatory_citation": None,
        "last_used_at": None,
        "staleness_status": "fresh",
        "when_embedding": None,
        "created_at": now_iso,
        "updated_at": now_iso,
    }


def generate_csv(rules: list[dict], vertical: str) -> str:
    """Generate CSV string with human-review columns."""
    output = io.StringIO()
    writer = csv.writer(output, quoting=csv.QUOTE_ALL)
    writer.writerow(
        ["when_clause", "then_clause", "domain", "scope", "hedge_tag", "confidence", "vertical"]
    )
    for r in rules:
        writer.writerow(
            [
                r["when_clause"],
                r["then_clause"],
                r.get("domain", ""),
                r.get("scope", ""),
                r.get("hedge_tag", ""),
                r.get("confidence", 3),
                vertical,
            ]
        )
    return output.getvalue()


def generate_json(records: list[dict]) -> str:
    """Generate JSON string matching rules table schema."""
    return json.dumps(records, indent=2, default=str)


def sql_val(v) -> str:
    """Format a Python value as a SQL literal."""
    if v is None:
        return "NULL"
    if isinstance(v, bool):
        return "TRUE" if v else "FALSE"
    if isinstance(v, int):
        return str(v)
    if isinstance(v, dict):
        return f"'{json.dumps(v)}'::jsonb"
    # String — escape single quotes
    escaped = str(v).replace("'", "''")
    return f"'{escaped}'"


def generate_sql(records: list[dict], company: str, vertical: str) -> str:
    """Generate SQL INSERT statements for each record."""
    columns = [
        "rule_id", "revision_id", "tenant_id", "scope", "vertical", "domain",
        "when_clause", "then_clause", "because_clause", "hedge_tag", "confidence",
        "source", "source_reference", "status", "author_id", "confirmed_by",
        "effective_from", "effective_to", "priority", "specificity", "dependencies",
        "regulatory_citation", "last_used_at", "staleness_status",
        "created_at", "updated_at",
    ]

    lines = [
        f"-- Verity Seed Library: {company}",
        f"-- Vertical: {vertical}",
        f"-- Rules: {len(records)}",
        f"-- Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        f"-- Schema: rules table v4 (verity-data-schema-v4.md)",
        f"-- BECAUSE fields: ALL NULL — awaiting practitioner authorship",
        "",
        "BEGIN;",
        "",
    ]

    col_str = ", ".join(columns)
    for rec in records:
        vals = ", ".join(sql_val(rec.get(c)) for c in columns)
        lines.append(f"INSERT INTO rules ({col_str})")
        lines.append(f"  VALUES ({vals});")
        lines.append("")

    lines.append("COMMIT;")
    lines.append("")
    lines.append(
        f"-- Verify: SELECT domain, count(*) FROM rules "
        f"WHERE author_id = 'verity-baseline-{slugify(vertical)}' GROUP BY domain ORDER BY domain;"
    )
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Generate seed library output files")
    parser.add_argument("--input", required=True, help="Path to raw rules JSON file")
    parser.add_argument("--company", required=True, help="Company name")
    parser.add_argument("--vertical", required=True, help="Industry vertical")
    parser.add_argument("--tenant-id", default=None, help="Tenant UUID (auto-generated if omitted)")
    parser.add_argument("--output-dir", default="/mnt/user-data/outputs", help="Output directory")
    args = parser.parse_args()

    # Read raw rules
    with open(args.input, "r") as f:
        raw_rules = json.load(f)

    if not isinstance(raw_rules, list) or len(raw_rules) == 0:
        print("ERROR: Input must be a non-empty JSON array of rules.", file=sys.stderr)
        sys.exit(1)

    company_slug = slugify(args.company)
    vertical = args.vertical.strip()
    tenant_id = args.tenant_id or str(uuid.uuid4())
    now_iso = datetime.now(timezone.utc).isoformat()

    # Build full records
    records = [build_full_record(r, vertical, tenant_id, now_iso) for r in raw_rules]

    # Generate outputs
    csv_content = generate_csv(raw_rules, vertical)
    json_content = generate_json(records)
    sql_content = generate_sql(records, args.company, vertical)

    # Write files
    base = f"verity-seed-library-{company_slug}-v1"
    csv_path = f"{args.output_dir}/{base}.csv"
    json_path = f"{args.output_dir}/{base}.json"
    sql_path = f"{args.output_dir}/{base}.sql"

    with open(csv_path, "w") as f:
        f.write(csv_content)
    with open(json_path, "w") as f:
        f.write(json_content)
    with open(sql_path, "w") as f:
        f.write(sql_content)

    # Summary
    domain_counts = {}
    for r in raw_rules:
        d = r.get("domain", "unknown")
        domain_counts[d] = domain_counts.get(d, 0) + 1

    print(f"✓ Generated {len(records)} rules for {args.company} ({vertical})")
    print(f"  Tenant: {tenant_id}")
    print(f"  Distribution: {', '.join(f'{d}({c})' for d, c in sorted(domain_counts.items()))}")
    print(f"  CSV:  {csv_path}")
    print(f"  JSON: {json_path}")
    print(f"  SQL:  {sql_path}")


if __name__ == "__main__":
    main()
