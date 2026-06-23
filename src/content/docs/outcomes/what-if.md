---
title: Run what-if scenarios
description: Ask what happens if an input changes — without mutating your model — using scenarios, impact, and sensitivity.
---

**Outcome:** answer "what happens if…?" against your model and get a computed,
unit-correct answer back — without changing the stored data.

## When you want this

- A decision hinges on a number you don't control yet: a price, a headcount, a
  battery size. You want to see the consequence before committing.
- You want to compare several options side by side, or find which inputs actually
  move the outcome.

## How AwareDB does it

All of these recompute against a temporary context — your stored model is never
touched.

### Compare options — `scenarios`

Apply a set of path/value overrides and read the recomputed results.

```python
client.scenarios(edits=[
    {"path": "engineering.count", "value": 11},   # hire 5 more
    {"path": "engineering.count", "value": 6},    # status quo
])
```

### Sweep one input — `impact`

Vary a single input across a range of steps and watch an output move.

```python
client.impact(edit={"path": "battery.cells.total", "from": 5000, "to": 7000, "step": 250})
```

### Rank what matters — `sensitivity`

Perturb each input by ±delta and report which ones move the target most.

```python
client.sensitivity(
    target={"path": "company.runway"},
    inputs=[{"path": "company.cash"}, {"path": "engineering.salary"}],
)
```

## What you get

A fast, repeatable way to explore decisions. Because the engine is deterministic
and unit-aware, the same scenario always yields the same answer, and incompatible
comparisons surface as warnings rather than silent nonsense.

## Go deeper

- [Analyses reference](/reference/analyses/) — every parameter and response shape.
- [Optimize & solve](/outcomes/optimize/) — when you want the *best* input, not just
  a comparison.
