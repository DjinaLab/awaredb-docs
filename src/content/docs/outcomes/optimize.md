---
title: Optimize & solve
description: Find the input that hits a target, the decision variables that maximize an objective, or the assignment that satisfies a set of constraints.
---

**Outcome:** don't just compare options — let AwareDB *find* the answer. Hit a
target, maximize an objective under constraints, or solve a constraint problem.

## When you want this

- "What price gives us 12 months of runway?" — solve for one input.
- "Maximize ARR without burn exceeding X and headcount under Y." — optimize under
  constraints.
- "Assign these with no conflicts" (scheduling, allocation, Sudoku-grade) — satisfy
  a set of constraints.

## How AwareDB does it

### Solve for a target — `goal_seek`

Find the value of one decision input that drives a target to the value you want.

```python
client.goal_seek(
    target={"path": "company.runway", "value": "12 month"},
    decision={"path": "pro.mrr_per_customer"},
)
```

### Maximize / minimize — `optimize`

Vary decision variables to optimize objectives, subject to constraints.

```python
client.optimize(
    objectives=[{"path": "company.arr", "goal": "max"}],
    decisions=[{"path": "starter.customers"}, {"path": "pro.customers"}],
    constraints=["company.burn_monthly < 80000 'EUR/month'"],
)
```

### Satisfy constraints — `csp`

A backtracking constraint solver (with MRV ordering) over formula constraints.
Variables declare a domain; constraints are formulas that must hold; an `ADBError`
prunes a branch. Exposed over the [REST API](/reference/rest-api/) as the `csp`
command.

## What you get

A solved answer rather than a list to eye-ball — computed against the same
unit-aware, deterministic model. Constraints that involve units stay dimensionally
honest.

## Go deeper

- [Analyses reference](/reference/analyses/) — `goal_seek`, `optimize`, `csp`
  parameters and response shapes.
- [Run what-if scenarios](/outcomes/what-if/) — when comparing a few options is
  enough.
