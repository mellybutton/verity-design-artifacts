---
name: research-digest
description: >
  Delivers two types of ongoing research digests, personalized to any project or product context: (1) a weekly AI/CS technical digest surfacing the most relevant papers and open-source releases, and (2) a monthly HCI/behavioral digest covering how humans are changing alongside AI. Trigger this skill whenever the user says anything like: "weekly digest", "Friday digest", "research roundup", "what's new in AI", "catch me up on AI research", "HCI digest", "behavioral research", "how AI is changing humans", "what papers dropped this week", "any new open source tools I should know about", "what's relevant to my project", or any variation of wanting a research update. Also trigger when a user asks about new methods, open-source AI tools, trust in AI, deskilling, knowledge work, or human-AI collaboration. Use this skill aggressively — if there is any chance the user wants to stay current on AI, CS, or behavioral research relevant to their work, activate it.
---

# Research Digest Skill

Two recurring research rituals — one weekly (AI/CS), one monthly (HCI/behavioral) — each mapped to the user's specific project context. Every entry links to the source, explains it plainly, and answers one question: *does this change anything about what we're building?*

---

## First-Time Setup

**Before running any digest, check for existing project context in this order:**

1. **Claude Project instructions** — If the user is in a Claude Project, project-level instructions are already in context. Use them directly. No setup needed.
2. **User memory / preferences** — If there's relevant context in saved memories or user preferences, use that.
3. **Conversation history** — If the user has described their project earlier in the current conversation, use that.
4. **Nothing found → ask once.** If no context exists anywhere, ask:

> "To personalize this digest, I need a quick project context card. Tell me: (1) What are you building? (2) What are the core technical bets or design decisions you've made? (3) Who is your user? (4) What domains are most relevant? One paragraph is fine."

Never ask for context that's already available. If partial context exists (e.g., you know what they're building but not their tech stack), proceed with what you have and infer the rest — don't interrogate.

---

## Digest Types

This skill delivers two distinct digests:

| Digest | Frequency | Focus |
|--------|-----------|-------|
| **AI/CS Weekly** | Every Friday (or on-demand) | Papers, open-source releases, new methods |
| **HCI/Behavioral Monthly** | Monthly (or on-demand) | Human behavior, trust, cognition, workplace change |

Users can request either by name, or just ask for "the digest" — default to AI/CS if ambiguous. See `references/digest-formats.md` for the full format templates for each type.

---

## Core Workflow (Both Digests)

### Step 1 — Anchor to Project Context
Before searching, re-read the user's Project Context Card. Identify:
- The 2–3 domains most relevant to their work
- Any specific technical bets or design decisions that could be validated or challenged
- Any terminology that should guide search queries

### Step 2 — Search
Run 3–5 targeted searches. See `references/search-strategies.md` for domain-specific query templates by topic area.

**Universal search rules:**
- Prioritize papers from the last 7 days (AI/CS) or 30–60 days (HCI)
- Bias heavily toward papers with a public GitHub repo (flag with 🟢 OPEN SOURCE)
- Use arXiv, Hugging Face Papers of the Week, Papers With Code, ACM DL, and Google Scholar as primary sources

### Step 3 — Filter for Credibility, Then Score
**First, apply the reputableness filter** from `references/search-strategies.md`. arXiv is unreviewed — credibility signals matter. Papers passing Tier 1 (top venue, top lab, peer-reviewed journal) can be included without caveat. Papers with only Tier 2 signals should be noted as preprints. Papers failing all signals should be excluded unless exceptionally relevant, in which case flag explicitly with ⚠️.

**On cadence:** Top-venue papers cluster around conference seasons, not calendar weeks. If fewer than 2 papers clear the filter in a given week, say so explicitly and deliver what actually passed — a single strong paper is better than three weak ones. For thin weeks, consider leading with a Tier 2 community pick (Hugging Face Papers of the Week, Papers With Code trending) and flagging it as such. A monthly cadence is a reasonable fallback if the user is in a domain where the research moves slower.

Then pick top 2–3 using this priority order:

| Priority | Criterion |
|----------|-----------|
| 1 | Open-source AND immediately implementable |
| 2 | Directly challenges or validates a core project decision |
| 3 | New method or finding that could be adopted |
| 4 | Mental model shift |
| 5 | Interesting but low immediate relevance |

Always aim for at least 1 open-source pick per AI/CS digest.

### Step 4 — Format and Deliver
Use the format templates in `references/digest-formats.md`. Every entry must include:
- A direct link to the source
- An ELI5 (2–3 plain-English sentences, no jargon)
- What it actually found/does (specific, with numbers where available)
- Project relevance (opinionated — say what it means, don't hedge)
- One action tag

### Step 5 — Close with a Decision Question
End every digest with one question that forces a real reflection or decision based on the most important finding.

---

## Tone Rules (Both Digests)

- **Direct and editorial.** No filler. Lead with what matters.
- **ELI5 first, technical second.** Always explain before going deep.
- **Be opinionated about project relevance.** Say "this directly challenges your X" or "not relevant this week" — never neutral.
- **Flag open source loudly.** This is the highest-value signal.
- **Readable in under 5 minutes.** If it's longer, it's too long.

---

## Reference Files

Read these before running each digest type:

- `references/digest-formats.md` — Full format templates for both digest types
- `references/search-strategies.md` — Query templates by topic domain
