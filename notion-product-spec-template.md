# [CLUSTER_NAME] — Product Specification

**Generated from Verity Clusters** · [DATE] · v[VERSION]  
**Cluster Domain:** [DOMAIN]  
**Signal Strength:** [STRONG|MEDIUM|WEAK]  
**Rules Included:** [N] confirmed rules

---

## Executive Summary

[CLUSTER_DESCRIPTION_FROM_SF005]

This product specification translates operational expertise from the CS team into product requirements. Each rule in this cluster represents a decision or workflow that should be reflected in product logic, configuration, or feature design.

---

## Rules → Product Requirements Mapping

### Rule 1: [RULE_NAME]

**Situation**  
[Translate IF clause to plain English business context]  
Example: "A customer shows 3+ early warning signs within their first 7 days post-onboarding"

**Action**  
[Translate THEN clause to product outcome]  
Example: "Trigger a CS Principal outreach workflow with pre-written escalation templates"

**Why This Matters** ([BECAUSE clause])  
[Jordan's human-authored reasoning — unchanged]

**Confidence:** [1-5]  
**Owner:** [Author name]  
**Source Ticket:** [Jira link if available]

---

### Rule 2: [RULE_NAME]

[Repeat structure above]

---

## Coverage & Gaps

**Covered Scenarios:**
- [Extract from IF clauses — what situations are handled?]

**Known Gaps:**
- [Any edge cases Jordan flagged? Any obvious gaps in the domain?]

---

## Recommended Product Actions

**Priority Tier:** [HIGH|MEDIUM|LOW] ← calculated from signal_strength

**Suggested Implementation Sequence:**
1. [Rule name with highest specificity/priority]
2. [Next rule]
3. [etc.]

**Estimated Scope:**  
- ~[N] rules = [S] Jira points of product work
- Affects: [Which features? Settings? Workflows?]
- User personas impacted: [Alex / Jordan / Morgan / Riley]

---

## Questions for Product

- [ ] Do these rules map cleanly to a single feature, or should they be split across multiple initiatives?
- [ ] Are there conflicting product behaviors currently in place that will need to change?
- [ ] Should this be behind a feature flag, or always-on?

---

**Next Step:** Riley has the Engineer Spec. Review and align by [DUE_DATE].

---

*Verity Cluster Spec · [CLUSTER_NAME] · v[VERSION] · Generated [DATE]*
