---
name: elicitation-prospect-validator
description: >
  Takes a sketch that passed elicitation-eval-loop (Layer 3) and produces a
  runnable prospect testing script — specific views to show, the order to show
  them, and scripted think-aloud prompts and reaction probes calibrated to
  BECAUSE field interaction. Output is a one-pager Melanie can run inside a
  30-minute discovery call, pre-customer. Generates design signal AND sales
  signal simultaneously. Use this skill whenever Melanie says anything like:
  "prep me to test this sketch with a prospect", "what should I show in my
  next discovery call", "give me a testing script", "I have a call Friday —
  what do I put in front of them", "how do I get real signal before pilot",
  "discovery call testing script", "turn this sketch into a test", or any
  variation of wanting to test an elicitation UI pattern with a real human
  before the pilot. Always runs after elicitation-eval-loop passes a sketch.
  Feeds into verity-evidence-brief (Layer 4) once findings are collected.
---

# elicitation-prospect-validator — v1

Layer 3.5 of the Six-Layer System. Bridges synthetic eval (Layer 3) and
evidence language (Layer 4) with a structured instrument for testing
elicitation UI patterns against real humans in pre-customer conversations.

**Runs after:** `elicitation-eval-loop` produces a Pass or Conditional verdict
**Feeds into:** `verity-evidence-brief` (Layer 4) once findings are collected
**Population:** Prospects, advisors, or anyone Melanie can get 30 minutes with — NOT pilot users (pilot users belong to signal-tracker, Layer 5)
**Dual purpose:** Design signal (does the pattern work?) + Sales signal (does this resonate as a problem?)

---

## What it does

Takes one sketch from the Notion Elicitation Lab gallery (Status = Pilot Ready
or Conditional) and produces three things:

1. **View selection** — which 2–3 states of the sketch to show, in what order, and why
2. **Testing script** — scripted prompts for each view: warm-up, think-aloud cues, BECAUSE-specific probes, and a closing read
3. **One-pager artifact** — formatted call sheet Melanie can use live, with room to capture reactions in the margins

The script is not generic UX research. Every probe is calibrated to the specific risk that BECAUSE field interactions introduce: Does this feel invasive? Does the friction feel meaningful or arbitrary? Does the outcome feel worth the effort?

---

## Session format

### Step 1 — Load the sketch

Either:
- Pull the most recent sketch from Notion Elicitation Lab (Status = Pilot Ready) via Notion MCP
- Or accept a sketch name or link from conversation

Confirm: sketch name, interaction mechanism being tested, and the failure mode it addresses.

If sketch status is Conditional (not full Pass), note the known weak point from the eval-loop verdict. The script will include a probe specifically targeting that weakness.

### Step 2 — Select views

From the sketch, identify 2–3 distinct states or moments to show. Fewer is better — prospects lose orientation after the third context switch.

**Selection criteria:**
- Lead with the state Jordan sees on first encounter (orientation moment)
- Include the state where the BECAUSE field is active (the core interaction)
- If the sketch has a "completed" or "confirmed" state, include that last (closure moment)
- Skip intermediate loading/transition states — these read as noise in a live call

For each selected view, write one sentence: *Why this view, why at this position in the sequence.*

**View order principle:** Show the problem before the solution. If the sketch addresses a known failure mode (e.g., boilerplate reasoning), open with a view that makes the problem visible — then show the intervention.

### Step 3 — Write the testing script

Structure: warm-up → per-view think-aloud → closing read. Total runtime: 20–25 minutes within a 30-minute call. Leave 5–10 minutes for organic conversation.

---

**WARM-UP (3–4 min)**

Framing line — say this verbatim before showing anything:

> "I'm going to show you something we're building. I want you to think out loud as you look at it — there are no right answers. I'm most interested in your instinct, not your analysis."

