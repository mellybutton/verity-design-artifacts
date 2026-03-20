import { useState, useRef, useCallback } from "react";

const DOMAINS = ["onboarding", "escalation", "exceptions", "pricing", "compliance", "renewal"];
const SCOPES = ["workflow", "compliance", "advisory"];
const HEDGE_TAGS = ["always", "usually", "sometimes", "it_depends"];

// ─── Styles ───
const font = `'DM Sans', sans-serif`;
const mono = `'DM Mono', monospace`;
const display = `'Fraunces', serif`;

const colors = {
  bg: "#F8F9FB",
  card: "#FFFFFF",
  border: "#DDE1EA",
  borderMid: "#C8CDD8",
  text: "#111827",
  textSec: "#4A5369",
  textMuted: "#8891A5",
  indigo: "#4752F5",
  indigoHover: "#3340D4",
  indigo50: "#EEF0FF",
  teal: "#0EA58D",
  teal10: "#E6F7F4",
  amber: "#F59E0B",
  amber10: "#FEF7E6",
  rose: "#F43F5E",
  rose10: "#FFF1F3",
  green: "#22C55E",
  green10: "#EDFCF2",
};

const domainColors = {
  onboarding: { bg: colors.indigo50, text: colors.indigo, border: "#C7CBFC" },
  escalation: { bg: colors.rose10, text: colors.rose, border: "#FECDD3" },
  exceptions: { bg: colors.amber10, text: "#B45309", border: "#FDE68A" },
  pricing: { bg: colors.teal10, text: "#047857", border: "#99F6E4" },
  compliance: { bg: "#F0E6FF", text: "#7C3AED", border: "#C4B5FD" },
  renewal: { bg: colors.green10, text: "#15803D", border: "#BBF7D0" },
};

const RESEARCH_SYSTEM = `You are a company research analyst. Given a company name, search the web to understand:
1. What the company does (product/service)
2. Their target market and customer type (SMB, mid-market, enterprise)
3. Their industry vertical
4. Approximate company size/stage (startup, growth, enterprise)
5. Key operational complexity areas for their CS team
6. Common customer lifecycle challenges in their space

Return ONLY valid JSON (no markdown, no backticks, no preamble) with this exact shape:
{
  "company_name": "string",
  "product_description": "string (1-2 sentences)",
  "target_market": "string",
  "vertical": "string (e.g. fintech, healthtech, carbon/ESG, legaltech, edtech, etc.)",
  "company_stage": "string (startup/growth/enterprise)",
  "cs_complexity_areas": ["string array of 4-6 key CS operational areas"],
  "customer_lifecycle_challenges": ["string array of 3-5 challenges"],
  "domain_relevance": {
    "onboarding": "string (why this domain matters for this company, 1 sentence)",
    "escalation": "string",
    "exceptions": "string",
    "pricing": "string",
    "compliance": "string",
    "renewal": "string"
  }
}`;

