# Digest Format Templates

Two formats — one for the weekly AI/CS digest, one for the monthly HCI/Behavioral digest.

---

## Format A: AI/CS Weekly Digest

Use this format every Friday, or whenever the user asks for an AI/CS research update.

### Header
```
## 🤖 AI/CS Digest — [Date]
```

### Per-Paper Entry
```
## [EMOJI] Paper / Article Title
**Link:** [arXiv / GitHub / HuggingFace URL]

**Trust signals:**
| Signal | Status | Why it matters |
|--------|--------|----------------|
| 📋 Peer review | [🟢 Accepted @ VENUE / 🟡 Under review / 🔴 Preprint only] | Confirms independent scrutiny of methodology |
| 🏛️ Institution | [🟢 Top-tier lab or university / 🟡 Known but smaller / 🔴 Unknown] | Signals baseline research quality and accountability |
| 💻 Open source | [🟢 Public repo — LINK / 🟡 Partial / 🔴 None] | Means you can test it yourself, not just trust the paper |
| 📊 Benchmarks | [🟢 Compared to named baselines / 🟡 Limited comparison / 🔴 No comparison] | Without baselines, "improvement" is meaningless |
| 🔁 Reproducible | [🟢 Code + data public / 🟡 Code only / 🔴 Neither] | Can an independent team verify the result? |

**Overall trust: [🟢 High — act on it / 🟡 Medium — directional only / 🔴 Low — see On the Radar instead]**

### 🌐 Anyone
[2–3 sentences. No jargon, no assumed knowledge. Explain the problem it solves and why someone should care — as if talking to a smart person who has never heard of this area. Use a concrete everyday analogy if it helps land the idea.]

### 🔧 If you build things
[3–5 sentences. The actual mechanism: what problem, what approach, what tradeoffs, what result. Concrete numbers where available. Name the method, compare it to prior approaches, flag implementation gotchas. Assume the reader knows what an LLM, a benchmark, and a GitHub repo are — but not deeper specialty knowledge.]

### Project relevance
[Name the user's specific project(s) if known. For each: one opinionated sentence on what this means for their architecture, positioning, backlog, or framing. If not relevant, say "Not directly relevant this week."]

### Action
[One of: 🔧 Implement now | 📋 Add to backlog | 🧠 Update mental model | 👀 Watch | ⏭️ Skip]
[1–2 sentences on what specifically to do, if actioning.]
```

**Emoji guide for paper type:**
- 🧠 Conceptual / mental model shift
- 🔧 Engineering / implementable method
- 📊 Benchmark / evaluation framework
- 🤖 Agentic architecture
- 🗂️ Knowledge / retrieval
- ⚡ Efficiency / speed / cost

### "On the Radar" Section (Early Signals — Unverified)
Include at the end of every AI/CS digest, after the main entries. This section is structurally separate — it's not the digest, it's an appendix to it. 1–2 items max.

```
---
## 📡 On the Radar — Early Signals (Not Yet Verified)

*These papers just dropped on arXiv and haven't been peer-reviewed. All carry an overall trust of 🔴 Low by definition. Each entry explains specifically why — not a generic disclaimer.*

### [Paper Title]
**Link:** [arXiv URL]

**Trust signals:**
| Signal | Status | Why it matters |
|--------|--------|----------------|
| 📋 Peer review | 🔴 Preprint only | No independent scrutiny yet |
| 🏛️ Institution | [🟢 / 🟡 / 🔴 + name] | Signals baseline research quality |
| 💻 Open source | [🟢 / 🟡 / 🔴] | Can you test it yourself? |
| 📊 Benchmarks | [🟢 / 🟡 / 🔴] | Are claims compared to known baselines? |
| 🔁 Reproducible | [🟢 / 🟡 / 🔴] | Can results be independently verified? |

**Overall trust: 🔴 Low — early signal only**

**Why it caught my eye:** [1 sentence]
**Specific reason not yet trustworthy:** [1–2 sentences naming the actual gap for this paper — not generic]
**Watch for:** [What would promote this to the main digest]
```

**Rules for this section:**
- Never put a preprint here just to hit a number. If nothing interesting dropped, omit the section entirely and say so.
- "Why not yet trustworthy" must be specific to the paper. "Unreviewed preprint" alone is not acceptable — it tells the reader nothing they couldn't already infer.
- This section should build research literacy over time. A reader who sees 20 of these learns to evaluate papers themselves.
- If a paper from "On the Radar" later gets accepted at a top venue or replicated, surface it in the main digest and note the callback: *"This one graduated from On the Radar — it cleared peer review at [venue]."*
```
## This Week's Signal
[One sentence on the dominant theme across the papers.]
[One sentence on the most urgent action for the user's project.]
```

