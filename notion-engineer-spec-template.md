# [CLUSTER_NAME] — Engineer Specification

**Generated from Verity Clusters** · [DATE] · v[VERSION]  
**Cluster Domain:** [DOMAIN]  
**Signal Strength:** [STRONG|MEDIUM|WEAK]  
**Rules to Implement:** [N] confirmed rules  
**Estimated Load Time:** [Xms] retrieval + [Yms] match resolution

---

## Quick Reference

| Metric | Value |
|--------|-------|
| Rule Count | [N] |
| Specificity Range | [min]–[max] conditions per rule |
| Dependencies | [0 or list] |
| Exceptions | [count] rules have boundary conditions |
| Confidence Range | [min]–[max] / 5 |
| Matching Complexity | [LOW|MEDIUM|HIGH] |

---

## Rule Implementation Schema

Load these rules into the inference config in this order (by specificity, then priority):

```yaml
cluster: [DOMAIN]
version: [VERSION]
rules:
  - rule_id: [UUID]
    priority: 1
    specificity: [N] conditions
    
    if_condition: "[WHEN_CLAUSE — raw from Verity]"
    then_action: "[THEN_CLAUSE — raw from Verity]"
    except_clause: "[EXCEPT_CLAUSE if present, else omit]"
    
    owner: [Jordan/Author name]
    confidence: [1-5]
    because_reasoning: |
      [BECAUSE clause — Jordan's human reasoning]
      This is what makes the rule actionable, not just pattern-matched.
    
    source: [generated|captured|derived]
    source_reference: [Jira ticket link if available]
    created_at: [date]
    
  - rule_id: [UUID]
    priority: 2
    [repeat structure]
```

---

## Dependency Graph

**Dependencies Between Rules in This Cluster:**
```
[Rule A] (escalation trigger)
  ├─ depends on: [Rule B] (confidence signal)
  └─ conflicts with: [Rule C] (never both match)

[Rule B] 
  └─ no dependencies

[Rule C]
  ├─ depends on: [Rule D]
  └─ depends on: [Rule E]
```

**Rules Outside This Cluster:**
- None detected in pilot data.

---

## Implementation Notes

### Boundary Conditions (Except Clauses)

For rules with exceptions, implement as:

| Rule | If Condition | Then Action | Except If | Handling |
|------|-------------|------------|-----------|----------|
| [Rule A] | [condition] | [action] | [exception] | Route to exception handler / escalate |
| [Rule B] | [condition] | [action] | [exception] | Log exception, skip this rule |

---

### Load & Performance

**Retrieval Strategy:**  
- Load all [N] rules into memory on @verity startup
- Re-sync on every Slack confirmation (when Jordan confirms a new rule)
- Cache miss: return stale rules (age ≤ 60s OK)

**Match Resolution:**  
- If multiple rules match: apply `confidence_weighted` or `specificity_first` policy (see domain_policy in pilot DB)
- p95 latency target: ≤60ms total (retrieval + matching)
- Log all matches in `decision_log` (caller_type: human or agent)

**Testing Checklist:**
- [ ] Can invoke each rule independently with mock data
- [ ] Match order correct (specificity/priority)
- [ ] Exceptions properly skip rules
- [ ] p95 latency measured and ≤60ms
- [ ] `decision_log` entries written for all test matches

---

## Integration Checklist

- [ ] Rules loaded into inference config
- [ ] @verity query tested against each rule (at least 1 happy path per rule)
- [ ] Exception handling validated (if applicable)
- [ ] Latency measured: p95 ≤60ms
- [ ] `decision_log` entries created for test queries
- [ ] Rollback plan documented (in case any rule causes issues)
- [ ] Deploy to staging, test with actual Slack messages
- [ ] Deploy to production
- [ ] Monitor `decision_log` for divergence (any rule matching unexpectedly?)

---

## Questions for Engineering

- [ ] Should these rules be loaded async or synchronously at startup?
- [ ] How do we handle rule updates mid-day? Do we reload or wait for next startup?
- [ ] Should we log skipped rules (rules that didn't match) in `decision_log` too?
- [ ] Any performance concerns with [N] rules + [complexity]?

---

**Next Step:** Coordinate with Alex (Product Spec review). Ship by [DUE_DATE].

---

*Verity Cluster Spec · [CLUSTER_NAME] · v[VERSION] · Generated [DATE]*
