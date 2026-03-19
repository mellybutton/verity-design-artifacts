---
name: html-nav-mode
description: >
  Before building any HTML artifact, ask the user to choose their navigation
  mode: (A) in-page navigation — all content lives in one file, sections
  show/hide with JavaScript, no page reloads — or (B) multi-page links — href
  links that open new HTML files or external URLs in a new tab. Trigger this
  skill at the START of every HTML artifact build, before writing any code.
  Trigger phrases include: "build an HTML", "create an HTML", "make an HTML",
  "HTML page", "HTML artifact", "HTML file", "landing page", "HTML dashboard",
  "HTML doc", "design brief", "HTML report", or any request where the primary
  output is a .html file or HTML artifact. Do NOT skip this step — mismatched
  nav assumptions are a frequent source of broken links and rework.
---

# html-nav-mode — v1

Eliminates the most common HTML artifact miscommunication: whether links should navigate within the page or open new pages/files.

---

## When it triggers

At the **start of every HTML artifact build** — before any code is written. Triggers on: "build an HTML", "create an HTML", "HTML page", "HTML artifact", "HTML file", "landing page", "HTML dashboard", "HTML doc", "design brief", "HTML report", or any request where the primary output is a `.html` file.

---

## Step 1 — Ask before writing any code

Present the user with a choice using `ask_user_input_v0`:

> **How should navigation links work in this HTML?**
> - **A) In-page** — all content in one file; links scroll or show/hide sections (no page loads)
> - **B) Multi-page** — links open separate HTML files or external URLs (new tab or new page)

Wait for the answer before proceeding.

---

## Step 2 — Apply the chosen mode

### Mode A — In-page navigation
- All content in a single `.html` file
- Nav links use scroll anchors (`href="#section-id"`), JS show/hide, or tab/panel toggling
- **Never** use `href="other-page.html"` or `target="_blank"` for internal nav
- Use sidebar JS routing (no hash changes — Safari safe) per Verity design system

### Mode B — Multi-page links
- Links use `href="filename.html"` or full URLs
- Add `target="_blank" rel="noopener noreferrer"` for external URLs
- Note in a comment at top: `<!-- Multi-page mode: links open separate files -->`

---

## Step 3 — Label the artifact

Always include in `<head>`:
```html
<!-- nav-mode: in-page -->
<!-- OR -->
<!-- nav-mode: multi-page -->
```

---

## Edge Cases

- **User says "like before"**: check conversation history for prior nav-mode comment; apply it without asking
- **User explicitly specifies in prompt**: skip the question, apply the mode, still add the comment label
- **Purely decorative links** (`href="#"`): always fine, no mode conflict
- **Mixed needs**: clarify before proceeding
- **React artifacts** (`.jsx`): skip this skill — React handles routing differently
- **Verity-branded HTML**: Mode A is the default preference

---

*html-nav-mode v1 · March 14, 2026*