### Closing Question
```
> **One question for you:** [A specific, grounded question that forces a decision or reflection based on the most important paper.]
```

---

## Format B: HCI/Behavioral Monthly Digest

Use this format monthly, or whenever the user asks about behavioral research, human-AI interaction, or how AI is changing people.

### Header
```
## 🧠 HCI/Behavioral Digest — [Month, Year]
```

### Per-Paper Entry
```
## [EMOJI] Paper / Article Title
**Source:** [Journal / Conference / Outlet]
**Link:** [URL]

**Trust signals:**
| Signal | Status | Why it matters |
|--------|--------|----------------|
| 📋 Peer review | [🟢 Published in peer-reviewed venue / 🟡 Workshop or practitioner report with disclosed methods / 🔴 No review] | HCI practitioner reports can be legitimate — but methodology must be disclosed |
| 👥 Sample size | [🟢 n > 100 / 🟡 n 30–100 / 🔴 n < 30 or undisclosed] | Small samples may not generalize to your users |
| 🏢 Context | [🟢 Real workplace / professional setting / 🟡 Lab or simulation / 🔴 General population or undisclosed] | Workplace behavior differs significantly from lab behavior |
| 💰 Independence | [🟢 No commercial stake in finding / 🟡 Partial conflict / 🔴 Vendor-funded with convenient conclusion] | A productivity tool vendor's productivity study is structurally compromised |
| 🔁 Replicated | [🟢 Finding appears in 2+ independent studies / 🟡 Single study / 🔴 Contradicted by other research] | One study can be noise; replication is signal |

**Overall trust: [🟢 High — act on it / 🟡 Medium — directional only / 🔴 Low — treat with skepticism, note why]**

### 🌐 Anyone
[2–3 sentences. Plain English, no assumed knowledge. What did they study, what did they find, why should a non-researcher care? Connect it to something recognizable — a frustration, a behavior, a thing that happens at work.]

### 🔍 If you're into the details
[3–5 sentences. Methodology, sample, key findings with specific numbers where available. Note effect sizes, comparison conditions, and any important caveats about generalizability. "47% of workers..." beats "many workers..." every time.]

### Project relevance
**Which function this affects:** [Name the specific part of the user's product or workflow this touches — be specific, not generic]
**Implication:** [Direct and opinionated. What does this mean for design, positioning, or sales? If it's a warning, say so. If it validates a bet, say so clearly.]

### Action
[One of: 🎨 Design implication | 📢 Positioning/messaging shift | 🧠 Mental model update | 📋 Backlog candidate | 💬 Good for sales narrative | 👀 Watch space | ⏭️ Interesting but not actionable now]
[1–2 sentences on what specifically to do.]
```

**Emoji guide for finding type:**
- 🚨 Challenges a core project assumption (urgent)
- ✅ Validates a project bet (confidence booster)
- 🔍 New insight about user behavior
- 🤝 Human-AI teaming dynamics
- 🧠 Cognition / mental models
- ⚠️ Risk signal (deskilling, trust failure, adoption friction)
- 💡 Opportunity signal (unmet need, whitespace)

### No "On the Radar" Section for HCI
The AI/CS digest has an "On the Radar" section for promising arXiv preprints. The HCI digest intentionally does not.

In CS, a preprint is real science waiting on peer scrutiny — the methodology and benchmarks exist, the review is just pending. In behavioral research, the equivalent "early signal" tier would mostly surface consultant think pieces, vendor-funded reports with convenient conclusions, and practitioner opinions dressed up as findings. There's no methodology to evaluate and no falsifiable claim to scrutinize. Including it would train readers to treat hot takes as data.

HCI also moves slower by design. The most important behavioral findings — deskilling timelines, trust collapse patterns, knowledge atrophy — take years of field observation to surface properly. There is no HCI equivalent of a paper that changes everything by Monday.

The one exception: CHI and CSCW **workshop papers** are lighter-touch peer review from credible researchers and are legitimately early-stage empirical work. If a workshop paper is directly relevant and the author is a named researcher with a track record, it can be included in the main digest with a note that it's workshop-stage, not full paper.

Everything else: if it doesn't pass the HCI reputableness filter, leave it out.

### Monthly Snapshot Block
```
## [Project Name] Snapshot This Round

**Human behavior trend to track:** [One sentence — a pattern emerging across papers]
**Design assumption most at risk:** [One specific product design choice this research should make us question]
**Design assumption most validated:** [One specific product design choice this research supports]
```

### Closing Question
```
> **One question for you:** [A specific, grounded question connecting the most important finding to a product or positioning decision.]
```