const RULES_SYSTEM = `You are a Customer Success operations expert generating baseline IF/THEN rules for a B2B SaaS company's CS team. These rules will be pre-seeded into a rule library that CS practitioners will review, confirm, edit, or dismiss.

CRITICAL CONSTRAINTS:
- Output ONLY the JSON array. No markdown, no backticks, no preamble, no explanation.
- Generate exactly {ruleCount} rules total, distributed across 6 domains: onboarding, escalation, exceptions, pricing, compliance, renewal
- Each rule has an IF clause (the condition) and a THEN clause (the action)
- NO BECAUSE clause — that is ALWAYS authored by the human practitioner, never generated
- Rules must be specific enough to provoke real disagreement — avoid generic platitudes
- Include edge cases and nuanced situations, not just obvious best practices
- Mix specificity levels: some broad, some very specific to the vertical
- Each rule needs a scope (workflow/compliance/advisory) and hedge_tag (always/usually/sometimes/it_depends)
- Confidence is 3 for all baseline rules

QUALITY BAR:
- BAD: "IF customer is unhappy THEN escalate" (too vague, everyone confirms, no signal)
- GOOD: "IF customer's primary champion leaves the account AND renewal is within 90 days THEN schedule executive sponsor bridge call within 48 hours" (specific enough to provoke real thought about whether this matches their process)
- BAD: "IF customer asks about pricing THEN refer to pricing page" (trivially obvious)
- GOOD: "IF customer requests discount >15% on renewal AND account has had 2+ escalations in trailing quarter THEN route to retention specialist before quoting" (judgment-laden, team-specific)

Rules should feel like they were written by a senior CSM who knows THIS company's domain — not a generic CS playbook.

Return a JSON array where each item has:
{
  "when_clause": "string (the IF condition — do NOT include the word 'IF' at the start)",
  "then_clause": "string (the THEN action — do NOT include the word 'THEN' at the start)",
  "domain": "onboarding|escalation|exceptions|pricing|compliance|renewal",
  "scope": "workflow|compliance|advisory",
  "hedge_tag": "always|usually|sometimes|it_depends",
  "confidence": 3
}`;

function Badge({ children, bg, color, border }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 9999,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: mono,
        background: bg,
        color: color,
        border: `1px solid ${border}`,
        letterSpacing: ".02em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function DomainBadge({ domain }) {
  const c = domainColors[domain] || domainColors.onboarding;
  return <Badge bg={c.bg} color={c.text} border={c.border}>{domain}</Badge>;
}

function ScopeBadge({ scope }) {
  const map = {
    workflow: { bg: colors.indigo50, color: colors.indigo, border: "#C7CBFC" },
    compliance: { bg: "#F0E6FF", color: "#7C3AED", border: "#C4B5FD" },
    advisory: { bg: colors.amber10, color: "#B45309", border: "#FDE68A" },
  };
  const c = map[scope] || map.workflow;
  return <Badge bg={c.bg} color={c.text} border={c.border}>{scope}</Badge>;
}

function HedgeBadge({ tag }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 6px",
        borderRadius: 4,
        fontSize: 10,
        fontFamily: mono,
        color: colors.textMuted,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
      }}
    >
      {tag}
    </span>
  );
}