Warm-up probes (pick 1–2 based on the prospect's role):

*For CS leads / CSMs (Jordan-type):*
- "When your team makes a judgment call on how to handle a customer situation — where does that reasoning live right now?"
- "Think about a time a new CSM handled something wrong because they didn't know the unwritten rule. What was missing?"

*For PMs / product leads (Alex-type):*
- "When you get feedback from CS, what's the part that's hardest to translate into a spec?"
- "Has your team ever built something that CS said was wrong after shipping? What did they know that didn't make it into the ticket?"

*For founders / CEOs (Sam-type):*
- "If a key person left tomorrow — CS lead, senior PM — where would the knowledge go?"
- "Are you building AI into your product or workflow right now? What's the thing it keeps getting wrong?"

The warm-up question plants the problem. Don't explain what you're about to show yet.

---

**PER-VIEW THINK-ALOUD**

For each selected view, follow this script structure:

**Show the view. Say:**
> "Take a look at this. Don't explain it to me yet — just tell me what you notice first."

Wait. Do not fill silence. The first thing they say is the most valuable signal.

**After their first reaction, follow with ONE of these probes (pick based on what they said):**

*If they orient correctly (understand the pattern):*
- "What would you expect to happen next?"
- "Is this a moment that would feel natural in the middle of your day, or would it feel like a context switch?"

*If they seem confused or mis-read the pattern:*
- "Walk me through what you think is being asked here."
- "What would you need to know to feel comfortable responding to this?"

*If they say it's similar to something they already use:*
- "What's the key difference you see between this and [thing they named]?"
- "Where does [thing they named] fall short for you?"

**BECAUSE-specific probes** — use exactly one of these per view where the BECAUSE field is active:

- "If you were filling this in right now, what would you write? Don't overthink it — first instinct."
- "What would make you skip this field rather than fill it in?"
- "Imagine a new person on your team sees this rule tomorrow. What does this explanation give them that they couldn't figure out on their own?"
- "Is there anything you know about this situation that you wouldn't put in writing here? Why not?"

The last probe (the "wouldn't put in writing" question) is high-yield for surfacing tacit knowledge that the product needs to capture. Use it on the second or third view, not first.

**If sketch passed Layer 3 as Conditional:** Insert the targeted weakness probe from the eval-loop verdict after the first organic reaction. Label it in the call sheet so you remember to use it.

---

**CLOSING READ (3–4 min)**

After all views, close with these in order:

1. **Problem resonance check:**
   > "Before I explain what this is, I want to ask — is the problem this is trying to solve a problem you actually have?"

   Wait for their answer before explaining anything. If they say no, that's a finding. Don't rescue it.

2. **Explanation:**
   > "What we're building is [one sentence — use the Verity elevator: 'Verity reads your team's live work, surfaces the judgment calls your best people are making, and turns them into rules your AI can actually use.']. The field you saw is how we capture the reasoning behind each rule — not just the rule itself."

3. **Fit read:**
   - "Where would this sit in your workflow — is this something that happens in Slack, in a ticket, somewhere else?"
   - "Who on your team would be the person filling this in?"
   - "Is there a version of this that would be a no-brainer for you to try?"

Do not ask about pricing, timeline, or next steps in the same breath. Close the testing segment cleanly, then let the conversation breathe.

---

### Step 4 — Produce the one-pager artifact

Output as a formatted HTML artifact using Verity Design System v2 tokens. The one-pager is a call sheet — not a slide deck, not a report.

**Layout:** Single column, print-friendly. Three sections:
1. **Header:** Sketch name · date · prospect role type (leave blank to fill in before the call)
2. **Script body:** Warm-up → View 1 → View 2 → [View 3 if applicable] → Closing read. Each section labeled with estimated time.
3. **Observation grid:** Two-column table at the bottom. Left column: moment labels (First reaction · BECAUSE probe · Problem resonance · Fit read). Right column: blank lines for handwritten notes.

Include the targeted weakness probe in a visually distinct callout box if the sketch was Conditional.

**Typography:**
- Fraunces 300 for section headers
- DM Sans 400 for body script
- DM Mono for verbatim lines marked "say this verbatim"
- Verbatim lines in Indigo 50 background (#EEF0FF) with Indigo 500 left border

**File:** `prospect-test-script-[sketch-name]-v1.html`

---

### Step 5 — Save to Notion

Update the sketch's page in Elicitation Lab (DB: `f2cdce94-4b22-48aa-94a3-de602bccdfc6`):

- Add a plain-text section: `Testing script generated: [date] · Views selected: [list] · Script version: v1`
- If prospect test is run and findings come back: update Status → Evidence Collected, add a findings summary block

Do NOT change Status at script-generation time — Status changes only when a real human has seen it.

---

### Step 6 — Post to Slack (#new-design-artifacts)

After generating the one-pager, post a brief message to #new-design-artifacts:

```
Prospect test script ready: [Sketch Name]

Views selected: [list — 2–3 states, one line each]

Key probe: [the one BECAUSE-specific probe most likely to generate signal for this sketch]

Targeted weakness: [from eval-loop, or "none — clean pass"]

Use this in: discovery calls with [Jordan-type / Alex-type / Sam-type] prospects

One-pager: [attach or link the HTML artifact]
```

---

## Design constraints

- Never auto-generate BECAUSE field content — not even as a "sample answer" in the script
- Never write a probe that implies the answer ("Wouldn't you agree that...") 
- Warm-up questions plant the problem; they do not explain the product
- Silence after "what do you notice first?" is productive — do not coach the script to fill it
- One BECAUSE-specific probe per view maximum — more feels like interrogation
- The one-pager is a call sheet, not a presentation artifact — it should feel like something you'd print and put next to your laptop
- This is a pre-customer instrument. Do not use it with active pilot users — those findings belong in signal-tracker (Layer 5)

---

## What good signal looks like

**Strong positive signal:**
- Prospect fills in the BECAUSE field verbally without being asked ("I'd write something like...")
- Unprompted: they name the person on their team who would fill this in
- "Wouldn't put in writing" probe surfaces knowledge they're surprised they haven't documented
- Problem resonance = yes before explanation

**Strong negative signal (also useful):**
- First reaction is about a tool they already use (signals positioning confusion)
- They optimize the prompt toward the rule, not the reasoning
- "I'd just skip this" — probe why, not whether to remove it
- Problem resonance = no — find out what problem they *do* have

Both directions generate findings. A clean negative is more valuable than a lukewarm positive.

---

## Relationship to other layers

| Layer | Population | Instrument | Output |
|-------|------------|------------|--------|
| 3 — eval-loop | Synthetic personas | Simulation | Pass/fail verdict |
| **3.5 — prospect-validator** | **Real humans, pre-customer** | **Testing script** | **Design + sales signal** |
| 5 — signal-tracker | Pilot users (real, in-product) | Metric comparison | Alarm / hold |

Do not conflate Layer 3.5 findings with Layer 5 data. They measure different things from different populations with different instruments.

---

*elicitation-prospect-validator v1 · March 15, 2026*
