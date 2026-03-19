# Search Strategies by Domain

Use these query templates to find relevant papers for each digest type. Mix and match based on the user's Project Context Card. Always adapt to current year/month.

---

## AI/CS Weekly — Search Sources

**Primary sources (always check):**
- `arxiv.org/list/cs.AI/recent` — last 7 days, AI section
- `arxiv.org/list/cs.LG/recent` — machine learning
- `arxiv.org/list/cs.HC/recent` — human-computer interaction (overlaps with HCI digest)
- `huggingface.co/papers` — curated daily papers
- `paperswithcode.com/latest` — trending, with code availability

**Search query templates by topic area:**

### Context Engineering / RAG / Retrieval
```
context engineering LLM [year]
inference time context optimization [year]
RAG improvements structured retrieval [year]
knowledge grounding LLM [year]
context window efficient [year]
```

### Agentic Systems / Orchestration
```
agentic AI architecture open source [year]
LLM agent tool use [year]
multi-agent coordination [year]
small language model agents [year]
agentic reasoning survey [year]
```

### Knowledge Representation / Structured Data
```
knowledge graph LLM grounding [year]
structured knowledge AI [year]
institutional memory AI [year]
knowledge base construction LLM [year]
rule-based AI hybrid neural [year]
```

### LLM Reasoning / Evaluation
```
LLM reasoning benchmark [year]
chain of thought grounding [year]
test-time compute scaling [year]
LLM evaluation structured output [year]
```

### Open Source Models / Efficiency
```
open source LLM [current month year]
SLM small language model deployment [year]
LLM inference efficiency [year]
self-hosted AI model [year]
```

### Domain-Specific (add based on user's context)
```
AI [user's domain] [year]        # e.g., "AI customer success 2026"
[user's tech stack] optimization [year]
[user's use case] language model [year]
```

---

## HCI/Behavioral Monthly — Search Sources

**Primary sources:**
- `arxiv.org/list/cs.HC/recent` — HCI papers
- `dl.acm.org` — CHI, CSCW, UIST conference proceedings
- `scholar.google.com` — broad academic coverage
- `nngroup.com/articles` — practitioner UX research
- `hbr.org` — executive-layer behavioral findings

**Search query templates by topic area:**

### Human-AI Collaboration / Augmentation
```
human AI collaboration knowledge work [year]
AI augmentation workplace study [year]
human AI teaming empirical [year]
AI co-pilot worker behavior [year]
```

### Deskilling / Skill Atrophy
```
AI deskilling knowledge workers [year]
skill atrophy AI tools [year]
cognitive offloading AI professional [year]
AI-induced deskilling study [year]
```

### Trust and Calibration
```
trust AI workplace [year]
AI trust calibration professional [year]
worker AI trust collapse [year]
appropriate reliance AI [year]
explainability trust AI [year]
```

### Knowledge Work / Documentation Behavior
```
knowledge capture workplace AI [year]
institutional memory documentation behavior [year]
expert knowledge elicitation AI [year]
tribal knowledge AI [year]
```

### Customer Service / Support Workers (if relevant)
```
customer success AI behavior [year]
support worker AI tools [year]
frontline worker AI adoption [year]
```

### CHI / CSCW Proceedings (recent)
```
CHI [year] AI workplace
CSCW [year] knowledge sharing
CHI [year] human AI interaction
```

### Expert Identity / Self-Efficacy
```
AI expert identity knowledge worker [year]
self-efficacy AI tools professional [year]
AI ownership attribution accountability [year]
```

---

## Reputableness Filter (HCI/Behavioral — Apply Before Scoring)

HCI research has a different credibility landscape than CS. Peer-reviewed academic work and rigorous practitioner research are both legitimate — they answer different questions. Academic studies tell you what's true under controlled conditions; practitioner reports tell you what's happening at scale in real workplaces. The filter below reflects this distinction.

### Tier 1 — Strong signals (any one is sufficient)
- **Accepted at a top HCI/behavioral venue** — CHI, CSCW, UIST, GROUP, IUI, DIS, TOCHI (ACM Transactions)
- **Published in a peer-reviewed behavioral/org journal** — Journal of Applied Psychology, MIS Quarterly, Organization Science, Human Factors, Behaviour & IT, Computers in Human Behavior
- **Large-scale practitioner research with disclosed methodology** — Microsoft Research, Deloitte, McKinsey Global Institute, IDC, Gartner, Nielsen Norman Group — only when sample size, methodology, and fieldwork dates are disclosed
- **Meta-analysis or systematic review** — synthesizes multiple prior studies; peer review implied

