---
title: Accounting firm
description: Capacity and profit for a services firm — model it once, then know the moment you sign a client whether the team is overbooked. Add states to see every scenario at once.
---

Hours, rates and headcount usually live in three different places, so the question
"if we sign this client, is the team now overbooked?" takes a meeting to answer. Model
the firm once and the answer is always already computed.

## 1. The simple firm

Each service line earns a fee per client and consumes hours per client. Accountants
supply capacity. The firm node rolls both up.

```python
client.update([
    # Service lines — revenue and hours both derive from clients.
    {"uid": "service", "abstract": True,
     "rate": "=0 'EUR/hour'", "hours_per_client": "0 hour", "clients": 0,
     "fee_per_client": "=rate * hours_per_client",
     "revenue": "=fee_per_client * clients",
     "hours": "=hours_per_client * clients"},
    {"uid": "bookkeeping", "node_type": "service", "rate": "=60 'EUR/hour'", "hours_per_client": "8 hour", "clients": 25},
    {"uid": "tax_filing",  "node_type": "service", "rate": "=90 'EUR/hour'", "hours_per_client": "4 hour", "clients": 18},
    {"uid": "payroll",     "node_type": "service", "rate": "=55 'EUR/hour'", "hours_per_client": "3 hour", "clients": 20},
    {"uid": "advisory",    "node_type": "service", "rate": "=140 'EUR/hour'", "hours_per_client": "6 hour", "clients": 6},

    # Accountants — each supplies monthly capacity.
    {"uid": "accountant", "abstract": True, "salary": "0 EUR", "capacity": "0 hour"},
    {"uid": "partner", "node_type": "accountant", "salary": "90000 EUR", "capacity": "70 hour"},
    {"uid": "senior",  "node_type": "accountant", "salary": "65000 EUR", "capacity": "130 hour"},
    {"uid": "junior1", "node_type": "accountant", "salary": "38000 EUR", "capacity": "120 hour"},
    {"uid": "junior2", "node_type": "accountant", "salary": "38000 EUR", "capacity": "120 hour"},

    # The firm — capacity and P&L, all from the parts above.
    {"uid": "firm",
     "revenue_monthly": "=sum(service.revenue)",
     "hours_needed": "=sum(service.hours)",
     "capacity_total": "=sum(accountant.capacity)",
     "utilization": "=hours_needed / capacity_total",
     "overbooked": "=utilization > 1",
     "payroll_monthly": "=sum(accountant.salary) / (12 'month')",
     "overhead_monthly": "5000 EUR",
     "costs_monthly": "=payroll_monthly + overhead_monthly",
     "profit_monthly": "=revenue_monthly - costs_monthly",
     "margin_pct": "=profit_monthly / revenue_monthly"},
])
```

Read it back:

```python
client.get(["firm.utilization", "firm.overbooked", "firm.profit_monthly"])
# utilization  0.836   (368 h needed / 440 h capacity)
# overbooked   False
# profit_monthly  2,570 EUR
```

The numbers are *computed*: 368 billable hours against 440 of capacity, €26,820 revenue
less €24,250 of payroll and overhead.

## 2. Sign a client

You win four new advisory clients. Update the one input — nothing else.

```python
client.update({"uid": "advisory", "clients": 10})

client.get(["firm.utilization", "firm.overbooked", "firm.profit_monthly"])
# utilization  0.891   (392 h / 440 h)
# overbooked   False
# profit_monthly  5,930 EUR
```

Advisory's revenue, the firm's hours, utilization, profit and margin all recomputed.
You never touched them — they're downstream of `advisory.clients`.

## 3. Every scenario at once

Don't decide one client at a time — carry the whole growth plan as a **state**. Declare
two states on the firm and link the inputs that differ:

```python
client.update({
    "uid": "firm",
    "plan": {"states": ["base", "growth"]},
})
client.update({
    "uid": "advisory",
    "clients": {"linked": "firm.plan", "cases": [["base", 6], ["growth", 20]]},
})
```

Now a single query carries both scenarios:

```python
client.get("firm.utilization")
# base    0.836   →  overbooked False
# growth  1.027   →  overbooked True   ← the team is over capacity

client.get("firm.overbooked", states=["firm.plan.growth"])
# True
```

`utilization` and `overbooked` never mention the plan — they became state-aware the
moment `advisory.clients` did. You see the cliff *before* you sign, not after. The fix
(hire a senior, who only joins under `growth`) is the same move: link `capacity` to the
state and the firm re-resolves.

## What it demonstrates

- **Roll-up from the parts** — `sum(service.revenue)`, `sum(accountant.capacity)`.
- **Units as proof** — hours, EUR/hour and EUR stay correct; `utilization` is a clean ratio.
- **Write-and-forget** — change `advisory.clients`; everything downstream recomputes itself.
- **Every state at once** — one `plan` state turns a one-off question into a standing answer.

Try a [what-if](/outcomes/what-if/) on the rates, or [optimize](/outcomes/optimize/) the
hiring that keeps utilization under 1 at the lowest cost.
