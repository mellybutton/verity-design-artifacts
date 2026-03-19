# Generate Spec — Integration Specification

**Feature:** SF-005 Clusters → Generate Spec Modal → Dispatch to Alex (Product) + Riley (Eng)  
**Timeline:** Ship before pilot Day 10  
**Jira Tickets:** DEV-163 (modal), DEV-[DISPATCH] (dispatch pipeline), DEV-[ROUTING] (domain routing)

---

## Flow Overview

```
User clicks "Generate spec" on cluster card
  ↓
Conflict check (BE-006 query)
  ├─ Unresolved conflicts? → Button disabled, show tooltip "Resolve X conflicts"
  └─ No conflicts? → Open modal
  ↓
Modal shows 2 tabs: Product Spec | Engineer Spec (read-only preview)
  ↓
Jordan reviews both tabs
  ↓
Jordan checks "I confirm specs are ready"
  ↓
Jordan clicks "Send Specs"
  ↓
Dispatch pipeline runs (async):
  1. Generate Notion pages from templates
  2. Send Slack notifications (Alex + Riley)
  3. Create Jira task (assigned to Riley)
  4. Archive any prior version of this spec
  5. Write Decision Log entry
  ↓
Toast: "✅ Specs generated and dispatched"
```

---

## 1. CONFLICT CHECK (Gate)

**Query (SQL):**
```sql
SELECT COUNT(*) as unresolved_conflicts
FROM conflict_incidents
WHERE cluster_id = $1
  AND resolved = false
  AND severity IN ('critical', 'high');
```

**Button state:**
- If count > 0: `disabled` + tooltip "Resolve [count] conflicts before generating spec. [Go to SF-010]"
- If count = 0: `enabled` + primary styling

**Tooltip link:**
- Click "Go to SF-010" → navigate to SF-010 Conflict Resolution modal, scoped to this cluster

---

## 2. MODAL UI (SF-005 Enhancement)

**Markup structure:**
```html
<div class="modal generate-spec-modal" style="display: none;">
  <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
    
    <!-- Header -->
    <div class="modal-header">
      <h2>[CLUSTER_NAME] — Generate Specification</h2>
      <button class="btn-close" onclick="closeModal()">✕</button>
    </div>
    
    <!-- Tabs -->
    <div class="tabs-nav">
      <button class="tab-btn active" data-tab="product">Product Spec (for Alex)</button>
      <button class="tab-btn" data-tab="engineer">Engineer Spec (for Riley)</button>
    </div>
    
    <!-- Tab 1: Product Spec Preview -->
    <div id="product-tab" class="tab-content active">
      <div class="spec-preview">
        <!-- Rendered from template with cluster data populated -->
        <!-- Read-only; content shown but not editable -->
      </div>
    </div>
    
    <!-- Tab 2: Engineer Spec Preview -->
    <div id="engineer-tab" class="tab-content">
      <div class="spec-preview">
        <!-- Rendered from template with cluster + rule schema populated -->
        <!-- Read-only; content shown but not editable -->
      </div>
    </div>
    
    <!-- Confirmation + Actions -->
    <div class="modal-footer">
      <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
        <input type="checkbox" id="confirm-specs" />
        <span>I confirm both specs are ready to dispatch</span>
      </label>
      <div class="button-group">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button 
          class="btn btn-primary" 
          id="send-specs-btn"
          disabled
          onclick="dispatchSpecs()"
        >
          Send Specs →
        </button>
      </div>
    </div>
  </div>
</div>
```