### Tier 2 — Moderate signals (two or more needed)
- **Reputable outlet with named researchers** — HBR, MIT Sloan Management Review, Stanford Social Innovation Review — when the author is an active researcher (not just a journalist)
- **n > 100 with disclosed methodology** — larger sample size compensates for lack of peer review in practitioner surveys
- **Replicated finding** — the same result has appeared in multiple independent studies
- **Longitudinal data** — studies tracking behavior over time (weeks/months) are inherently more credible than one-shot surveys
- **Field study or ethnography** — observational research in real workplaces, not lab simulations

### Red flags — deprioritize or skip
- Survey with undisclosed sample size or methodology
- Practitioner report from a company with commercial interest in the finding (e.g., a productivity software vendor publishing productivity research)
- n < 30 with sweeping generalization claims
- "Users prefer X" with no comparison condition
- Single-country study presented as universal behavior
- Blog post framed as research (check: is there a methods section?)

### Practical note on practitioner vs. academic
Don't force everything through the academic filter. A Microsoft Future of Work report synthesizing 50,000 workers across 31 countries is more relevant to a CS team product decision than a CHI paper with 24 participants. The question is: **is the methodology transparent enough to trust the finding?** If yes, include it — just be clear about what kind of evidence it is.

---

## Reputableness Filter (AI/CS — Apply Before Scoring)

arXiv is a preprint server with no peer review. Before scoring any paper, run it through this credibility check. Prefer papers that pass at least one Tier 1 signal, or two Tier 2 signals.

### Tier 1 — Strong signals (any one is sufficient)
- **Accepted at a top venue** — check for "Accepted at [conference]" in the abstract or paper header
  - ML/AI: NeurIPS, ICML, ICLR, AAAI, JMLR
  - NLP: ACL, EMNLP, NAACL
  - Systems: OSDI, SOSP, USENIX, MLSys
  - HCI: CHI, CSCW, UIST
  - Vision: CVPR, ICCV, ECCV
- **Published in a peer-reviewed journal** — Nature, Science, PNAS, or domain-specific journals
- **From a recognized AI research lab** — Google DeepMind, Meta FAIR, Microsoft Research, OpenAI, Anthropic, Apple ML, IBM Research, or top-10 CS university (MIT, Stanford, CMU, Berkeley, Oxford, Cambridge, ETH, etc.)

### Tier 2 — Moderate signals (two or more needed)
- **Hugging Face Papers of the Week** — community-curated, practitioner-vetted
- **Papers With Code "trending"** — ranked by GitHub stars + paper attention
- **High early citation count** — 20+ citations within 30 days of posting suggests field attention
- **Covered by serious outlets** — The Gradient, Sebastian Ruder's newsletter, Lilian Weng, Andrej Karpathy signal-boosting
- **Reproducible benchmark results** — paper includes code, data, and standardized benchmark comparisons (not just cherry-picked examples)
- **Named, verifiable authors** — avoid anonymous or pseudonymous submissions on high-stakes claims

### Red flags — deprioritize or skip
- No institutional affiliation listed
- Claims of breakthrough results with no benchmark comparison to prior work
- No author history on arXiv (first-time submitter with extraordinary claims)
- SEO-optimized content farm articles disguised as research (common in LLM model ranking posts)
- Benchmark results only on proprietary/undisclosed datasets
- "We achieve state-of-the-art" with no citation to what state-of-the-art was

### Practical note on preprints
A paper that fails all credibility signals isn't necessarily wrong — it just means treat it as speculative and note it clearly. If it's highly relevant to the user's project and open source, you can include it with an explicit caveat: "⚠️ Unreviewed preprint — treat findings as directional until peer-reviewed."

---

## Scoring Cheat Sheet

After collecting 6–10 candidate papers and running the reputableness filter, rank using:

**For AI/CS:**
1. Passes Tier 1 reputableness signals → include in main digest
2. Passes 2+ Tier 2 signals → include in main digest with preprint note
3. Interesting but fails all signals → route to "On the Radar" with specific skepticism reason
4. Has public GitHub repo → bump priority within its tier
5. Benchmark results vs. known baselines → high value
6. Directly touches user's core technical bet → high value
7. From last 7 days → prefer over older
8. Theory-only, no implementation → lower priority
9. Fails all signals AND not compelling enough for "On the Radar" → skip

**For HCI:**
1. Passes HCI reputableness filter (Tier 1 or 2+ Tier 2 signals) → required to include without caveat
2. Methodology is transparent (sample size, fieldwork dates, comparison condition disclosed)
3. Empirical study with n > 50 → prefer over theory
4. Professional/workplace context → prefer over general population or lab simulation
5. Directly challenges or validates a product design decision → high value
6. Published last 30–60 days → prefer over older
7. Broad AI-change-work takes with no specific findings → skip
