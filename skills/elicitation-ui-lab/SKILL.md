---
name: elicitation-ui-lab
description: >
  Design lab that translates BECAUSE elicitation research ideas into dated,
  named UI sketches — deployed to CodeSandbox Teams (private) and saved to
  Notion as a live interactive gallery. Use whenever Melanie says: "run the
  UI lab", "show me some sketches", "what does [idea] look like", "morning
  sketch", "visualize the elicitation ideas", "sketch the BECAUSE ideas",
  "add to the Notion gallery", or any variation of wanting visual explorations
  of BECAUSE field design patterns. Also runs as a morning ritual on "good
  morning" or "what's new" — skip greeting, open with a fresh sketch. Every
  output is dated, named, includes pros/cons, deployed private to CodeSandbox
  Teams, and saved to Notion with a live embedded preview. The gallery
  accumulates over time as a living record of science-grounded design thinking.
---

# elicitation-ui-lab — v4

Design lab that builds interactive BECAUSE elicitation UI prototypes — deployed to CodeSandbox, annotated in Notion separately from the UI.

**Triggers on:** "run the UI lab", "show me some sketches", "what does [idea] look like", "morning sketch", "visualize the elicitation ideas"

**Morning ritual:** when Melanie says "good morning" or "what's new" — skip greeting, open with a fresh prototype from the idea library.

**Every output:** dated · named · interactive prototype · plain-text Notion annotation · saved to gallery (DB: `f2cdce94-4b22-48aa-94a3-de602bccdfc6`)

---

## What it does

Takes one idea from the because-elicitation-research idea library and builds it as a focused, interactive UI prototype — deployed to CodeSandbox and saved to the Notion gallery with plain-text annotations separate from the sandbox. Each prototype is a one-session design exploration, not a final spec.

---

## Session format

### 1. Pick an idea
- If user specifies: use that idea
- If "morning sketch" / "good morning": pick the most recent unprototyped idea from the Notion gallery (Status = Idea)
- If "show me options": show 3 idea names and let Melanie pick

### 2. Build the prototype

**This is a prototype, not a static sketch.** The sandbox must be interactive — state transitions, button clicks, and field interactions must work. Annotations go in Notion separately (Step 5), never inside the sandbox HTML.