**JS logic:**
```javascript
// Enable Send button only when checkbox is checked
document.getElementById('confirm-specs').addEventListener('change', (e) => {
  document.getElementById('send-specs-btn').disabled = !e.target.checked;
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const tabName = e.target.dataset.tab;
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
  });
});

// Dispatch handler
async function dispatchSpecs() {
  const clusterId = getCurrentClusterId();
  const response = await fetch('/api/specs/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cluster_id: clusterId })
  });
  
  if (response.ok) {
    const { notion_product_link, notion_engineer_link, jira_task_id } = await response.json();
    showToast(`✅ Specs generated and dispatched
      • Alex notified (Slack)
      • Riley task: ${jira_task_id}
      • Docs: [Product](${notion_product_link}) [Engineer](${notion_engineer_link})`);
    closeModal();
    refreshClusterView();
  } else {
    showError('Failed to generate specs. Try again?');
  }
}
```

---

## 3. DISPATCH PIPELINE (Backend)

**Endpoint:** `POST /api/specs/generate`

**Request body:**
```json
{
  "cluster_id": "uuid",
  "user_id": "jordan-chen-id"
}
```

**Response (on success):**
```json
{
  "spec_generation_id": "uuid",
  "version": 2,
  "notion_product_link": "https://notion.so/...",
  "notion_engineer_link": "https://notion.so/...",
  "jira_task_id": "DEV-123",
  "slack_messages": {
    "alex_ts": "1234567890.123456",
    "riley_ts": "1234567890.654321"
  },
  "dispatched_at": "2026-03-19T15:30:00Z"
}
```

**Pipeline steps (transaction):**

### Step 3.1: Archive Prior Spec (if exists)

```sql
-- Find prior spec for this cluster (if any)
SELECT spec_generation_id, version 
FROM spec_generations 
WHERE cluster_id = $1 
  AND status = 'Dispatched'
ORDER BY version DESC 
LIMIT 1;

-- If exists: mark as Superseded
UPDATE spec_generations
SET status = 'Superseded'
WHERE spec_generation_id = $2;
```

### Step 3.2: Create Notion Pages from Templates

**Product Spec:**
1. Load template: `notion-product-spec-template.md`
2. Populate variables:
   - `[CLUSTER_NAME]` → cluster.name
   - `[DOMAIN]` → cluster.domain
   - `[SIGNAL_STRENGTH]` → cluster.signal_strength
   - `[DATE]` → today
   - `[VERSION]` → auto-increment (v1, v2, v3...)
   - `[CLUSTER_DESCRIPTION_FROM_SF005]` → cluster.description
   - `[N]` → count(rules where status=confirmed AND cluster_id=$1)
   - For each rule: populate Rule name, IF clause, THEN clause, BECAUSE clause, confidence, author
   - `[COVERAGE_GAPS]` → manual (hardcoded empty for MVP)
3. Create Notion page under "Generated Specs" database
4. Set metadata: Cluster relation, Spec Type: "Product", Generated By: user_id, Generated At: now()
5. Return `notion_product_page_id`

**Engineer Spec:**
1. Load template: `notion-engineer-spec-template.md`
2. Populate variables: same as above, plus:
   - `[YAML_SCHEMA]` → render rules in YAML format:
     ```yaml
     rules:
       - rule_id: [uuid]
         priority: [computed by specificity + manual priority field]
         specificity: [count of predicates in when_clause]
         if_condition: "[raw when_clause]"
         then_action: "[raw then_clause]"
         except_clause: "[except_clause if not null]"
         owner: [author_id]
         confidence: [confidence 1-5]
         because_reasoning: "[because_clause]"
     ```
   - Dependency graph: hardcoded "None detected" for MVP
   - Performance notes: "Estimated [Xms] retrieval + [Yms] match resolution"
3. Create Notion page under "Generated Specs" database
4. Set metadata: Cluster relation, Spec Type: "Engineer", Generated By: user_id, Generated At: now()
5. Return `notion_engineer_page_id`

### Step 3.3: Create Database Rows

