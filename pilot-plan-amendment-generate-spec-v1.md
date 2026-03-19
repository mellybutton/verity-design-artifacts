# Pilot Plan Amendment: Generate Spec Feature

**Feature:** SF-005 Generate Spec modal + dispatch pipeline  
**Ship date:** March 26, 2026 (pilot Day 8)  
**Timeline:** 8-week Acme pilot, March 18–May 13, 2026  
**OKR alignment:** OKR 4.1 (Rule Reuse), OKR 4.2 (Cluster Formation), OKR 2.1 (BECAUSE Completion)

---

## Why This Matters

**Generate Spec is a proof-of-concept for the compounding moat.**

The pilot's hardest OKR is **4.1 (Rule Reuse):** proving that Alex (PM) or Jordan (CS) references existing confirmed rules to resolve new tickets. Currently, rules exist in Verity library but lack a formal handoff to Alex's product workflow.

Generate Spec **closes this loop:**
- Jordan sees clusters forming in real-time (OKR 4.2)
- Jordan translates those clusters into product + engineer specs (OKR 4.3 coverage)
- Alex receives structured product requirements (not just a link to rule library)
- Riley receives implementation spec (not just a Slack card)
- Specs become a formal artifact that triggers product + eng work
- Work traceable back to confirmed rules → proof of reuse (OKR 4.1)

**Without Generate Spec:** Rules sit in library. Alex may not know rules exist. Reuse is invisible.  
**With Generate Spec:** Rules → clusters → formal product specs → tracked work → measurable reuse.

---

## Pilot Timeline Integration

**Weeks 1–2 (March 18–April 1: Confirmation Velocity)**
- Jordan confirms first 10–15 rules (OKR 1.1, 2.1)
- SF-005 Clusters surface ≥2 clusters (OKR 4.2)
- Generate Spec ships (March 26, Day 8)
- Jordan ready to test spec generation flow

