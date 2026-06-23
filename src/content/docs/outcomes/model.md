---
title: Model a system
description: Turn a real system — a product, a company, a process — into a graph of nodes, relations and formulas that computes itself.
---

**Outcome:** capture how something actually works as a living model, so every
derived number is computed, not copied.

## When you want this

- You have a system with parts that depend on each other (a product and its
  components, a company and its plans/roles/costs) and you're tired of spreadsheets
  where one change means re-deriving everything by hand.
- You want one source of truth where the inputs are explicit and the outputs are
  formulas — always consistent, always recomputed.

## How AwareDB does it

1. **Define the pieces as nodes.** Each component, plan, or role is a node with
   properties.
2. **Reuse with abstract templates.** Define a type once (`battery`, `plan`,
   `role`), then create concrete instances that inherit it.
3. **Connect them.** Reference other nodes by `uid`; relations record the
   dependency so the engine knows what to recompute.
4. **Make the outputs formulas.** `mrr = sum(plan.mrr)`, `range = capacity *
   efficiency`. Units travel with the numbers.

```python
client.update([
    {"uid": "plan", "abstract": True,
     "mrr_per_customer": "=0 'EUR/month'", "customers": 0,
     "mrr": "=mrr_per_customer * customers"},
    {"uid": "pro", "node_type": "plan",
     "mrr_per_customer": "=99 'EUR/month'", "customers": 90},
    {"uid": "company", "mrr": "=sum(plan.mrr)"},
])

client.get("company.mrr")
```

## What you get

A model where changing one input ripples through every dependent value
automatically, with units kept correct and every edit reversible. From here the
same model powers every other outcome — [what-if](/outcomes/what-if/),
[forecasting](/outcomes/forecast/), and [optimization](/outcomes/optimize/) — with
no extra modeling.

## Go deeper

- [Modeling guide](/start/modeling/) — nodes, relations, inheritance, states.
- [Electric car example](/examples/electric-car/) — a rich multi-component model.
- [SaaS startup example](/examples/saas-startup/) — a simple business model.