```sql
INSERT INTO spec_generations (
  cluster_id,
  spec_type,
  version,
  notion_page_id,
  generated_by,
  conflict_check_passed,
  status,
  created_at
) VALUES 
  ($1, 'product', (SELECT COALESCE(MAX(version), 0) + 1 FROM spec_generations WHERE cluster_id = $1), $2, $3, true, 'Dispatched', NOW()),
  ($1, 'engineer', (SELECT COALESCE(MAX(version), 0) + 1 FROM spec_generations WHERE cluster_id = $1), $4, $3, true, 'Dispatched', NOW());
```

Return both spec_generation_ids.

### Step 3.4: Create Jira Task

**API call:** `POST https://moonkatz.atlassian.net/rest/api/3/issues`

**Payload:**
```json
{
  "fields": {
    "project": { "key": "DEV" },
    "summary": "Implement rules from [CLUSTER_NAME] spec",
    "issuetype": { "name": "Task" },
    "assignee": { "id": "557058:ee5620ac-19b6-4c6f-88d5-ed65471536e1" },  // Riley
    "priority": { "name": "High" },  // if signal_strength == Strong; else Medium
    "description": {
      "version": 1,
      "type": "doc",
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Spec generated from Clusters view by Jordan Chen on [DATE].\n\nProduct Spec: [NOTION_PRODUCT_LINK]\nEngineer Spec: [NOTION_ENGINEER_LINK]\n\nRules to implement: [N]\nEstimated effort: [S] points\nNo blocking dependencies detected.\n\nDefinition of Done:\n- [ ] Rules loaded into inference config\n- [ ] @verity query tested against each rule\n- [ ] p95 match latency ≤ 60ms\n- [ ] Mark task Done"
            }
          ]
        }
      ]
    },
    "duedate": "[DATE + 7 days]"
  }
}
```

**Store response:**
- Extract `issue.key` (e.g., "DEV-123")
- Store in spec_generations.jira_task_id
- Update spec_generations with link to this task

### Step 3.5: Send Slack Notifications