Build as a self-contained HTML file using the Verity Design System v2 tokens:
- Fonts: DM Sans (body), Fraunces (display), DM Mono (code) — import from Google Fonts
- Colors: Indigo primary (#4752F5 / #3340D4 hover / #EEF0FF subtle), Slate neutrals (#111827 text / #4A5369 secondary / #DDE1EA border / #F0F2F6 subtle / #F8F9FB page), Teal #0EA58D, Amber #F59E0B, Rose #F43F5E, Green #22C55E
- Spacing: 4/8/12/16/20/24/32px grid. Border radius: 4/6/8/12/16px. Shadows: xs (1px) to lg (10px/30px).

**Prototype standards:**
- Show ONE focused interaction — not a gallery of all variants. If the idea has multiple states (before/during/after), wire them as actual JS state transitions.
- Buttons click. Fields accept input. Toggles toggle. Prompts rotate. Gates advance.
- The BECAUSE field is always an editable textarea — never a static placeholder.
- Default state on load = the state Jordan would see when she first encounters this pattern.
- Do not render annotation text, research citations, or meta-labels inside the sandbox. Those go in Notion only.
- Scale: one component or one moment in the product — not a full page layout.

**What "working" means per variant type:**
- Rotating prompt → JS array of prompts per category, rotates on button click or rule open, shows active category label
- Named reader chip → reader name is editable or selectable, BECAUSE textarea responds to focus
- Depth alarm → fires based on a client-side text similarity check against the IF clause, not hardcoded trigger
- Variance flag → driven by a small JS dataset of simulated responses, bar widths computed not static
- Confidence probe → fires at a configurable threshold; slider or computed divergence value
- Gate → three criteria evaluate as user types into BECAUSE textarea, gate bar advances when criteria are met
- Stress case → Yes/No buttons write a response to state, show a confirmation or "needs EXCEPT" follow-up
- Stage map → stages are clickable, current stage is stored in JS state

### 3. Write the pros/cons

After the artifact, in the chat:
- **Pros:** 2–3 (what works, what the research supports)
- **Cons:** 2–3 (what might fail, edge cases, adoption risk)
- **Open question:** 1 question this prototype raises

### 4. Deploy to CodeSandbox Teams (private)

**Why browser artifact, not bash:** Claude's container cannot reach `codesandbox.io` (not in allowed outbound domains). Deploy runs from the user's browser via a self-deploying HTML artifact.

**One-time setup (first use only):**
1. Go to https://codesandbox.io/dashboard/settings/tokens in your CSB Teams account
2. Generate a token with sandbox create permissions
3. Tell Claude: "my CSB token is [token]"
4. Claude stores it to Notion → 🧪 Scratchpad → ⚙️ Settings — API Tokens under key `CSB_API_TOKEN`
5. All future sessions: Claude fetches the token from Notion before deploying

**Every session — use `show_widget` to render a self-deploying artifact:**

Before rendering: fetch the CSB token from Notion (key: `CSB_API_TOKEN`, page: Settings — API Tokens in 🧪 Scratchpad).

Render the widget below, substituting `SKETCH_HTML_HERE` with the full prototype HTML and `CSB_TOKEN_HERE` with the fetched token. The widget auto-deploys on load and fires `sendPrompt()` with the sandbox URL — Claude then proceeds directly to Step 5.

```html
<style>
.deploy-wrap{font-family:var(--font-sans);padding:1rem 0}
.deploy-status{font-size:13px;color:var(--color-text-secondary);margin-bottom:8px}
.deploy-url{font-size:12px;font-family:var(--font-mono);color:var(--color-text-info);word-break:break-all}
.deploy-err{font-size:12px;color:var(--color-text-danger)}
</style>
<div class="deploy-wrap">
  <div class="deploy-status" id="st">Deploying to CodeSandbox…</div>
  <div class="deploy-url" id="url"></div>
  <div class="deploy-err" id="err"></div>
</div>
<script type="module">
import LZString from 'https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.js';
const TOKEN = 'CSB_TOKEN_HERE';
const HTML = `SKETCH_HTML_HERE`;
const files = {'index.html':{content: HTML}};
const params = LZString.compressToBase64(JSON.stringify({files}));
try {
  const res = await fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${TOKEN}`},
    body: JSON.stringify({parameters: params, privacy: 2})
  });
  const data = await res.json();
  if(data.sandbox_id){
    const url = `https://codesandbox.io/s/${data.sandbox_id}`;
    document.getElementById('st').textContent = 'Deployed';
    document.getElementById('url').innerHTML = `<a href="${url}">${url}</a>`;
    sendPrompt(`CSB deploy complete. Sandbox ID: ${data.sandbox_id} · URL: ${url} · Now update Notion Sandbox URL property for this sketch.`);
  } else {
    document.getElementById('st').textContent = 'Deploy failed';
    document.getElementById('err').textContent = JSON.stringify(data).substring(0,200);
  }
} catch(e) {
  document.getElementById('st').textContent = 'Deploy failed';
  document.getElementById('err').textContent = e.message;
}
</script>
```

Build URLs from the returned sandbox ID:
- **Preview URL:** `https://codesandbox.io/embed/[id]?fontsize=14&theme=light&hidenavigation=1&view=preview`
- **Full URL:** `https://codesandbox.io/s/[id]`

If deploy fails: note failure in Notion, save prototype as code block, continue.

**Batch deploy (multiple pre-existing prototypes):** Generate a standalone HTML file with all prototype HTMLs embedded. User opens in browser (directly from filesystem, not from claude.ai iframe), clicks Deploy, copies results JSON back to Claude. Claude writes all sandbox URLs to Notion.

**Critical implementation rule for batch deploy — always use base64 encoding:**
Prototype HTML files contain `<script>` and `</script>` tags. If those strings appear inside a `<script>` block in the deployer file (even inside a JSON string or JS template literal), the browser's HTML parser closes the script block early and dumps the rest as raw text on the page. This breaks every approach that embeds HTML as a string literal — template literals, json.dumps, manual escaping with `<\/script>` — because the parser runs before JavaScript.

The only safe approach: base64-encode each HTML file in Python, embed the base64 strings (which contain only A-Za-z0-9+/= — zero HTML-special characters), and decode them in JavaScript at runtime using `atob()`.

