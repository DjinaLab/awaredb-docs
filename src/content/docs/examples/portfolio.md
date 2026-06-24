---
title: Portfolio allocation
description: Describe the assets, the constraints and the target once — then let AwareDB search across market states and return the allocation that hits it. Goal-seek, optimize and constraint-solve over one model.
---

The right allocation depends on state — the market, the holding period, the risk you'll
accept — and there are too many combinations to try by hand. So don't try them by hand.
Describe the assets and the constraints once; carry the market as a state; then ask the
engine to *find* the allocation, not eyeball it.

## 1. The simple portfolio

Each asset has an expected annual return, a risk weight, and a portfolio weight. The
portfolio rolls them up.

```python
client.update([
    {"uid": "asset", "abstract": True,
     "expected_return": 0, "risk": 0, "weight": 0,
     "contribution": "=weight * expected_return",
     "risk_contribution": "=weight * risk"},
    {"uid": "equities", "node_type": "asset", "expected_return": 0.08, "risk": 0.18, "weight": 0.6},
    {"uid": "bonds",    "node_type": "asset", "expected_return": 0.03, "risk": 0.06, "weight": 0.3},
    {"uid": "cash",     "node_type": "asset", "expected_return": 0.01, "risk": 0.005, "weight": 0.1},

    {"uid": "portfolio", "risk_cap": 0.10,
     "weight_total": "=sum(asset.weight)",
     "expected_return": "=sum(asset.contribution)",
     "risk": "=sum(asset.risk_contribution)",
     "fully_allocated": "=weight_total == 1",
     "within_risk": "=risk <= risk_cap"},
])
```

```python
client.get(["portfolio.expected_return", "portfolio.risk", "portfolio.within_risk"])
# expected_return  0.058
# risk             0.1265
# within_risk      False    ← this 60/30/10 split breaches the 0.10 risk cap
```

The 60/30/10 split looks reasonable and *is over budget on risk* — computed, not guessed.

## 2. Every market at once

Returns aren't fixed — they depend on the market. Declare a `market` state and link each
asset's return to it. Nothing else changes.

```python
client.update({"uid": "portfolio", "market": {"states": ["bull", "neutral", "bear"]}})
client.update([
    {"uid": "equities", "expected_return": {"linked": "portfolio.market",
        "cases": [["bull", 0.15], ["neutral", 0.08], ["bear", -0.05]]}},
    {"uid": "bonds", "expected_return": {"linked": "portfolio.market",
        "cases": [["bull", 0.02], ["neutral", 0.03], ["bear", 0.05]]}},
])

client.get("portfolio.expected_return")
# bull     0.097
# neutral  0.058
# bear    -0.014   ← the same allocation, every market, in one query
```

`portfolio.expected_return` never mentions the market — it became state-aware the moment
the asset returns did. You see all three outcomes of *one* allocation at once.

## 3. Let the engine find the allocation

Now state what "good" means and let AwareDB search. Three shapes of the same idea:

**Solve for a target — `goal_seek`.** What equity weight sits exactly on the risk cap?

```python
client.goal_seek(
    target={"path": "portfolio.risk", "value": 0.10},
    decision={"path": "equities.weight"},
)
# equities.weight ≈ 0.45
```

**Maximize under constraints — `optimize`.** Best neutral-market return that stays fully
allocated and within the risk cap:

```python
client.optimize(
    objectives=[{"path": "portfolio.expected_return", "goal": "max"}],
    decisions=[{"path": "equities.weight"}, {"path": "bonds.weight"}, {"path": "cash.weight"}],
    constraints=["portfolio.fully_allocated", "portfolio.within_risk"],
    states=["portfolio.market.neutral"],
)
# ≈ {equities: 0.33, bonds: 0.67, cash: 0.0}  →  return 0.047, risk 0.10
```

**Satisfy constraints — `csp`.** Find any allocation (in 0.1 steps) that's fully
allocated, within risk, and never loses money — *even in a bear market*:

```python
client.csp(
    variables=[
        {"path": "equities.weight", "domain": {"from": 0, "to": 1, "step": 0.1}},
        {"path": "bonds.weight",    "domain": {"from": 0, "to": 1, "step": 0.1}},
        {"path": "cash.weight",     "domain": {"from": 0, "to": 1, "step": 0.1}},
    ],
    constraints=[
        "portfolio.fully_allocated",
        "portfolio.within_risk",
        "portfolio.expected_return >= 0",   # checked across every market state
    ],
)
# returns the feasible allocations; the bear-market floor prunes the rest
```

You described the assets, the markets and the rules once. The engine searched the states
and returned the input that hits the target — that's the part you didn't write.

## What it demonstrates

- **Roll-up + constraints** — `sum(asset.contribution)`, `risk <= risk_cap` as plain formulas.
- **Every state at once** — one `market` state turns one allocation into three outcomes.
- **Solve, don't eyeball** — `goal_seek`, `optimize` and `csp` all run against the same model.
- **Constraints stay honest** — checks like the bear-market floor hold across every state.

See the [optimize & solve](/outcomes/optimize/) outcome and the
[analyses reference](/reference/analyses/) for parameters and response shapes.