**To Alex (DM or #eng-planning):**

```
{
  "channel": "C_ALEX_DM_ID",  // or hardcoded channel ID
  "text": "🚀 Product Spec Ready: Early Churn Intervention",
  "blocks": [
    {
      "type": "header",
      "text": { "type": "plain_text", "text": "🚀 Product Spec: [CLUSTER_NAME]" }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Cluster: *[DOMAIN]* ([SIGNAL_STRENGTH])\n\n*Rules:* [N] confirmed\n*Generated by:* Jordan Chen"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "View Product Spec" },
          "url": "[NOTION_PRODUCT_LINK]",
          "style": "primary"
        },
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "Cluster Detail" },
          "url": "[SF-005_CLUSTER_DETAIL_LINK]"
        }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Please review for product feasibility. Feedback by Friday?"
      }
    }
  ]
}
```

Store `slack_message_ts` in spec_generations.slack_msg_ts (for threading if needed later).

**To Riley (DM or #engineering):**

```
{
  "channel": "C_RILEY_DM_ID",  // or hardcoded channel ID
  "text": "🚀 Engineer Spec Ready: Early Churn Intervention",
  "blocks": [
    {
      "type": "header",
      "text": { "type": "plain_text", "text": "🚀 Engineer Spec: [CLUSTER_NAME]" }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Cluster: *[DOMAIN]* ([SIGNAL_STRENGTH])\n\n*Rules:* [N] to implement\n*Dependencies:* None detected\n*Generated by:* Jordan Chen"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "View Engineer Spec" },
          "url": "[NOTION_ENGINEER_LINK]",
          "style": "primary"
        },
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "Jira Task" },
          "url": "https://moonkatz.atlassian.net/browse/DEV-123"
        }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Ready to implement. Start next sprint?"
      }
    }
  ]
}
```

### Step 3.6: Decision Log Entry

```sql
INSERT INTO decision_log (
  tenant_id,
  area,
  title,
  content,
  created_at
) VALUES (
  $1,
  'Product',
  'Generated spec for [CLUSTER_NAME]',
  'Conflict check: 0 unresolved. Product + Engineer specs dispatched to Alex and Riley. Jira task DEV-### created. Notion docs linked. Version [N].',
  NOW()
);
```

### Step 3.7: Return Response

```json
{
  "spec_generation_id": "[uuid]",
  "version": 2,
  "notion_product_link": "https://notion.so/...",
  "notion_engineer_link": "https://notion.so/...",
  "jira_task_id": "DEV-123",
  "slack_messages": {
    "alex_ts": "1234567890.123456",
    "riley_ts": "1234567890.654321"
  },
  "dispatched_at": "2026-03-19T15:30:00Z"
}
```

---

## 4. VERSIONING & ARCHIVING LOGIC

**When a spec is regenerated:**

1. Query prior spec: `SELECT * FROM spec_generations WHERE cluster_id = $1 AND spec_type = 'product' AND status = 'Dispatched' ORDER BY version DESC LIMIT 1`

2. If exists:
   - Update old spec: `UPDATE spec_generations SET status = 'Superseded' WHERE spec_generation_id = $OLD_ID`
   - Create new Notion page (v2, v3, etc.) instead of updating old one
   - Create new Jira task (old task stays as reference in Decision Log)

3. Notion pages:
   - Old spec page URL remains active (archived as read-only reference)
   - Title updated: `[CLUSTER_NAME] Spec v1 (Superseded)`
   - New page created: `[CLUSTER_NAME] Spec v2`

4. Jira tasks:
   - Old task: `Link` field updated with comment: "Superseded by DEV-[NEW_TASK_ID]"
   - New task: created fresh (Riley should close old task if it's incomplete)

---

## 5. DATA SCHEMA (New Table)

```sql
CREATE TABLE spec_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID NOT NULL REFERENCES clusters(id),
  spec_type TEXT NOT NULL CHECK (spec_type IN ('product', 'engineer')),
  version INT NOT NULL,
  notion_page_id TEXT NOT NULL,  -- Full URL to generated Notion page
  generated_by UUID NOT NULL REFERENCES users(id),
  conflict_check_passed BOOLEAN NOT NULL DEFAULT false,
  jira_task_id TEXT,  -- e.g., "DEV-123" (only for engineer specs)
  slack_msg_ts TEXT,  -- Slack message timestamp (for threading)
  status TEXT NOT NULL CHECK (status IN ('Dispatched', 'Implemented', 'Superseded')) DEFAULT 'Dispatched',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(cluster_id, spec_type, version)
);

CREATE INDEX idx_spec_generations_cluster ON spec_generations(cluster_id);
CREATE INDEX idx_spec_generations_status ON spec_generations(status);
```

---

## 6. ERROR HANDLING

**If Notion page creation fails:**
- Log error to backend logs
- Return 500 with message: "Failed to create Notion pages. Conflict check passed but dispatch failed. Try again?"
- Don't create Jira task or send Slack messages

**If Jira task creation fails:**
- Notion pages already created (don't roll back)
- Log error
- Manually create DEV-### task and link it to spec_generation row
- Send Slack to Riley: "Spec created but task creation failed. Creating manually..."

**If Slack send fails:**
- Notion pages + Jira task already created
- Log error
- Skip Slack notification (users can still navigate from SF-005 to Notion/Jira)

---

## 7. TESTING CHECKLIST

- [ ] Conflict check: button disabled when conflicts exist
- [ ] Modal renders both tabs with correct template data
- [ ] Send button disabled until checkbox checked
- [ ] Notion pages created with correct template variables
- [ ] Jira task created and assigned to Riley
- [ ] Slack messages sent to Alex and Riley with correct links
- [ ] Decision Log entry created
- [ ] spec_generations rows inserted
- [ ] Second generation: old spec marked Superseded, new spec created with version=2
- [ ] Error handling: if Notion creation fails, no Jira task created

---

*Verity Generate Spec Integration · v1.0 · March 2026*