```python
import base64, json

b64_list = []
for html_string in html_files:
    b64_list.append(base64.b64encode(html_string.encode('utf-8')).decode('ascii'))

b64_json = json.dumps(b64_list)  # pure ASCII, safe in any script block

# Verify before writing
assert '</script>' not in b64_json
```

In JavaScript:
```javascript
function decode(b64) {
  return decodeURIComponent(escape(atob(b64)));
}
var html = decode(B64S[i]);  // B64S is the embedded base64 array
```

Always run the assertion check before writing the output file. If it fails, the approach is wrong — do not try to fix it with string replacement.

### 5. Save to Notion

Update the DB entry (DB: `f2cdce94-4b22-48aa-94a3-de602bccdfc6`):

**DB properties to set:**
- `Name`: [idea name]
- `date:Date:start`: [today ISO]
- `Status`: Under Review
- `Sandbox URL`: [full CSB URL from step 4]

**Page content — two distinct sections, annotation first, embed prompt second:**

Section 1: Plain text annotation. No markdown formatting. Write as plain paragraphs separated by blank lines:

```
Why it exists: [one sentence citing the research finding or failure mode. Include author/year.]

What it does: [what the user actually experiences — what they click, type, or see change. One to two sentences.]

What is working: [list what JS interactions are implemented and functional.]

What is not working: [list anything that is display-only, hardcoded, or not yet wired.]

Fidelity: [Low / Medium / Medium-high / High] — [one sentence explaining the main gap between prototype and production behavior.]

Open question: [from step 3]
```

Section 2: Embed prompt. Plain text, no formatting:

```
Type /embed and paste this URL:

https://codesandbox.io/s/[sandbox-id]
```

**Why annotations are separate from the sandbox:** The sandbox is the experience — it should contain only design system UI. Research citations, state descriptions, and fidelity notes are meta-information for Melanie and the team, not Jordan. Mixing them breaks both the prototype fidelity and the annotation legibility.

**Why embed cannot be automated:** The Notion MCP does not support embed block type. Plain text + the /embed slash command in Notion is the only working path to a live iframe.

### 6. Post to Slack — #new-design-artifacts

After Notion is updated, post to the #new-design-artifacts Slack channel using the Slack MCP.

Find the channel first: search for "new-design-artifacts" using slack_search_channels. If not found, skip this step and tell Melanie the channel doesn't exist yet.

**Message format — plain text, no markdown headers:**

```
New elicitation prototype: [Prototype Name]

Experiment: [one sentence on the failure mode this addresses and the research mechanism behind it. Include author/year.]

What we built: [one to two sentences on what the prototype does — what the user clicks, types, or sees change. Reference the design system and whether it's wired.]

Fidelity: [Low / Medium / Medium-high / High] — [one sentence on the main gap vs. production.]

How to test with early users: [two to three sentences. Name the specific interaction to put in front of a user. Describe what to watch for. Name the one metric that would tell you whether this is working — from the Metrics to Observe list in the Notion DB row.]

Open question: [from step 3]

View prototype: [CSB full URL]
Notion entry: [Notion page URL]
```

The message should read like a brief research note sent to a collaborator — not a status update, not marketing copy. Write it as if Melanie is sharing a live experiment with someone who will actually test it.

**Why this step matters:** Each prototype generates a signal. The Slack post creates a lightweight accountability loop — it names the metric to watch and the specific user test to run, so the prototype doesn't sit in a gallery without a next action attached to it.

---

## Design constraints

- Never auto-fill the BECAUSE field — even in a prototype
- Never suggest removing the confirmation step
- Prototypes should feel like Jordan (CS Principal) would encounter them — not a developer tool
- When in doubt, make it feel like a thoughtful Slack message, not a form
- Prototypes accumulate — each one should feel like it belongs in a series
- CodeSandbox sandboxes are private (privacy: 2) — only accessible to your CSB Teams org

---

## Gallery accumulation rule

The gallery is the product. Each prototype adds to a living record of science-grounded design thinking. Over time, patterns will emerge — certain ideas keep showing up from different research angles. When that happens, flag it: "This is the third prototype that involves [pattern X] — it might be worth building."

---

*elicitation-ui-lab v4.2 · March 15, 2026 · Step 2: prototypes not static sketches. Step 5: two-section Notion format. Step 6: Slack to #new-design-artifacts. Step 4 batch deploy: base64 encoding required — </script> inside script blocks breaks browser parser; no string-escaping workaround is reliable.*