**Week 3 (April 1–8: Cluster Maturity)**
- Jordan generates first spec from confirmed cluster
- Alex receives Product Spec, reviews for feasibility
- Riley receives Engineer Spec, scopes implementation
- First Jira task created (DEV-### "Implement rules from [cluster]")
- Decision Log captures spec dispatch event

**Weeks 4–8 (April 8–May 13: Reuse + Compounding)**
- Monitor: Time from spec dispatch → Riley task completion (should be ≤14 days)
- Monitor: Alex references confirmed rules in ticket notes (OKR 4.1 signal)
- Jira tasks assigned from specs should move to Done
- Generate ≥2 specs total (shows cluster flow is repeatable)
- Measure: Spec-to-implementation velocity signals whether framework works

---

## OKR Impact Map

### OKR 1.1 (≥15 confirmed rules by Day 30)
- **How Generate Spec helps:** Rules that enter clusters are confirmed, complete with BECAUSE (AI-eligible). Cluster formation proves confirmation velocity is healthy.
- **Signal:** If rules aren't confirmed, clusters don't form → Generate Spec can't run. Button stays disabled until conflicts resolved.

### OKR 2.1 (≥80% BECAUSE completion rate)
- **How Generate Spec helps:** BECAUSE clause appears in both Product + Engineer specs. If BECAUSE is missing, spec quality degrades. Jordan sees the incomplete rationale in preview → incentivizes completing BECAUSE at confirmation time.
- **Signal:** Melanie checks: "Both specs have complete BECAUSE text? If not, completion rate is flagged."

### OKR 4.1 (≥3 instances of rule reuse by Day 45)
- **How Generate Spec helps:** Specs create a formal handoff artifact. Alex can explicitly log "Rule-referenced: [Product Spec name]" in ticket notes. Jira task linked back to spec.
- **Signal:** Look for decision_log entries where Alex writes "Spec-referenced" or Jira task has comment "Implemented rule from [spec]".

### OKR 4.2 (≥2 clusters by Day 30)
- **How Generate Spec helps:** Clusters must exist to generate specs. Button disabled if conflicts block generation. Conflict resolution becomes active flow, not passive library.
- **Signal:** If ≥2 clusters exist on Day 30, pilot is on track. If <2, conflict detection or rule confirmation is lagging.

### OKR 4.3 (≥4 domains with ≥3 rules each)
- **How Generate Spec helps:** Each spec dispatch logs cluster domain. Melanie can count specs by domain → measure distribution. Non-uniformity signals over-concentration.
- **Signal:** If all specs are "escalation" domain, distribution is broken. If rules spread across all 6 domains, evidence of universality.

---

## Success Metrics (Pilot-Specific)

Track these weekly. Log in Decision Log or Manual Task Log.

| Metric | Target | Check Point | Owner |
|--------|--------|------------|-------|
| **Specs Generated** | ≥1 by Day 20, ≥2 by Day 45 | Count rows in Generated Specs DB | Melanie |
| **Spec-to-Jira Velocity** | ≤14 days from dispatch to task in Done | Query Jira: task created by spec → task closed | Hilary |
| **Conflict Resolution Rate** | 100% of specs generated have 0 unresolved at dispatch time | Decision Log: logged per dispatch | Melanie |
| **Alex Engagement** | ≥1 Product Spec reviewed by Alex (documented in Slack or Decision Log) | Check #eng-planning Slack thread | Melanie |
| **Riley Velocity** | ≥1 Engineer Spec task started within 3 days of dispatch | Check task start date vs. spec created_at | Hilary |
| **BECAUSE Completeness** | 100% of rules in specs have non-empty because_clause | Check spec MD for empty brackets or "TBD" | Melanie |
| **Domain Distribution** | Specs span ≥3 of 6 domains | Group specs by cluster.domain | Melanie |

---

## Rollout Plan (Days 8–10)

**March 26 (Day 8): Ship**
- DEV-163 + DEV-[DISPATCH] + DEV-[ROUTING] all merged and deployed to staging
- Tested with mock data
- Deploy to production

**March 27 (Day 9): Internal QA**
- Melanie + Hilary run through spec generation end-to-end
- Check: Notion pages created, Jira task assigned, Slack messages sent, Decision Log entry written
- Check: Second generation archives prior spec, increments version
- Check: Conflict detection blocks generation when appropriate
- Bug fixes if needed

**March 28 (Day 10): Ready for Jordan to test**
- Jordan has ≥2 confirmed clusters available (from Days 1–7 rule confirmation)
- Jordan clicks "Generate spec" on cluster card
- Modal opens, Jordan reviews Product + Engineer specs
- Jordan clicks "Send Specs"
- Specs dispatch to Alex + Riley
- Ask Alex + Riley for feedback: "Was the spec clear? Useful?"

---

## Risk Mitigation

**Risk 1: Notion integration fails**
- Fallback: Manually create Notion pages from template (Melanie does it), link spec_generation rows manually
- Timeline impact: 30 min per spec generation
- Unlikely: Notion API is stable

**Risk 2: Jira task assignment to Riley doesn't work**
- Fallback: Create task manually, update spec_generation.jira_task_id
- Timeline impact: 10 min per spec
- Likely: Riley account ID is correct (verified in Jira)

**Risk 3: Slack sends but messages are hard to read**
- Fallback: Alex + Riley forward specs manually via Slack
- Timeline impact: None (spec content is already in Notion)
- Mitigation: User test with Alex + Riley on Day 27 before Day 28 Go-Live

**Risk 4: Clusters don't form by Day 20 (no specs to generate)**
- Root cause: Either rule confirmation is too slow (OKR 1.1 at risk) or rules are too fragmented (no thematic grouping)
- Mitigation: Run Melanie + Jordan sync on Day 19, check cluster formation progress. If <2 clusters, trigger conflict resolution sprint.

---

## Notion Setup Required

**Before Deploy:**

1. **Create "Generated Specs" database** (under Verity Strategy section)
   - Fields: Title, Cluster (relation), Spec Type (select: product/engineer), Product Spec Link (URL), Engineer Spec Link (URL), Generated By (person), Generated At (date), Status (select: draft/dispatched/implemented/superseded), Riley's Task (relation to Jira), Alex's Feedback (text)

2. **Load templates into codebase**
   - `notion-product-spec-template.md`
   - `notion-engineer-spec-template.md`

3. **Test manual Notion page creation**
   - Create one mock spec page
   - Verify template variables render correctly
   - Verify child page nesting works

---

## Post-Pilot (R2+)

**Future refinements:**

1. **Spec Feedback Loop:** Alex + Riley rate spec clarity (1–5 scale). Store in `spec_generations.quality_score`. Use to improve template wording.

2. **Automatic Domain Routing:** Build domain → engineer mapping table. Route specs to domain expert (not everyone to Riley).

3. **Spec Reuse Tracking:** If same cluster regenerates (same rules updated), calculate similarity to prior spec version. Flag if >80% overlap → no new work.

4. **CI/CD Integration:** Parse Engineer Spec YAML directly into inference config (no manual copy-paste). Load at deploy time.

5. **Spec Publishing:** Publish approved specs to customer-facing Knowledge Base (SKG, skill graph documentation).

---

## Decision Points

**Question 1: If first cluster has unresolved conflicts on Day 20, do we:**
- (A) Block all specs until conflicts resolved → forces issue resolution early
- (B) Allow specs with warning → risks lower-quality product/eng alignment
- Recommendation: **(A) Block.** The conflict detection is the feature. Using it is how we learn if system works.

**Question 2: If first spec generates but Alex + Riley don't engage, do we:**
- (A) Assume spec format is wrong → iterate on template
- (B) Assume specs are too early in pilot → wait until more rules accumulated
- (C) Manually follow up with Alex + Riley → gather feedback
- Recommendation: **(C) → (A).** Melanie should reach out Day 28, ask for feedback on spec clarity. Adjust template if needed before Day 45.

**Question 3: If Riley completes a task from spec v1, then Jordan updates rules and generates spec v2 for same cluster, do we:**
- (A) Create new Jira task for v2 (separate work)
- (B) Add v2 rules to existing task (same work)
- (C) Close v1 task as Complete, create new v2 task (sequential)
- Recommendation: **(A).** Each spec version is a formal handoff artifact. New version = new work. Allows tracking when rules compound into new features vs. when same rules are re-confirmed.

---

## Success Definition (Pilot Done)

Generate Spec is **successful** if:

✅ ≥2 specs generated by Day 45  
✅ ≥1 Engineer Spec task started by Day 30 and moved to Done by Day 45  
✅ ≥1 instance of rule reuse logged (Alex references spec in ticket notes)  
✅ Conflict detection prevented ≥1 broken spec generation (button was disabled, Jordan resolved conflict)  
✅ 100% of rules in generated specs have complete BECAUSE fields  
✅ Alex + Riley both rate spec format as "useful" (yes/no feedback form)  

If 5/6 ✅, pilot is successful. Proceed to Phase 0 readiness + seed raise.

---

*Verity Pilot Plan Amendment: Generate Spec · v1.0 · March 2026*
