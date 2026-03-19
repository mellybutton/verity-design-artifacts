---
name: html-deployment-pipeline
description: Deploys any Verity HTML artifact to GitHub (mellybutton/verity-design-artifacts), marks any prior version of the same file as OLD, updates the corresponding Notion page with a fresh download link, and posts a Slack notification to #new-design-artifacts mentioning @princesszebra. Use this skill whenever a new or updated HTML artifact is ready — design system updates, pilot surface designs, marketing page versions, prototypes, or any other HTML file that Hilary or others need to access. Triggers on phrases like "deploy this", "push to GitHub", "update the download link", "Hilary needs this", "push the HTML", or at the end of any session where a new HTML file was produced. ALWAYS run this skill after producing a new HTML artifact — never leave a file sitting in outputs without deploying it.
---

# HTML Deployment Pipeline — v2

*v1: March 2026 — CodeSandbox deploy (deprecated, CSB blocked)*
*v2: March 2026 — GitHub deploy via git push + Notion link update + Slack notification*

Deploys HTML artifacts to GitHub, archives old versions, updates Notion, notifies Hilary.

---

## Credentials (stored in Notion → 🔑 Settings — API Tokens)

| Key | Value |
|---|---|
| `GITHUB_TOKEN` | `[REDACTED — see Notion 🔑 Settings]` |
| `GITHUB_USERNAME` | `mellybutton` |
| `GITHUB_REPO` | `verity-design-artifacts` |
| Repo URL | `https://github.com/mellybutton/verity-design-artifacts` |
| Raw base URL | `https://raw.githubusercontent.com/mellybutton/verity-design-artifacts/main/` |

Slack: `#new-design-artifacts` channel ID `C0AJWAESB26` · Hilary handle `@princesszebra`

---

## Step 0: Confirm inputs

Before running, confirm:
- **File path** — where is the HTML file? (usually `/home/claude/[filename].html` or `/mnt/user-data/outputs/[filename].html`)
- **Filename** — the canonical versioned name (e.g., `verity-design-system-v2_8.html`)
- **Notion page ID** — which Notion page should get the updated download link?

If any are missing, check context — the filename and Notion page ID are usually obvious from the current session.

---

## Step 1: Set up git repo

```bash
cd /home/claude

# Clone if not already present
if [ ! -d "verity-artifacts" ]; then
  git clone https://mellybutton:[REDACTED — see Notion 🔑 Settings]@github.com/mellybutton/verity-design-artifacts.git verity-artifacts
fi

cd verity-artifacts
git config user.email "melanie@moonkats.com"
git config user.name "Melanie"
git pull origin main 2>&1
```

---

## Step 2: Archive old versions

Before copying the new file in, detect and rename any prior versions of the same artifact.

**Versioning logic:** Strip the version number and extension from the new filename to get the base name pattern.

Examples:
- `verity-design-system-v2_8.html` → base: `verity-design-system`
- `sf-009-dashboard-v3.html` → base: `sf-009-dashboard`
- `verity-marketing-v2_30.html` → base: `verity-marketing`
- `verity-pilot-prototype-v2.html` → base: `verity-pilot-prototype`

```bash
# Extract base name (strip trailing -vN, -vN_N, _vN etc. and .html)
BASE=$(echo "FILENAME_HERE" | sed 's/[-_]v[0-9][0-9_]*\.html$//' | sed 's/\.html$//')

cd /home/claude/verity-artifacts

# Find all existing files matching this base (not already _OLD)
for f in ${BASE}*.html; do
  if [[ "$f" != *"_OLD"* ]] && [[ "$f" != "FILENAME_HERE" ]]; then
    OLD_NAME="${f%.html}_OLD.html"
    git mv "$f" "$OLD_NAME" 2>/dev/null || mv "$f" "$OLD_NAME"
    echo "Archived: $f → $OLD_NAME"
  fi
done
```

Replace `FILENAME_HERE` with the actual filename being deployed.

If no prior versions are found, skip silently.

---

## Step 3: Copy and commit

```bash
cd /home/claude/verity-artifacts

# Copy new file in
cp /path/to/new/file.html ./FILENAME_HERE

# Update README — replace old raw link with new one (if prior version existed)
# Pattern: find line containing base name raw link, update it
sed -i "s|raw.githubusercontent.com/mellybutton/verity-design-artifacts/main/${BASE}[^)]*\.html|raw.githubusercontent.com/mellybutton/verity-design-artifacts/main/FILENAME_HERE|g" README.md

# If it's a new artifact not yet in README, append a row to the relevant section
# (do this manually if needed — see Step 5)

git add .
git commit -m "Deploy FILENAME_HERE — archive previous version as _OLD"
git push origin main 2>&1
```

Confirm push succeeded (look for `main -> main` in output). If push fails with auth error, the token may need regeneration at https://github.com/settings/tokens.

---

## Step 4: Update Notion page

The raw download URL for the new file is:
```
https://raw.githubusercontent.com/mellybutton/verity-design-artifacts/main/FILENAME_HERE
```

On the target Notion page, find the existing download link line and replace it. The standard format is:

```
[↓ Download FILENAME_HERE](https://raw.githubusercontent.com/mellybutton/verity-design-artifacts/main/FILENAME_HERE)
```

Use `notion-update-page` with `update_content` command. Find the old `raw.githubusercontent.com` link for this artifact and replace it with the new one.

If no download link exists yet on the page, prepend one at the top of the page content.

---

## Step 5: Update README on GitHub

The README.md in the repo serves as the master index. After deploying:

1. Ensure the new file has a row in the README table
2. Ensure the old file's row (if it existed) now points to the `_OLD` filename or is removed
3. Push updated README as part of the same commit (Step 3) or a follow-up commit

README table format:
```markdown
| `filename-vN.html` | Description | [↓ Download](https://raw.githubusercontent.com/mellybutton/verity-design-artifacts/main/filename-vN.html) |
```

---

## Step 6: Slack notification

Post to `#new-design-artifacts` (channel ID: `C0AJWAESB26`):

```
🚀 [artifact-name] vN is live → https://raw.githubusercontent.com/mellybutton/verity-design-artifacts/main/FILENAME_HERE @princesszebra
```

Use the `Slack:slack_send_message` tool with the channel ID above.

---

## Step 7: Tell the user

Summarize:
1. File deployed: `FILENAME_HERE`
2. Old version archived as: `BASENAME_OLD.html` (if applicable)
3. Raw download URL: `https://raw.githubusercontent.com/mellybutton/verity-design-artifacts/main/FILENAME_HERE`
4. Notion page updated: [link]
5. Slack notification sent to #new-design-artifacts

---

## Guardrails

- Never delete a file — only rename to `_OLD`. Git history preserves everything regardless.
- If the git push fails, tell the user the error verbatim and suggest token regeneration.
- If multiple old versions exist (e.g., `v2_6` and `v2_7` both present), archive ALL of them.
- If the Notion page ID is unknown, search Notion for the artifact name before proceeding.
- Never run this skill on a file that is already marked `_OLD`.
