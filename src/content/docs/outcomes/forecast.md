---
title: Forecast over time
description: Walk your model forward in time, applying per-step changes, to project how computed values evolve.
---

**Outcome:** project how your model's values evolve over time — runway month by
month, capacity over a ramp, anything time-dependent — with changes applied at each
step.

## When you want this

- You need a forward view: "where is runway in 12 months if customers grow 8% a
  month?", "what does capacity look like over the rollout?"
- You want the projection computed from the model you already built, not a
  separate spreadsheet that drifts out of sync.

## How AwareDB does it

The `projection` analysis walks forward from a start date in fixed steps, applies
per-step **edits**, and recalculates a read-only context at each point.

```python
client.projection(
    start_from="2026-01-01",
    unit="month",     # "day" or "month"
    step=1,
    points=12,
    edits=[
        {"path": "starter.customers", "formula": "=starter.customers * 1.08"},
    ],
)
```

Each of the 12 points is a fully recomputed snapshot of the model with the edits
applied cumulatively — so derived values like `company.mrr` and `company.runway`
evolve along the timeline.

## What you get

A time series of computed states, every point unit-correct and consistent with the
underlying model. Nothing is mutated — the projection is a read-only walk.

## Go deeper

- [Analyses reference](/reference/analyses/) — `projection` parameters and output.
- [Run what-if scenarios](/outcomes/what-if/) — single-point overrides instead of a
  timeline.
