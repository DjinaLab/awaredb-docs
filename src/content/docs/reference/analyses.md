---
title: Analyses
description: The eight read-only analyses — scenarios, impact, projection, goal_seek, optimize, sensitivity, trace, and csp — with parameters and shapes.
---

Analyses answer questions about a model without changing it. Each recomputes against
a fresh, read-only context, so your stored data is never touched. They're available
on the [Python SDK](/reference/python-sdk/) and as [REST commands](/reference/rest-api/).

The shared `states` parameter (a list of active state paths) applies to all of them.
Many accept extra keyword arguments that pass straight through to the server.

## scenarios

Apply path/value overrides, recalculate, and return per-scenario results.

```python
client.scenarios(edits=[{"path": "engineering.count", "value": 11}], states=None)
```

## impact

Vary one input across a range of steps and observe the outputs at each step.

```python
client.impact(edit={"path": "battery.cells.total", "from": 5000, "to": 7000, "step": 250})
```

## projection

Walk forward in time, applying per-step edits, recalculating at each point.

| Param | Default | Meaning |
|---|---|---|
| `start_from` | — | Start date (ISO). |
| `unit` | `"day"` | `"day"` or `"month"`. |
| `step` | `1` | Step size in `unit`s. |
| `points` | `10` | Number of points to project. |
| `edits` | `[]` | Per-step changes (value or formula). |

```python
client.projection(start_from="2026-01-01", unit="month", points=12,
                  edits=[{"path": "starter.customers", "formula": "=starter.customers * 1.08"}])
```

## goal_seek

Find the value of a decision input that drives a target to a desired value.

```python
client.goal_seek(target={"path": "company.runway", "value": "12 month"},
                 decision={"path": "pro.mrr_per_customer"})
```

## optimize

Vary decision variables to maximize/minimize objectives, subject to constraints.

```python
client.optimize(
    objectives=[{"path": "company.arr", "goal": "max"}],
    decisions=[{"path": "starter.customers"}, {"path": "pro.customers"}],
    constraints=["company.burn_monthly < 80000 'EUR/month'"],
)
```

## sensitivity

Perturb each input by ±delta and report the response per variant.

```python
client.sensitivity(target={"path": "company.runway"},
                   inputs=[{"path": "company.cash"}, {"path": "engineering.salary"}])
```

## trace

Walk the upstream dependency tree of a target value.

```python
client.trace("company.runway", depth=5)
```

## csp

A backtracking constraint solver (MRV ordering) over formula constraints. Variables
declare a domain (`from`/`to`/`step` or boolean); constraints are formulas producing
a boolean; an error result prunes the branch; an optional objective ranks feasible
solutions. Available as the `csp` [REST command](/reference/rest-api/). Solves
scheduling, allocation, and puzzle-grade problems natively against your model.
