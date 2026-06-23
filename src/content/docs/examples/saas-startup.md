---
title: SaaS startup
description: A simple business model in AwareDB — plans and MRR, roles and payroll, company burn and runway, and OKRs — then ask it a what-if.
---

The plain-business counterpart to the [electric car](/examples/electric-car/). Same
engine, business units instead of physical ones. Plans roll up to MRR, roles roll up
to payroll, and the company node derives burn and runway.

## 1. Plans → MRR

A `plan` template computes `mrr` from price × customers; each tier is an instance.

```python
client.update([
    {"uid": "plan", "abstract": True,
     "mrr_per_customer": "=0 'EUR/month'", "customers": 0,
     "mrr": "=mrr_per_customer * customers"},
    {"uid": "starter", "node_type": "plan",
     "mrr_per_customer": "=29 'EUR/month'", "customers": 220},
    {"uid": "pro", "node_type": "plan",
     "mrr_per_customer": "=99 'EUR/month'", "customers": 90},
    {"uid": "enterprise", "node_type": "plan",
     "mrr_per_customer": "=499 'EUR/month'", "customers": 12},
])
```

## 2. Roles → payroll

```python
client.update([
    {"uid": "role", "abstract": True, "salary": "0 EUR", "count": 0,
     "cost_monthly": "=salary * count / (12 'month')"},
    {"uid": "engineering", "node_type": "role", "salary": "85000 EUR", "count": 6},
    {"uid": "sales", "node_type": "role", "salary": "60000 EUR", "count": 3},
    {"uid": "gna", "node_type": "role", "salary": "55000 EUR", "count": 2},
])
```

## 3. The company — burn & runway

```python
client.update({
    "uid": "company", "cash": "750000 EUR",
    "mrr": "=sum(plan.mrr)",
    "arr": "=mrr * (12 'month')",
    "customers": "=sum(plan.customers)",
    "arpa": "=mrr / customers",
    "payroll_monthly": "=sum(role.cost_monthly)",
    "other_monthly": "=12000 'EUR/month'",
    "burn_monthly": "=payroll_monthly + other_monthly - mrr",
    "runway": "=cash / burn_monthly",
})
```

## 4. OKRs

```python
client.update([
    {"uid": "okr", "abstract": True, "target": 0, "current": 0,
     "progress": "=current / target", "on_track": "=progress >= 0.7"},
    {"uid": "okr_arr", "node_type": "okr",
     "target": "600000 EUR", "current": "=company.arr"},
    {"uid": "okr_runway", "node_type": "okr",
     "target": "12 month", "current": "=company.runway"},
])
```

## 5. Ask it a what-if

> *"What happens to runway if we hire five more engineers?"*

```python
client.scenarios(edits=[{"path": "engineering.count", "value": 11}])
```

Or solve it the other way — *what price keeps 12 months of runway?*

```python
client.goal_seek(
    target={"path": "company.runway", "value": "12 month"},
    decision={"path": "pro.mrr_per_customer"},
)
```

Same model, every question answered deterministically and in the right units. See
the [outcomes](/outcomes/model/) for the full menu.
