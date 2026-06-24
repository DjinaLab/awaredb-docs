---
title: Examples
description: Worked AwareDB models — each starts from the simple case, then adds cases, states and units to show how the answer recomputes itself.
---

Every example follows the same arc: build the simple model, read it back, then add a
variant or a state and watch the result re-resolve — without rewriting a formula. They
all run on the one engine, so euros and kilowatts are never silently mixed.

## Models

- **[Electric car](/examples/electric-car/)** — component decomposition, two independent
  state dimensions (`version` × `package`), typed lambdas, and real physics. The richest model.
- **[Train BOM](/examples/train-bom/)** — a five-level bill of materials that prices itself;
  swap one friction pad and the whole train plus its 30-year lifecycle recompute.
- **[Accounting firm](/examples/accounting-firm/)** — capacity and profit for a services
  firm; know the moment you sign a client whether the team is overbooked.
- **[SaaS startup](/examples/saas-startup/)** — plans, payroll, MRR, burn and runway, with
  OKRs that flip as you change a hire or a price.

## The same engine, any units

The car computes in km and m/s²; the P&L in EUR/month. Both are unit-aware end to end —
a dimensional mismatch surfaces as a warning, not a wrong number. Pick the one closest to
your domain and adapt the shape.

Then take any model further with a [what-if](/outcomes/what-if/),
a [forecast](/outcomes/forecast/), or [optimize & solve](/outcomes/optimize/).