export default function SeedLibraryGenerator() {
  const [companyName, setCompanyName] = useState("");
  const [ruleCount, setRuleCount] = useState(47);
  const [stage, setStage] = useState("input"); // input | researching | generating | review | exporting
  const [research, setResearch] = useState(null);
  const [rules, setRules] = useState([]);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [deletedIndices, setDeletedIndices] = useState(new Set());
  const [editingIdx, setEditingIdx] = useState(null);
  const [editDraft, setEditDraft] = useState(null);
  const abortRef = useRef(null);

  const activeRules = rules.filter((_, i) => !deletedIndices.has(i));
  const filteredRules = selectedDomain === "all"
    ? activeRules
    : activeRules.filter((r) => r.domain === selectedDomain);

  const domainCounts = {};
  DOMAINS.forEach((d) => {
    domainCounts[d] = activeRules.filter((r) => r.domain === d).length;
  });

  // ─── API call helper ───
  const callClaude = useCallback(async (system, userMsg, useSearch = false) => {
    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system,
      messages: [{ role: "user", content: userMsg }],
    };
    if (useSearch) {
      body.tools = [{ type: "web_search_20250305", name: "web_search" }];
    }
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    // Extract text from potentially mixed content blocks
    const textBlocks = data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text);
    return textBlocks.join("\n");
  }, []);

  // ─── Research + Generate pipeline ───
  const runPipeline = useCallback(async () => {
    setError(null);
    setRules([]);
    setDeletedIndices(new Set());
    setEditingIdx(null);

    // Step 1: Research
    setStage("researching");
    setProgress("Searching the web for company information…");
    try {
      const rawResearch = await callClaude(
        RESEARCH_SYSTEM,
        `Research the company: ${companyName}. Find their product, vertical, customer type, and CS operational complexity.`,
        true
      );
      // Parse JSON from response
      let parsed;
      try {
        const cleaned = rawResearch.replace(/```json|```/g, "").trim();
        // Find the first { and last }
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");
        if (start === -1 || end === -1) throw new Error("No JSON object found");
        parsed = JSON.parse(cleaned.substring(start, end + 1));
      } catch (e) {
        throw new Error("Could not parse research results. Try a more well-known company name.");
      }
      setResearch(parsed);

      // Step 2: Generate rules
      setStage("generating");
      setProgress(`Generating ${ruleCount} domain-specific rules for ${parsed.company_name || companyName}…`);

      const rulesPrompt = `Company: ${parsed.company_name || companyName}
Product: ${parsed.product_description}
Vertical: ${parsed.vertical}
Target market: ${parsed.target_market}
Stage: ${parsed.company_stage}
CS complexity areas: ${parsed.cs_complexity_areas?.join(", ")}
Customer lifecycle challenges: ${parsed.customer_lifecycle_challenges?.join(", ")}

Domain context:
${Object.entries(parsed.domain_relevance || {}).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

Generate ${ruleCount} IF/THEN rules for this company's CS baseline library. Distribute across all 6 domains with heavier weight on domains most relevant to their vertical. Include edge cases.`;

      const rawRules = await callClaude(
        RULES_SYSTEM.replace("{ruleCount}", String(ruleCount)),
        rulesPrompt,
        false
      );

      let parsedRules;
      try {
        const cleaned = rawRules.replace(/```json|```/g, "").trim();
        const start = cleaned.indexOf("[");
        const end = cleaned.lastIndexOf("]");
        if (start === -1 || end === -1) throw new Error("No JSON array found");
        parsedRules = JSON.parse(cleaned.substring(start, end + 1));
      } catch (e) {
        throw new Error("Could not parse generated rules. Try again.");
      }

      setRules(parsedRules);
      setStage("review");
      setProgress("");
    } catch (e) {
      setError(e.message);
      setStage("input");
      setProgress("");
    }
  }, [companyName, ruleCount, callClaude]);

  // ─── Edit handlers ───
  const startEdit = (idx) => {
    const realIdx = rules.indexOf(filteredRules[idx]);
    setEditingIdx(realIdx);
    setEditDraft({ ...rules[realIdx] });
  };
  const saveEdit = () => {
    if (editingIdx !== null && editDraft) {
      const next = [...rules];
      next[editingIdx] = editDraft;
      setRules(next);
    }
    setEditingIdx(null);
    setEditDraft(null);
  };
  const cancelEdit = () => {
    setEditingIdx(null);
    setEditDraft(null);
  };
  const deleteRule = (filteredIdx) => {
    const realIdx = rules.indexOf(filteredRules[filteredIdx]);
    setDeletedIndices((prev) => new Set([...prev, realIdx]));
  };

  // ─── Export ───
  const exportJSON = () => {
    const vertical = research?.vertical || "unknown";
    const output = activeRules.map((r, i) => ({
      rule_id: crypto.randomUUID(),
      revision_id: 1,
      scope: r.scope,
      vertical,
      domain: r.domain,
      when_clause: r.when_clause,
      then_clause: r.then_clause,
      because_clause: null,
      hedge_tag: r.hedge_tag,
      confidence: r.confidence || 3,
      source: "generated",
      status: "pending",
      author_id: `verity-baseline-${vertical.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      confirmed_by: null,
      source_reference: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    const blob = new Blob([JSON.stringify(output, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `verity-seed-library-${(research?.company_name || companyName).toLowerCase().replace(/\s+/g, "-")}-v1.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const vertical = research?.vertical || "unknown";
    const headers = ["when_clause", "then_clause", "domain", "scope", "hedge_tag", "confidence", "vertical"];
    const csvRows = [headers.join(",")];
    activeRules.forEach((r) => {
      csvRows.push(
        [r.when_clause, r.then_clause, r.domain, r.scope, r.hedge_tag, r.confidence || 3, vertical]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      );
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `verity-seed-library-${(research?.company_name || companyName).toLowerCase().replace(/\s+/g, "-")}-v1.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Render ───
  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        fontFamily: font,
        color: colors.text,
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=DM+Mono:wght@400;500&family=Fraunces:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div
        style={{
          background: colors.card,
          borderBottom: `1px solid ${colors.border}`,
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <h1 style={{ fontFamily: display, fontWeight: 400, fontSize: 22, fontStyle: "italic", margin: 0 }}>
              Seed Library Generator
            </h1>
            <span style={{ fontFamily: mono, fontSize: 11, color: colors.textMuted }}>v1</span>
          </div>
          <p style={{ fontSize: 13, color: colors.textSec, margin: "4px 0 0" }}>
            Enter a prospect company → get a pilot-ready IF/THEN rule library
          </p>
        </div>
        {stage === "review" && (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={exportCSV} style={btnGhost}>Export CSV</button>
            <button onClick={exportJSON} style={btnPrimary}>Export JSON (Supabase-ready)</button>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 80px" }}>
        {/* ─── Input Stage ─── */}
        {(stage === "input" || stage === "researching" || stage === "generating") && (
          <div
            style={{
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              padding: 32,
              maxWidth: 560,
              margin: "40px auto",
            }}
          >
            <h2 style={{ fontFamily: display, fontWeight: 300, fontSize: 20, margin: "0 0 4px" }}>
              Which company are you seeding?
            </h2>
            <p style={{ fontSize: 13, color: colors.textSec, margin: "0 0 20px" }}>
              We'll research them, then generate domain-specific CS rules for their vertical.
            </p>

            <label style={labelStyle}>Company name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Optera, Gainsight, Lattice, Gusto…"
              disabled={stage !== "input"}
              style={inputStyle}
              onKeyDown={(e) => {
                if (e.key === "Enter" && companyName.trim() && stage === "input") runPipeline();
              }}
            />

            <label style={{ ...labelStyle, marginTop: 16 }}>Rule count</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20 }}>
              <input
                type="range"
                min={20}
                max={80}
                value={ruleCount}
                onChange={(e) => setRuleCount(Number(e.target.value))}
                disabled={stage !== "input"}
                style={{ flex: 1 }}
              />
              <span style={{ fontFamily: mono, fontSize: 14, color: colors.textSec, minWidth: 30, textAlign: "right" }}>
                {ruleCount}
              </span>
            </div>

            {stage === "input" && (
              <button
                onClick={runPipeline}
                disabled={!companyName.trim()}
                style={{
                  ...btnPrimary,
                  width: "100%",
                  padding: "12px 0",
                  opacity: companyName.trim() ? 1 : 0.5,
                  cursor: companyName.trim() ? "pointer" : "not-allowed",
                }}
              >
                Research &amp; Generate
              </button>
            )}

            {(stage === "researching" || stage === "generating") && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={spinnerStyle} />
                  <span style={{ fontSize: 13, color: colors.indigo, fontWeight: 500 }}>{progress}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ ...stepDot, background: colors.indigo }} />
                  <div style={{ ...stepDot, background: stage === "generating" ? colors.indigo : colors.border }} />
                </div>
              </div>
            )}

            {error && (
              <div
                style={{
                  marginTop: 16,
                  padding: "10px 14px",
                  background: colors.rose10,
                  border: `1px solid ${colors.rose}20`,
                  borderRadius: 8,
                  fontSize: 13,
                  color: colors.rose,
                }}
              >
                {error}
              </div>
            )}
          </div>
        )}

        {/* ─── Review Stage ─── */}
        {stage === "review" && (
          <>
            {/* Company research summary */}
            {research && (
              <div
                style={{
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 12,
                  padding: "20px 24px",
                  marginBottom: 20,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h2 style={{ fontFamily: display, fontWeight: 400, fontSize: 18, margin: "0 0 4px", fontStyle: "italic" }}>
                      {research.company_name || companyName}
                    </h2>
                    <p style={{ fontSize: 13, color: colors.textSec, margin: 0, maxWidth: 600, lineHeight: 1.5 }}>
                      {research.product_description}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <Badge bg={colors.indigo50} color={colors.indigo} border="#C7CBFC">{research.vertical}</Badge>
                    <Badge bg={colors.bg} color={colors.textSec} border={colors.border}>{research.company_stage}</Badge>
                    <Badge bg={colors.teal10} color={colors.teal} border="#99F6E4">{research.target_market}</Badge>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                  {research.cs_complexity_areas?.map((area, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "3px 8px",
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 6,
                        fontSize: 11,
                        color: colors.textSec,
                      }}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats bar */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 16,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => setSelectedDomain("all")}
                  style={selectedDomain === "all" ? filterActive : filterInactive}
                >
                  All ({activeRules.length})
                </button>
                {DOMAINS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDomain(d)}
                    style={selectedDomain === d ? filterActive : filterInactive}
                  >
                    {d} ({domainCounts[d] || 0})
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setStage("input");
                  setResearch(null);
                  setRules([]);
                  setDeletedIndices(new Set());
                  setCompanyName("");
                }}
                style={btnGhost}
              >
                ← New company
              </button>
            </div>

            {/* Rules list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredRules.map((rule, fIdx) => {
                const realIdx = rules.indexOf(rule);
                const isEditing = editingIdx === realIdx;

                if (isEditing && editDraft) {
                  return (
                    <div
                      key={realIdx}
                      style={{
                        background: colors.card,
                        border: `2px solid ${colors.indigo}`,
                        borderRadius: 10,
                        padding: "16px 20px",
                      }}
                    >
                      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                        <select
                          value={editDraft.domain}
                          onChange={(e) => setEditDraft({ ...editDraft, domain: e.target.value })}
                          style={selectStyle}
                        >
                          {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select
                          value={editDraft.scope}
                          onChange={(e) => setEditDraft({ ...editDraft, scope: e.target.value })}
                          style={selectStyle}
                        >
                          {SCOPES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select
                          value={editDraft.hedge_tag}
                          onChange={(e) => setEditDraft({ ...editDraft, hedge_tag: e.target.value })}
                          style={selectStyle}
                        >
                          {HEDGE_TAGS.map((h) => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                      <label style={{ ...labelStyle, fontSize: 11, color: colors.teal }}>IF</label>
                      <textarea
                        value={editDraft.when_clause}
                        onChange={(e) => setEditDraft({ ...editDraft, when_clause: e.target.value })}
                        rows={2}
                        style={textareaStyle}
                      />
                      <label style={{ ...labelStyle, fontSize: 11, color: colors.indigo, marginTop: 8 }}>THEN</label>
                      <textarea
                        value={editDraft.then_clause}
                        onChange={(e) => setEditDraft({ ...editDraft, then_clause: e.target.value })}
                        rows={2}
                        style={textareaStyle}
                      />
                      <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
                        <button onClick={cancelEdit} style={btnGhost}>Cancel</button>
                        <button onClick={saveEdit} style={btnPrimary}>Save</button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={realIdx}
                    style={{
                      background: colors.card,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 10,
                      padding: "14px 20px",
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.borderMid)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.border)}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                        <DomainBadge domain={rule.domain} />
                        <ScopeBadge scope={rule.scope} />
                        <HedgeBadge tag={rule.hedge_tag} />
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                        <span style={{ fontWeight: 600, color: colors.teal, fontFamily: mono, fontSize: 11, marginRight: 6 }}>
                          IF
                        </span>
                        <span>{rule.when_clause}</span>
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.6, marginTop: 4 }}>
                        <span style={{ fontWeight: 600, color: colors.indigo, fontFamily: mono, fontSize: 11, marginRight: 6 }}>
                          THEN
                        </span>
                        <span>{rule.then_clause}</span>
                      </div>
                      <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 6, fontStyle: "italic" }}>
                        <span style={{ fontWeight: 600, color: colors.amber, fontFamily: mono, fontSize: 11, marginRight: 6, fontStyle: "normal" }}>
                          BECAUSE
                        </span>
                        awaiting practitioner authorship
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                      <button onClick={() => startEdit(fIdx)} style={iconBtn} title="Edit">
                        ✎
                      </button>
                      <button onClick={() => deleteRule(fIdx)} style={{ ...iconBtn, color: colors.rose }} title="Remove">
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredRules.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: colors.textMuted, fontSize: 13 }}>
                No rules in this domain.
              </div>
            )}

            {/* Bottom export bar */}
            <div
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                background: colors.card,
                borderTop: `1px solid ${colors.border}`,
                padding: "12px 32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 100,
              }}
            >
              <div style={{ fontSize: 13, color: colors.textSec }}>
                <strong>{activeRules.length}</strong> rules across <strong>{DOMAINS.filter((d) => domainCounts[d] > 0).length}</strong> domains
                {deletedIndices.size > 0 && (
                  <span style={{ color: colors.textMuted }}> · {deletedIndices.size} removed</span>
                )}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={exportCSV} style={btnGhost}>Export CSV</button>
                <button onClick={exportJSON} style={btnPrimary}>Export JSON → Supabase</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Shared styles ───
const btnPrimary = {
  padding: "8px 18px",
  background: colors.indigo,
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 600,
  fontFamily: font,
  cursor: "pointer",
};

const btnGhost = {
  padding: "8px 16px",
  background: "transparent",
  color: colors.textSec,
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  fontFamily: font,
  cursor: "pointer",
};

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: colors.textSec,
  marginBottom: 4,
  fontFamily: font,
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  fontSize: 14,
  fontFamily: font,
  color: colors.text,
  outline: "none",
  boxSizing: "border-box",
};

const textareaStyle = {
  width: "100%",
  padding: "8px 12px",
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  fontSize: 13,
  fontFamily: font,
  color: colors.text,
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box",
  lineHeight: 1.5,
};

const selectStyle = {
  padding: "4px 8px",
  border: `1px solid ${colors.border}`,
  borderRadius: 6,
  fontSize: 12,
  fontFamily: mono,
  color: colors.textSec,
  background: colors.bg,
};

const iconBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 16,
  color: colors.textMuted,
  padding: "4px 6px",
  borderRadius: 4,
  lineHeight: 1,
};

const filterActive = {
  padding: "5px 12px",
  background: colors.indigo50,
  color: colors.indigo,
  border: `1px solid ${colors.indigo}40`,
  borderRadius: 9999,
  fontSize: 12,
  fontWeight: 600,
  fontFamily: font,
  cursor: "pointer",
  textTransform: "capitalize",
};

const filterInactive = {
  padding: "5px 12px",
  background: "transparent",
  color: colors.textMuted,
  border: `1px solid ${colors.border}`,
  borderRadius: 9999,
  fontSize: 12,
  fontWeight: 500,
  fontFamily: font,
  cursor: "pointer",
  textTransform: "capitalize",
};

const spinnerStyle = {
  width: 14,
  height: 14,
  border: `2px solid ${colors.indigo}30`,
  borderTopColor: colors.indigo,
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const stepDot = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  transition: "background 0.3s",
};

// Inject keyframes
if (typeof document !== "undefined" && !document.getElementById("seed-gen-keyframes")) {
  const style = document.createElement("style");
  style.id = "seed-gen-keyframes";
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}
